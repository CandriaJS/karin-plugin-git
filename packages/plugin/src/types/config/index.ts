export interface ClientConfigType {
  /// 推送任务执行时间
  cron: string
  /// 代理地址
  proxy: string
  /// github访问令牌
  token: string
}
export interface ConfigType {
  /// GitHub配置
  github: ClientConfigType
  /// Gitee配置
  gitee: ClientConfigType
  /// GitCode配置
  gitcode: ClientConfigType
  /// Cnb配置
  cnb: ClientConfigType
}
