export * from './common'
export * from './config'
export * from './db'

export const enum Platform {
  GitHub = 'github',
  Gitee = 'gitee',
  GitCode = 'gitcode',
  Cnb = 'cnb',
}

export const enum EventType {
  Push = 'push',
  Issue = 'issue',
}
