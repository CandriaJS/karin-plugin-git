import { Role } from '@/types/help';
import path from 'node:path';
import { full as emoji } from 'markdown-it-emoji';
import { tasklist } from '@mdit/plugin-tasklist';
import karin, { segment } from 'node-karin';

import { Version } from '@/root';
import { createCanvas, Image, SKRSContext2D } from 'canvas';
import { helpList } from './help';
import MarkdownIt from 'markdown-it';

/**
 * 渲染精度
 * @param {string} pct 缩放百分比
 */
function scale(pct = 1) {
  const renderScale = 100;
  const scale = Math.min(2, Math.max(0.5, renderScale / 100));
  pct = pct * scale;
  return `style=transform:scale(${pct})`;
}

/**
 * 渲染
 * @param name 文件名称 不包含 `.html`
 * @param params 渲染参数
 */
const Render = {
  async render(name: string, params: Record<string, any> = {}) {
    name = name.replace(/.html$/, '');
    const root = `${Version.Plugin_Path}/resources`;
    const img = await karin.render({
      type: 'jpeg',
      encoding: 'base64',
      name: path.basename(name),
      file: `${root}/${name}.html`,
      data: {
        _res_path: `${Version.Plugin_Path}/resources`.replace(/\\/g, '/'),
        defaultLayout:
          `${Version.Plugin_Path}/resources/common/layout/default.html`.replace(
            /\\/g,
            '/',
          ),
        sys: {
          scale: scale(params.scale ?? 1),
        },
        copyright: `${Version.Bot_Name}<span class="version"> ${Version.Bot_Version}</span> & ${Version.Plugin_Name}<span class="version"> ${Version.Plugin_Version}`,
        ...params,
      },
      screensEval: '#containter',
      multiPage: 12000,
      pageGotoParams: {
        waitUntil: 'networkidle0',
        timeout: 60000,
      },
    });

    return segment.image(
      `${img.includes('base64://') ? img : `base64://${img}`}`,
    );
  },

  // TODO: 重构，重构😡
  async help(role: Role) {
    const CARD_WIDTH = 450;
    const CARD_HEIGHT = 120;
    const CARD_MARGIN = 20;
    const CARDS_PER_ROW = 3;
    const PADDING = 50;
    const CARD_RADIUS = 15;
    const font = 'Douyin Sans,Smiley Sans';

    const canvasWidth =
      PADDING * 2 +
      CARD_WIDTH * CARDS_PER_ROW +
      (CARDS_PER_ROW - 1) * CARD_MARGIN;

    let totalHeight = 160;
    totalHeight += 100;

    for (const group of helpList) {
      if (group.auth && group.auth !== role) continue;
      totalHeight += 60;
      const itemCount = Math.ceil(group.list.length / CARDS_PER_ROW);
      totalHeight += itemCount * (CARD_HEIGHT + CARD_MARGIN);
      totalHeight += 60;
    }

    const canvas = createCanvas(canvasWidth, totalHeight + PADDING);
    const ctx = canvas.getContext('2d');

    const bgImage = new Image();
    bgImage.src = path.join(
      Version.Plugin_Path,
      'resources',
      'help',
      'bg.webp',
    );
    await new Promise((resolve) => {
      bgImage.onload = () => resolve(null);
    });

    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    ctx.font = `bold 48px ${font}`;
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';
    ctx.fillText('git插件帮助页面', canvas.width / 2, 80);

    ctx.font = `24px ${font}`;
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'center';
    ctx.fillText('功能说明与使用指南', canvas.width / 2, 130);

    let yOffset = 180;

    for (const group of helpList) {
      if (group.auth && group.auth !== role) continue;
      ctx.font = `bold 36px ${font}`;
      ctx.fillStyle = '#34495e';
      ctx.textAlign = 'left';
      ctx.fillText(group.group, PADDING, yOffset);

      yOffset += 60;

      let xOffset = PADDING;
      for (const item of group.list) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xOffset + CARD_RADIUS, yOffset);
        ctx.lineTo(xOffset + CARD_WIDTH - CARD_RADIUS, yOffset);
        ctx.quadraticCurveTo(
          xOffset + CARD_WIDTH,
          yOffset,
          xOffset + CARD_WIDTH,
          yOffset + CARD_RADIUS,
        );
        ctx.lineTo(xOffset + CARD_WIDTH, yOffset + CARD_HEIGHT - CARD_RADIUS);
        ctx.quadraticCurveTo(
          xOffset + CARD_WIDTH,
          yOffset + CARD_HEIGHT,
          xOffset + CARD_WIDTH - CARD_RADIUS,
          yOffset + CARD_HEIGHT,
        );
        ctx.lineTo(xOffset + CARD_RADIUS, yOffset + CARD_HEIGHT);
        ctx.quadraticCurveTo(
          xOffset,
          yOffset + CARD_HEIGHT,
          xOffset,
          yOffset + CARD_HEIGHT - CARD_RADIUS,
        );
        ctx.lineTo(xOffset, yOffset + CARD_RADIUS);
        ctx.quadraticCurveTo(xOffset, yOffset, xOffset + CARD_RADIUS, yOffset);
        ctx.closePath();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;

        const gradient = ctx.createLinearGradient(
          xOffset,
          yOffset,
          xOffset,
          yOffset + CARD_HEIGHT,
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, '#f8f9fa');
        ctx.fillStyle = gradient;

        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();

        ctx.font = `32x ${font}`;
        ctx.fillStyle = '#3498db';
        ctx.textAlign = 'center';
        const iconSize = 40;
        let icon = new Image();
        icon.src = item.icon;
        icon.width = iconSize;
        icon.height = iconSize;
        await new Promise((resolve) => {
          icon.onload = () => resolve(null);
        });
        const iconX = xOffset + 20;
        const iconY = yOffset + (CARD_HEIGHT - iconSize) / 2;
        ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);

        ctx.font = `24px ${font}`;
        ctx.fillStyle = '#2c3e50';
        ctx.textAlign = 'left';
        const titleLines = wrapText(
          ctx,
          item.title,
          xOffset + 80,
          yOffset + 40,
          CARD_WIDTH - 100,
          30,
        );

        ctx.font = `18px ${font}`;
        ctx.fillStyle = '#7f8c8d';
        const descY = yOffset + 40 + titleLines * 30;
        wrapText(ctx, item.desc, xOffset + 80, descY, CARD_WIDTH - 100, 24);

        xOffset += CARD_WIDTH + CARD_MARGIN;
        if (xOffset > canvas.width - CARD_WIDTH - PADDING) {
          xOffset = PADDING;
          yOffset += CARD_HEIGHT + CARD_MARGIN;
        }
      }

      if (xOffset !== PADDING) yOffset += CARD_HEIGHT + CARD_MARGIN;
      yOffset += 60;
    }

    const base64 = (await canvas.encode('png')).toString('base64');
    return segment.image(`base64://${base64}`);
  },
};

/// 绘制文本,自动换行
function wrapText(
  ctx: SKRSContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split('');
  let line = '';
  let lines = 1;

  for (const word of words) {
    const testLine = line + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
      lines++;
    } else line = testLine;
  }
  ctx.fillText(line, x, y);
  return lines;
}

export { Render };

export const render_markdown = async (markdown: string) => {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
  });
  md.use(emoji);
  md.use(tasklist);
  md.renderer.rules.bullet_list_open = () => '<ul style="list-style: none;">';
  return Promise.resolve(md.render(markdown));
};
