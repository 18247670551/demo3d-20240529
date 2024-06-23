import Events from '../events'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import {AudioLoader, DefaultLoadingManager, TextureLoader} from 'three'
import {UI_EVENT_NAME, LOAD_PROCESS} from '@/three-widget/events/eventConstructs'
import type UIEvent from '../events/UIEvents'
import type {Object3D} from 'three'



export default class MyLoader {
    private _gltfHandle: GLTFLoader
    private _fbxHandle: FBXLoader
    private _textureHandle: TextureLoader
    private _audioHandle: AudioLoader

    constructor() {
        this._loadOnprogress()
        this._fbxHandle = new FBXLoader()
        this._gltfHandle = new GLTFLoader()
        this._textureHandle = new TextureLoader()
        this._audioHandle = new AudioLoader()
    }

    async loadGLTF(url: string) {
        return this._gltfHandle.loadAsync(url)
    }

    async loadFBX(url: string): Promise<Object3D> {
        return this._fbxHandle.loadAsync(url)
    }

    async loadAudio(url: string) {
        return this._audioHandle.loadAsync(url)
    }

    async loadTexture(url: string) {
        return this._textureHandle.loadAsync(url)
    }


    private _loadOnprogress() {
        const _event: UIEvent = Events.getStance().getEvent(UI_EVENT_NAME)

        DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            _event.dispatchEvent({
                type: LOAD_PROCESS,
                message: {url, itemsLoaded, itemsTotal},
            })
        }
        DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            _event.dispatchEvent({
                type: LOAD_PROCESS,
                message: {url, itemsLoaded, itemsTotal},
            })
        }
    }
}
