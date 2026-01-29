import { client } from '@/models'
import { Platform } from '@/types'
import { BasePush } from '../push'

export class Push extends BasePush {
  constructor() {
    super(Platform.GitHub, client.github())
  }
}
