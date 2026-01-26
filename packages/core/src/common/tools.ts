import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/zh-cn.js'
import crypto from 'node:crypto'

export const formatDate = (date: Date) => {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  const now = dayjs()
  const diffMonths = now.diff(date, 'month')
  if (diffMonths > 3) {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
  return dayjs(date).fromNow()
}

export const make_hash = (str: string): string => {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string')
  }

  return crypto.createHash('sha256').update(str, 'utf8').digest('hex')
}
