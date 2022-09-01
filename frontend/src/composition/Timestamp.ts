import { timeFormat, TimeFormatType, getStartOfDay, getStartOfYear } from '@/utils/utils'

const formatTime = (chatTime: number) => {
  const nowDate = getStartOfDay(new Date().getTime()).getTime()
  const time = getStartOfDay(new Date(chatTime).getTime()).getTime()

  const nowDateYear = getStartOfYear(nowDate).getTime()
  const nowTimeYear = getStartOfYear(time).getTime()

  const distanceMill = nowDate - time
  // 同一天
  if (distanceMill === 0) return '今天'
  // 昨天
  else if (distanceMill < 86400000 * 2 && distanceMill >= 86400000) return '昨天'
  // 前天以上，但沒有跨到年
  else if(nowDateYear - nowTimeYear === 0) return `${timeFormat(TimeFormatType.MMDD, time)} (${timeFormat(TimeFormatType.EEEEE, time)})`
  // 有跨到年
  else  return `${timeFormat(TimeFormatType.YYYYMMDD, time)} (${timeFormat(TimeFormatType.EEEEE, time)})`
  
}
export default function () {
  const getTimestamp = (time: number | undefined) => {
    if (!time) return {
      timeText: ''
    }
    const dayTime = getStartOfDay(time)
    return formatTime(dayTime.getTime())
  }

  return {
    getTimestamp,
    getStartOfDay
  }
}

