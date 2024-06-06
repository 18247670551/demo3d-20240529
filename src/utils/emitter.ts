import mitt from "mitt"

export class Emitter {

	static _instance: Emitter

	private mitt: ReturnType<typeof mitt>

	private constructor() {
		this.mitt = mitt()
	}

	static instance(): Emitter{
		if(!this._instance){
			this._instance = new Emitter()
		}
		return this._instance
	}

	on(eventName: string, handler: (...args: any[]) => void) {
		this.mitt.on(eventName, handler)
	}

	emit(eventName: string, ...args: any[]) {
		this.mitt.emit(eventName, args)
	}

	off(eventName: string, handler?: (...args: any[]) => void) {
		this.mitt.off(eventName, handler)
	}

}