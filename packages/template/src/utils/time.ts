import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/zh-cn.js'

export const toRelativeTime = (date: Date) => {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  const now = dayjs()
  const diffMonths = now.diff(date, 'month')
  if (diffMonths > 3) {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
  return dayjs(date).fromNow()
}
