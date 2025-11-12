import { logger } from 'node-karin'
import axios from 'node-karin/axios'

import { Version } from '@/root'
import { InitDb } from '@/models/db'

export const KARIN_PLUGIN_INIT = async () => {
  let responseData = '加载失败'
  try {
    let api_url = 'https://api.wuliya.cn'
    const response = await axios.get(
      `${api_url}/api/image/count?name=${Version.Plugin_Name}&type=json`,
      { timeout: 500 },
    )
    responseData = response.data.data.count
  } catch {
    logger.error(logger.chalk.red.bold('⚠️ 访问统计数据失败，超时或网络错误'))
  }
  await InitDb()
  logger.info(logger.chalk.bold.rgb(0, 255, 0)('========= 🌟🌟🌟 ========='))
  logger.info(
    logger.chalk.bold.blue('🌍 当前运行环境: ') +
      logger.chalk.bold.white(`${Version.Bot_Name}`) +
      logger.chalk.gray(' | ') +
      logger.chalk.bold.green('🏷️ 运行版本: ') +
      logger.chalk.bold.white(`V${Version.Bot_Version}`) +
      logger.chalk.gray(' | ') +
      logger.chalk.bold.yellow('📊 运行插件总访问/运行次数: ') +
      logger.chalk.bold.cyan(responseData),
  )
  logger.info(
    logger.chalk.bold.rgb(255, 215, 0)(`✨ ${Version.Plugin_Name} `) +
      logger.chalk.bold.rgb(255, 165, 0).italic(Version.Plugin_Version) +
      logger.chalk.rgb(255, 215, 0).bold(' 载入成功 ^_^'),
  )
  logger.info(logger.chalk.green.bold('========================='))
}
