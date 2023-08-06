import * as dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
dayjs.extend(duration)
dayjs.extend(relativeTime)

export const formatDate = (datestr: string) => {
  const memoTime = dayjs(datestr)
  const diffSec = memoTime.diff(dayjs(), 'second')
  const diffDays = memoTime.diff(dayjs(), 'day')

  if (diffDays < 0)
    return memoTime.format('YYYY-MM-DD HH:mm:ss')

  return dayjs.duration(diffSec, 'second').humanize(true)
}

export const localTime = (datestr: string) => {
  return dayjs(datestr).format('YYYY-MM-DD HH:mm:ss')
}
