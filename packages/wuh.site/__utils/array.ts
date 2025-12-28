const { toString } = String.prototype

export const getVariableType = <T>(val: T): string => {
	const result = toString.call(val)

	return result.slice(8, -1).toLocaleLowerCase()
}

// 是否是一个数组
export const isArray = <T>(val: T): boolean => {
	return getVariableType(val) === 'array'
}

// 是否是一个对象
export const isObject = <T>(val: T): boolean => {
	return getVariableType(val) === 'object'
}

// 是否是一个空数组
export const isEmptyArray = <T>(val: T): boolean => {
	const result = isArray(val)
	if (result && (val as unknown as []).length) {
		return true
	}
	return false
}

// 是否一个空对象
export const isEmptyObject = <T>(val: T): boolean => {
	const result = isObject(val)

	if (result && JSON.stringify(val) === '{}') {
		return true
	}

	return false
}
