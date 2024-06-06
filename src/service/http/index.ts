import axios, {AxiosRequestConfig, AxiosResponse, Canceler, InternalAxiosRequestConfig} from 'axios'
import {useUserStore} from "@/store/userStore"
import router from "@/router"
import {APP_VERSION, BASE_URL, HTTP_CLIENT_TYPE, HTTP_CONTENT_TYPE, HTTP_TIMEOUT} from "@/config"

const http = axios.create({
    baseURL: BASE_URL,
    timeout: HTTP_TIMEOUT,
    // 跨域时候允许携带凭证
    withCredentials: true,
    headers: {
        'Content-Type': HTTP_CONTENT_TYPE,
        'Client-Type': HTTP_CLIENT_TYPE,
        'App-Version': APP_VERSION
    },
})


//region 请求的取消

const pendingMap = new Map<string, Canceler>()

function getPendingKey(config: AxiosRequestConfig) {

    let {url, method, params, data} = config

    if (typeof data === 'string') {
        // response里面返回的config.data是个字符串对象
        data = JSON.parse(data)
    }

    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

function addPending(config: AxiosRequestConfig) {
    const pendingKey = getPendingKey(config)

    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingMap.has(pendingKey)) {
            pendingMap.set(pendingKey, cancel)
        }
    })
}

function removePending(config: AxiosRequestConfig) {

    const pendingKey = getPendingKey(config)

    if (pendingMap.has(pendingKey)) {
        const cancel = pendingMap.get(pendingKey)

        cancel && cancel("请求取消")
        pendingMap.delete(pendingKey)
    }
}

function clearPending() {

    pendingMap.forEach(cancel => {
        cancel && cancel("请求取消")
    })

    pendingMap.clear()
}

//endregion

//region 请求拦截器

const requestOnFulfilledHandler = (config: InternalAxiosRequestConfig<any>) => {

    removePending(config)
    addPending(config)

    const token = useUserStore().getToken()

    if (token) {
        config.headers.Authorization = token
    }

    if (config.params) {

        const keys = Object.keys(config.params)

        if (keys.length && config.params[keys[0]] !== null) {

            let url: string = config.url + '?'

            for (const key of keys) {
                if (config.params[key] !== null) {
                    url += `${key}=${config.params[key]}&`
                }
            }

            url = url.substring(0, url.length - 1)

            config.params = {}

            config.url = url
        }
    }

    return config
}

const requestOnRejectedHandler = (error: any) => {
    return Promise.reject(error)
}

//endregion 请求拦截器

//region 响应拦截器

const responseOnFulfilledHandler = (response: AxiosResponse): Promise<any> => {

    const {config} = response

    if (config.responseType === 'blob') {
        // @ts-ignore 如果是文件流，直接过
        return response
    }

    removePending(response.config)

    const {code} = response.data

    switch (code) {
        case 0:
            return response.data
        case 401:
            // 清除所有请求
            clearPending()
            router.replace({path: '/login'})
            break
    }

    return Promise.reject(response.data)
}

const responseOnRejectedHandler = (e: any) => {

    console.log("请求失败 e = ", e)

    let errorMsg = e.message

    if (errorMsg === 'Network Error') {
        errorMsg = "未连接到服务器"
    } else if (errorMsg.includes('timeout')) {
        errorMsg = "请求超时"
    } else if (errorMsg.includes('Request failed with status code')) {
        let errorCode = errorMsg.toString().match(/\d+/g)[0] //在报错信息中提取错误码
        errorMsg = "请求失败, 错误码 " + errorCode
    }

    return Promise.reject({code: 500, msg: errorMsg})
}

//endregion 响应拦截器


http.interceptors.request.use(requestOnFulfilledHandler, requestOnRejectedHandler)
http.interceptors.response.use(responseOnFulfilledHandler, responseOnRejectedHandler)

export default http