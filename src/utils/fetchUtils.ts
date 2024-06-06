const createFetchWithTimout = (timeout = 10000) => {

    return function (url: string, options: any){

        return new Promise((resolve: (value: any) => void, reject: (error: any) => void) => {

            const signalController = new AbortController()

            fetch(url, {
                ...options,
                signal: signalController.signal
            }).then(resolve, reject)

            setTimeout(() => {
                reject(new Error('fetch timeout'))
                //取消请求
                signalController.abort()
            }, timeout)
        })

    }
}

const requestWithTimout5000 = createFetchWithTimout(5000)
const requestWithTimout8000 = createFetchWithTimout(8000)