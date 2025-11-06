import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import 'dayjs/locale/zh-cn.js'

export const formatDate = (date: Date) => {
  dayjs.extend(relativeTime)
  dayjs.locale('zh-cn')
  return dayjs(date).fromNow()
}
