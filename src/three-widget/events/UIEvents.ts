import {LOAD_PROCESS, STATIC_LOADED} from '@/three-widget/events/eventConstructs'
import {EventDispatcher} from "three"

// interface LOAD_PROCESS_MESSAGE {
//     url: string
//     itemsLoaded: number
//     itemsTotal: number
// }

export default class UIEvents extends EventDispatcher<{
    [LOAD_PROCESS]: { message: { url: string, itemsLoaded: number, itemsTotal: number } }
    [STATIC_LOADED]: {}
}> {
    constructor() {
        super()
    }
}
