import karin, { Message, getRenderCount, logger } from 'node-karin'
import { Render } from '@/common'

export const test = karin.command('test', async (e: Message) => {
    logger.mark(`[render] pid=${process.pid} cache=${getRenderCount()}`)
  // const img = await Render.render(
  //   Email({
  //     title: '测试邮件',
  //     content: '这是测试邮件',
  //   }),
  //   "email"
  // )
  // await e.reply(img)
})
