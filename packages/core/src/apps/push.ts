import { Config } from "@/common"
import { isEmpty } from "es-toolkit/compat"
import { platform } from "@/models"
import karin, { logger } from "node-karin"

export const github = karin.task(
  'commit:push:github',
  Config.github.cron || '0 */5 * * * *',
  async () => {
    const token = Config.token.github
    if (isEmpty(token)) return logger.warn('未配置GitHub Token, 跳过任务')
    try {
      const client = new platform.github.Push()
      await client.action()
    } catch (e) {
      logger.error(e)
    }
  },
)

export const gitee = karin.task(
  'commit:push:gitee',
  Config.gitee.cron || '0 */5 * * * *',
  async () => {
    const token = Config.token.gitee
    if (isEmpty(token)) return logger.warn('未配置 Gitee Token, 跳过任务')
    try {
      const client = new platform.gitee.Push()
      await client.action()
    } catch (e) {
      logger.error(e)
    }
  },
)

export const gitcode = karin.task(
  'commit:push:gitcode',
  Config.gitcode.cron || '0 */5 * * * *',
  async () => {
    const token = Config.token.gitcode
    if (isEmpty(token)) return logger.warn('未配置 GitCode Token, 跳过任务')
    try {
      const client = new platform.gitcode.Push()
      await client.action()
    } catch (e) {
      logger.error(e)
    }
  },
)
export const cnbcool = karin.task(
  'commit:push:cnbcool',
  Config.cnbcool.cron || '0 */5 * * * *',
  async () => {
    const token = Config.token.cnbcool
    if (isEmpty(token)) return logger.warn('未配置 CnbCol Token, 跳过任务')
    try {
      const client = new platform.cnbcool.Push()
      await client.action()
    } catch (e) {
      logger.error(`推送CnbCool仓库提交信息失败: ${e}`)
    }
  },
)