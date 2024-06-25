import mqtt from 'mqtt';
class MqttClient {
    client = null;
    constructor() { }
    connect(token) {
        const options = {
            clientId: 'iot-monitor-',
            username: token,
            password: '',
            keepalive: 100,
            reconnectPeriod: 5,
        };
        this.client = mqtt.connect("wss:ycrlkj.com:8084/mqtt", options);
        this.onMessage();
    }
    onConnect() {
        this.client.on('connect', (e) => {
            console.log(`mqtt: 已连接`);
            setTimeout(() => {
                this.subscribe("iot/device/online");
                this.subscribe("iot/device/offline");
                this.subscribe("iot/device/alarm");
                this.subscribe("iot/device/data");
            }, 5000);
        });
    }
    onMessage() {
        this.client.on('message', (topic, message) => {
            console.log(`收到 [ ${topic} ] 的消息: ${message.toString()}`);
        });
    }
    subscribe(topics) {
        this.client.subscribe(topics, (err) => {
            console.log("mqtt: 订阅 = ", topics);
            if (err) {
                console.log(err);
            }
        });
    }
    unsubscribe(topic) {
        this.client.unsubscribe(topic, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    publish(topic, message) {
        this.client.publish(topic, message, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    disconnect() {
        this.client.end(() => {
            console.log("主动断开mqtt连接");
        });
    }
}
export default new MqttClient();
//# sourceMappingURL=client.js.map