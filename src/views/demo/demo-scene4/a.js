import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ky from "kyouka";
const canvas= document.querySelector("canvas.webgl");
const sizes={
    width:window.innerWidth,
    height:window.innerHeight
}
const houseHeight = 2.5;
const houseWidth = 4;
const roofHeight = 1;
const scene=new THREE.Scene();
const ambientLight=new THREE.AmbientLight('#b9d5ff',0.52)
scene.add(ambientLight)
const house=new THREE.Group()

const textureLoader=new THREE.TextureLoader()
const doorColorTexture=textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture=textureLoader.load('textures/door/alpha.jpg')
const doorAomapTexture=textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture=textureLoader.load('textures/door/height.jpg')
const doorMetalnessTexture=textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture=textureLoader.load('textures/door/roughness.jpg')
const doorNormalTexture=textureLoader.load('textures/door/normal.jpg')

const wallsColorTexture=textureLoader.load('textures/bricks/color.jpg')
const wallsAomapTexture=textureLoader.load('textures/bricks/ambientOcclusion.jpg')
const wallsRoughnessTexture=textureLoader.load('textures/bricks/roughness.jpg')
const wallsNormalTexture=textureLoader.load('textures/bricks/normal.jpg')

const grassColorTexture=textureLoader.load('textures/grass/color.jpg')
const grassAomapTexture=textureLoader.load('textures/grass/ambientOcclusion.jpg')
const grassRoughnessTexture=textureLoader.load('textures/grass/roughness.jpg')
const grassNormalTexture=textureLoader.load('textures/grass/normal.jpg')

const fog=new THREE.Fog('#262837',1,15)
scene.fog=fog

const pontLight=new THREE.PointLight('#ff7d46',1,7)
pontLight.position.set(0,2.2,2.7)
house.add(pontLight)
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight)
/**
 * 屋顶
 */
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5, roofHeight, 4),
    new THREE.MeshStandardMaterial({
        color:'#b35f45'
    })
)
roof.position.y = houseHeight + roofHeight / 2;
roof.rotation.y = ky.deg2rad(45);
house.add(roof)

/**
 * 门
 */
const door=new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.2,2.2,100,100),
    new THREE.MeshStandardMaterial({
        map:doorColorTexture,
        alphaMap:doorAlphaTexture,
        transparent:true,
        aoMap:doorAomapTexture,
        displacementMap:doorHeightTexture,
        displacementScale:0.1,
        roughnessMap:doorRoughnessTexture,
        metalnessMap:doorMetalnessTexture,
        normalMap:doorNormalTexture
    })
)
door.position.set(0, 1, houseWidth / 2 + 0.01);
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
)
house.add(door)

/**
 * 鬼魂
 */
const ghost1=new THREE.PointLight("#ff00ff",2,3);
const ghost2=new THREE.PointLight("#00ffff",2,3);
const ghost3=new THREE.PointLight("#ffff00",2,3);
scene.add(ghost1,ghost2,ghost3)

/**
 * 墙
 */
const walls=new THREE.Mesh(
    new THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:wallsColorTexture,
        roughnessMap:wallsRoughnessTexture,
        transparent:true,
        normalMap:wallsNormalTexture,
        aoMap:wallsAomapTexture
    })
)
walls.position.y = houseHeight / 2;
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2)
)
house.add(walls)
scene.add(house)


/**
 * 灌木
 */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1,bush2,bush3,bush4)

const graves = new THREE.Group();
const graveGeometry=new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const graveMaterial=new THREE.MeshStandardMaterial({ color: "#b2b6b1" })
const graveCount=50
for(let i=0;i<graveCount;i++){
    const angle=Math.random()*Math.PI*2;
    const radius=3+Math.random()*6
    const grave=new THREE.Mesh(graveGeometry,graveMaterial)
    const x=Math.sin(angle)*radius
    const z=Math.cos(angle)*radius
    grave.position.set(x,0.3,z)
    grave.rotation.z=(Math.random()-0.5)*0.4
    grave.rotation.y=(Math.random()-0.5)*0.4
    graves.add(grave)
}
scene.add(graves);


/**
 * 地板
 */
const floor=new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20,20),
    new THREE.MeshStandardMaterial({
        map:grassColorTexture,
        roughnessMap:grassRoughnessTexture,
        normalMap:grassNormalTexture,
        aoMap:grassAomapTexture
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2)
)
grassColorTexture.repeat.set(8,8)
grassAomapTexture.repeat.set(8,8)
grassNormalTexture.repeat.set(8,8)
grassRoughnessTexture.repeat.set(8,8)
grassAomapTexture.wrapS=THREE.RepeatWrapping
grassColorTexture.wrapS=THREE.RepeatWrapping
grassNormalTexture.wrapS=THREE.RepeatWrapping
grassRoughnessTexture.wrapS=THREE.RepeatWrapping

grassAomapTexture.wrapT=THREE.RepeatWrapping
grassColorTexture.wrapT=THREE.RepeatWrapping
grassNormalTexture.wrapT=THREE.RepeatWrapping
grassRoughnessTexture.wrapT=THREE.RepeatWrapping
floor.rotation.x=-Math.PI*0.5
scene.add(floor)

/**
 * shadows
 */



const camera= new THREE.PerspectiveCamera( 75,
    sizes.width / sizes.height,
    0.1,
    100 );
camera.position.set(4,5,15)
camera.aspect=sizes.width/sizes.height
scene.add(camera)
const renderer=new THREE.WebGLRenderer({
    canvas:canvas
})
const controls=new OrbitControls(camera,canvas)


renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled=true
moonLight.castShadow = true;
ghost1.castShadow=true;
ghost2.castShadow=true;
ghost3.castShadow=true;
pontLight.castShadow=true;
for (let i = 0; i < graveCount; i++) {
    graves.children[i].castShadow = true;
}
walls.receiveShadow=true;
door.receiveShadow=true;
floor.receiveShadow=true
moonLight.shadow.mapSize.width=1024
moonLight.shadow.mapSize.height=1024
moonLight.shadow.far=7

ghost1.shadow.mapSize.width=1024
ghost1.shadow.mapSize.height=1024
ghost1.shadow.far=7

ghost2.shadow.mapSize.width=1024
ghost2.shadow.mapSize.height=1024
ghost2.shadow.far=7

ghost3.shadow.mapSize.width=1024
ghost3.shadow.mapSize.height=1024
ghost3.shadow.far=7

pontLight.shadow.mapSize.width=1024
pontLight.shadow.mapSize.height=1024
pontLight.shadow.far=7
window.addEventListener('resize',()=>{
    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setClearColor('#262837')
})

const clock=new THREE.Clock()
const tick=()=>{
    const elapsedTime=clock.getElapsedTime();
    controls.update()
    renderer.render(scene,camera)
    ghost1.position.x=Math.cos(elapsedTime)*4
    ghost1.position.z=Math.sin(elapsedTime)*4
    ghost1.position.y=Math.sin(elapsedTime*3)*3

    ghost2.position.x=-Math.cos(elapsedTime)*3
    ghost2.position.z=-Math.sin(elapsedTime)*3
    ghost2.position.y=-Math.sin(elapsedTime*3)*3

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.position.x =
        Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
    window.requestAnimationFrame(tick)
}
tick()