/**
 * 对象转成query参数字符串, 微信小程序专用函数
 * 微信小程序不存在 URLSearchParams 类, 单独写一个函数
 */
export const wx_objToQuery = (params: Record<string, any>) => {
    let queryString = ''

    for (let i in params) {
        let value = params[i]
        // 若对象的value值为数组，则进行join打断
        if (Array.isArray(value)) {
            value = value.join(",")
        }
        queryString += `&${i}=${value}`
    }

    // replace返回一个新的字符串，并把第一个&替换为?
    queryString = queryString.replace('&', '?')

    return queryString
}


/**
 * 对象转成query参数字符串
 */
export const objToQuery = (params: Record<string, any>) => {
    return Object.entries(params).length ? `?${new URLSearchParams(params)}` : ''
}

/**
 * 从 url 中获取query转成对象
 */
export const getQuery = (url: string) => {
    const queryString = new URL(url).searchParams

    const params: Record<string, any> = {}

    for (let [key, value] of queryString.entries()) {
        params[key] = value
    }

    return params
}