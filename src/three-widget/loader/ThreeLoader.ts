import * as THREE from "three"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader"
import {AudioLoader} from "three"
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader"
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader"
import {MeshoptDecoder} from "three/examples/jsm/libs/meshopt_decoder.module"





const textureLoader = new THREE.TextureLoader()

const audioLoader = new AudioLoader()

const fbxLoader = new FBXLoader()



const gltfLoader = new GLTFLoader()

// glb压缩模型加载器
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")
const dracoGltfLoader = new GLTFLoader()
dracoGltfLoader.setDRACOLoader(dracoLoader)


const meshoptDecoderGltfLoader = new GLTFLoader()
meshoptDecoderGltfLoader.setMeshoptDecoder(MeshoptDecoder)










export const getTextureLoader = () => {
    return textureLoader
}

export const getAudioLoader = () => {
    return audioLoader
}

export const getFbxLoader = () => {
    return fbxLoader
}





export const getGltfLoader = () => {
    return gltfLoader
}

export const getDracoGltfLoader = () => {
    return dracoGltfLoader
}

export const getMeshoptDecoderGltfLoader = () => {
    return meshoptDecoderGltfLoader
}