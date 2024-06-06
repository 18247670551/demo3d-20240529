import {UI_EVENT_NAME, ACTION_EVENT_NAME,} from '@/three-widget/events/eventConstructs'
import ActionEvent from './ActionEvent'
import UIEvents from './UIEvents'
import type {EventDispatcher} from 'three'


/**
 * 需要在使用前初始化事件总线, 可以在 main.js 或 App.vue 中初始化, 也可以把整个 event 封装成插件方式加载,
 * Events.getStance().init()
 */
export default class Events {
    private static _instance: Events
    private _events: { [key: string]: EventDispatcher } = {}

    public static getStance(): Events {
        if (Events._instance) {
            return Events._instance
        } else {
            Events._instance = new Events()
        }
        return Events._instance
    }

    init() {
        this._registerEvents(new ActionEvent(), ACTION_EVENT_NAME)
        this._registerEvents(new UIEvents(), UI_EVENT_NAME)
    }

    private _registerEvents(event: EventDispatcher, name: string) {
        this._events[name] = event
    }

    getEvent(name: string): EventDispatcher {
        return this._events[name]
    }
}
