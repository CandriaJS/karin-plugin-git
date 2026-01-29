export * from './common'
export * from './config'
export * as db from './db'

export const enum Platform {
  GitHub = "GitHub",
  Gitee = "Gitee",
  GitCode = "GitCode",
  CnbCool = "CnbCool",
}

export const enum EventType {
  Push = 'push',
  Release = 'release',
}