import {getUserIdFromToken} from "@/utils/jwtUtils"


class WebsocketClient {
    private userId: string | null = null
    private client: WebSocket | null = null

    constructor() {}

    connect(url: string, token: string) {
        this.userId = getUserIdFromToken(token)
        this.client = new WebSocket(`${url}?token=${token}`)

        this.addOnOpen(this.defaultOnOpen)
        this.addOnClose(this.defaultOnClose)
        this.addOnError(this.defaultOnError)
        this.addOnMessageGroup()
    }

    close() {
        if (this.client) {
            this.client.close()

            this.removeOnOpen(this.defaultOnOpen)
            this.removeOnClose(this.defaultOnClose)
            this.removeOnError(this.defaultOnError)

            this.client = null
        }
    }

    private defaultOnOpen = () => {
        console.log("WebsocketClient: 连接成功")
    }

    private defaultOnClose = () => {
        console.log("WebsocketClient: 关闭连接")
    }

    private defaultOnError = (e: Event) => {
        console.log("WebsocketClient: 发生错误")
    }

    send(msg: WebsocketMsg) {

        const json = JSON.stringify(msg)

        return new Promise((resolve, reject) => {

            if (this.client == null) {
                reject("发送失败, ws未连接")
            }

            // readyState: CONNECTING, OPEN, CLOSING, CLOSED
            if (this.client!.readyState == WebSocket.OPEN) {
                this._send(json)
                // 如果未正在连接状态, 则等待3秒钟
            } else if (this.client!.readyState == WebSocket.CONNECTING) {

                console.log("等待发送, ws正在连接钟, 请等待3秒, 连接成功将自动发送本条消息")

                setTimeout(() => {
                    if (this.client!.readyState == WebSocket.OPEN) {
                        this._send(json)
                        resolve("发送成功, json: " + json)
                    } else {
                        reject("发送失败, json: " + json)
                    }
                }, 3000)

            } else if (this.client!.readyState == WebSocket.CLOSING) {
                reject("发送失败, ws正在关闭")
            } else {
                reject("发送失败, ws已关闭")
            }
        })
    }

    private _send(msg: string) {
        this.client!.send(msg)
    }


    joinGroup(groupId: string) {

        const msg: WebsocketMsg = {
            from: this.userId!,
            to: "server",
            type: "JoinGroup",
            code: 0,
            msg: groupId,
        }

        this.send(msg)
    }


    exitGroup(groupId: string) {

        const msg: WebsocketMsg = {
            from: this.userId!,
            to: "server",
            type: "ExitGroup",
            code: 0,
            msg: groupId,
        }

        this.send(msg)
    }


    addOnOpen(onopen: (e: Event) => void) {
        this.client?.addEventListener('open', onopen, false)
    }

    addOnError(onerror: (e: Event) => void) {
        this.client?.addEventListener('error', onerror, false)
    }

    addOnMessage(onmessage: (e: MessageEvent) => void) {
        this.client?.addEventListener('message', onmessage, false)
    }

    addOnMessageGroup() {
        this.client?.addEventListener('message', (e: MessageEvent) => {
            let wm: WebsocketMsg = JSON.parse(e.data)

            if (wm.type == "JoinGroup" || wm.type == "ExitGroup") {
                //ElMessage.warning(wm.msg)
                console.log(wm.msg)
            }
        }, false)
    }

    addOnClose(onclose: (e: CloseEvent) => void) {
        this.client?.addEventListener('close', onclose, false)
    }



    removeOnOpen(onopen: (e: Event) => void) {
        this.client?.removeEventListener('open', onopen)
    }

    removeOnMessage(onmessage: (e: MessageEvent) => void) {
        this.client?.removeEventListener('message', onmessage)
    }

    removeOnError(onerror: (e: Event) => void) {
        this.client?.removeEventListener('error', onerror)
    }

    removeOnClose(onclose: (e: CloseEvent) => void) {
        this.client?.removeEventListener('close', onclose)
    }
}

const ws = new WebsocketClient()

export default ws

