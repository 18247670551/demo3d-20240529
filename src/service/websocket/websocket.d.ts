export {}

declare global {

    type WebsocketMsgType =
        "Connect"
        | "Heartbeat"
        | "JoinGroup"
        | "ExitGroup"
        | "DeviceOnline"
        | "DeviceOffline"
        | "PointData"
        | "PointAlarm"
        | "Error"


    type WebsocketMsg =  {
        from: string
        to: string
        type: WebsocketMsgType
        code: number
        msg: string
    }

}