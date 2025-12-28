import dayjs from 'dayjs'

dayjs.locale('zh-cn')

export type TTimeType = Date | string | number | undefined

// 完整的日期时间当前时区格式化
export const localDateTimeString = (time: TTimeType): string => {
	return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 单纯日期年月日
export const localDateString = (time: TTimeType): string => {
	return dayjs(time).format('YYYY-MM-DD')
}

// 十二小时制 时间格式化s
export const localTimeString = (time: TTimeType): string => {
	return dayjs(time).format('hh:mm:ss')
}
