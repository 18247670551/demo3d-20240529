import { getUserIdFromToken } from "@/utils/jwtUtils";
class WebsocketClient {
    userId = null;
    client = null;
    constructor() { }
    connect(url, token) {
        this.userId = getUserIdFromToken(token);
        this.client = new WebSocket(`${url}?token=${token}`);
        this.addOnOpen(this.defaultOnOpen);
        this.addOnClose(this.defaultOnClose);
        this.addOnError(this.defaultOnError);
        this.addOnMessageGroup();
    }
    close() {
        if (this.client) {
            this.client.close();
            this.removeOnOpen(this.defaultOnOpen);
            this.removeOnClose(this.defaultOnClose);
            this.removeOnError(this.defaultOnError);
            this.client = null;
        }
    }
    defaultOnOpen = () => {
        console.log("WebsocketClient: 连接成功");
    };
    defaultOnClose = () => {
        console.log("WebsocketClient: 关闭连接");
    };
    defaultOnError = (e) => {
        console.log("WebsocketClient: 发生错误");
    };
    send(msg) {
        const json = JSON.stringify(msg);
        return new Promise((resolve, reject) => {
            if (this.client == null) {
                reject("发送失败, ws未连接");
            }
            // readyState: CONNECTING, OPEN, CLOSING, CLOSED
            if (this.client.readyState == WebSocket.OPEN) {
                this._send(json);
                // 如果未正在连接状态, 则等待3秒钟
            }
            else if (this.client.readyState == WebSocket.CONNECTING) {
                console.log("等待发送, ws正在连接钟, 请等待3秒, 连接成功将自动发送本条消息");
                setTimeout(() => {
                    if (this.client.readyState == WebSocket.OPEN) {
                        this._send(json);
                        resolve("发送成功, json: " + json);
                    }
                    else {
                        reject("发送失败, json: " + json);
                    }
                }, 3000);
            }
            else if (this.client.readyState == WebSocket.CLOSING) {
                reject("发送失败, ws正在关闭");
            }
            else {
                reject("发送失败, ws已关闭");
            }
        });
    }
    _send(msg) {
        this.client.send(msg);
    }
    joinGroup(groupId) {
        const msg = {
            from: this.userId,
            to: "server",
            type: "JoinGroup",
            code: 0,
            msg: groupId,
        };
        this.send(msg);
    }
    exitGroup(groupId) {
        const msg = {
            from: this.userId,
            to: "server",
            type: "ExitGroup",
            code: 0,
            msg: groupId,
        };
        this.send(msg);
    }
    addOnOpen(onopen) {
        this.client?.addEventListener('open', onopen, false);
    }
    addOnError(onerror) {
        this.client?.addEventListener('error', onerror, false);
    }
    addOnMessage(onmessage) {
        this.client?.addEventListener('message', onmessage, false);
    }
    addOnMessageGroup() {
        this.client?.addEventListener('message', (e) => {
            let wm = JSON.parse(e.data);
            if (wm.type == "JoinGroup" || wm.type == "ExitGroup") {
                //ElMessage.warning(wm.msg)
                console.log(wm.msg);
            }
        }, false);
    }
    addOnClose(onclose) {
        this.client?.addEventListener('close', onclose, false);
    }
    removeOnOpen(onopen) {
        this.client?.removeEventListener('open', onopen);
    }
    removeOnMessage(onmessage) {
        this.client?.removeEventListener('message', onmessage);
    }
    removeOnError(onerror) {
        this.client?.removeEventListener('error', onerror);
    }
    removeOnClose(onclose) {
        this.client?.removeEventListener('close', onclose);
    }
}
const ws = new WebsocketClient();
export default ws;
//# sourceMappingURL=client.js.map