import mitt from "mitt";
export class Emitter {
    static _instance;
    mitt;
    constructor() {
        this.mitt = mitt();
    }
    static instance() {
        if (!this._instance) {
            this._instance = new Emitter();
        }
        return this._instance;
    }
    on(eventName, handler) {
        this.mitt.on(eventName, handler);
    }
    emit(eventName, ...args) {
        this.mitt.emit(eventName, args);
    }
    off(eventName, handler) {
        this.mitt.off(eventName, handler);
    }
}
//# sourceMappingURL=emitter.js.map