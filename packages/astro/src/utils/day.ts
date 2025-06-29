type TDayjs = {
  format: (type: string|number|Date) => string,
  toDateTime: () => {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
    fullDate: Date,
    fullTime: string,
    date: string,
    time: string,
    datetime: string
  }
} | null | undefined


/**
 * 
 * @param { number|string|Date } date
 * @returns 
 */
const dayjs = function(date: string|number|Date): TDayjs {
  const safeDate = new Date(date)
  if (safeDate.toString() === 'Invalid Date') {
    console.warn('dayjs: Invalid date provided:', date)
    return null
  }

  return {
    toDateTime() {
      const dmd = safeDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-')

      const hms = safeDate.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      return {
        year: safeDate.getFullYear(),
        month: safeDate.getMonth() + 1,
        day: safeDate.getDate(),
        hour: safeDate.getHours(),
        minute: safeDate.getMinutes(),
        second: safeDate.getSeconds(),
        fullDate: safeDate,
        fullTime: hms,
        date: dmd,
        time: hms,
        datetime: `${dmd} ${hms}`,
      }
    },
    /**
     * 
     * @param { string|number|Date } type // YYYY-MM-DD HH:mm:ss 
     * @returns 
     */
    format(type) {
      const dmd = safeDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-')

      const hms = safeDate.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })

      return `${dmd} ${hms}`
    }
  }
}

// export default dayjs

type TDateInput = string | number | Date

type TFormatType = 'yyyy-MM-dd HH:mm:ss' | 'yyyy-MM-dd' | 'HH:mm:ss' | 'MM-dd HH:mm' | 'yyyy-MM-dd HH:mm' | 'yyyy-MM-dd HH:mm:ss' | 'MM-dd' | 'HH:mm' | 'yyyy-MM-DD HH:mm:ss' | 'yyyy-MM-DD' | 'HH:mm:ss' | 'MM-DD HH:mm' | 'yyyy-MM-DD HH:mm' | 'MM-DD' | 'HH:mm' | 'd' | 'weekday'

class TimeFlow {
  dateValue: Date;
  weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  static create(date: TDateInput) {
    return new TimeFlow(date)
  }

  constructor(date: TDateInput) {
    console.warn('TimeFlow is coming! This is a placeholder for future time-related utilities.')

    this.dateValue = date ? new Date(date) : new Date()
  }

  format(formatType: TFormatType = 'yyyy-MM-dd') {
    const year = this.dateValue.getFullYear()
    const month = this.dateValue.getMonth() + 1
    const day = this.dateValue.getDate()
    const hours = this.dateValue.getHours()
    const minutes = this.dateValue.getMinutes()
    const seconds = this.dateValue.getSeconds()
    const weekday = this.dateValue.getDay()

    return formatType.replace(/yyyy/g, String(year))
      .replace(/MM/g, String(month).padStart(2, '0'))
      .replace(/M/g, String(month))
      .replace(/DD/g, String(day).padStart(2, '0'))
      .replace(/D/g, String(day))
      .replace(/HH/g, String(hours).padStart(2, '0'))
      .replace(/H/g, String(hours))
      .replace(/mm/g, String(minutes).padStart(2, '0'))
      .replace(/m/g, String(minutes))
      .replace(/ss/g, String(seconds).padStart(2, '0'))
      .replace(/s/g, String(seconds))
      .replace(/d/g, String(weekday))
      .replace(/weekday/g, this.weekdays[weekday])
  }

  add() {}

  subtract() {}
}

export default TimeFlow