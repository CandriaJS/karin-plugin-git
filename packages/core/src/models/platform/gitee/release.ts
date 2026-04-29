import { client } from '@/models'
import { Platform } from '@/types'
import { BaseRelease } from '../release'

export class Release extends BaseRelease {
  constructor() {
    super(Platform.Gitee, client.gitee())
  }
}
