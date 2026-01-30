import { ConfigType as ProxyConfigType } from './proxy'
import { ConfigType as TokenConfigType } from './token'

export interface CronConfigType {
  cron: string
}

export interface ConfigType {
  /// GitHub配置
  github: CronConfigType
  /// Gitee配置
  gitee: CronConfigType
  /// GitCode配置
  gitcode: CronConfigType
  /// Cnb配置
  cnbcool: CronConfigType
  /// 代理配置
  proxy: ProxyConfigType
  /// 访问令牌配置
  token: TokenConfigType
}
