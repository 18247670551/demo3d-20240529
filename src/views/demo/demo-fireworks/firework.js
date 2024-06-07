import * as  Three from 'three';
import vertexShader from '../shader/startpoint/vertex.glsl'
import fragmentShader from '../shader/startpoint/fragment.glsl'
import fireVertexShader from '../shader/firework/vertex.glsl'
import fireFragmentShader from '../shader/firework/fragment.glsl'
export default class FireWork{
    constructor(color,to,from={x:0,y:0,z:0}){
        this.color = new Three.Color(color)
        //1.创建烟花发射的球
        this.startGeometry = new Three.BufferGeometry()
        const startPositionArray = new Float32Array(3)
        startPositionArray[0] = from.x
        startPositionArray[1] = from.y
        startPositionArray[2] = from.z
        this.startGeometry.setAttribute(
            'position',
            new Three.BufferAttribute(startPositionArray,3)
        )

        const astepArray = new Float32Array(3)
        astepArray[0] = to.x - from.x;
        astepArray[1] = to.y - from.y;
        astepArray[2] = to.z - from.z;
        this.startGeometry.setAttribute(
            'aStep',
            new Three.BufferAttribute(astepArray,3)
        )

        //设置着色器材质
        this.startMaterial = new Three.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent:true,
            blending:Three.AdditiveBlending,
            depthWrite:false,
            uniforms:{
                uTime:{
                    value:0
                },
                uSize:{
                    value:20
                },
                uColor:{
                    value:this.color
                }
            }
        })
        //创建烟花点球
        this.startPoint = new Three.Points(this.startGeometry,this.startMaterial)


        //2.开始计时
        this.clock = new Three.Clock()


        //3.创建爆炸烟花
        this.fireworkGeometry  = new Three.BufferGeometry()
        //烟花数量
        this.fireworkCount = 180 + Math.floor(Math.random() * 180)
        //点数 = 烟花数量 * 3
        const positionFirework = new Float32Array(this.fireworkCount * 3)
        const scaleFireArray = new Float32Array(this.fireworkCount)
        const directionArray = new Float32Array(this.fireworkCount * 3)
        for(let i = 0;i<this.fireworkCount;i++){
            //一开始烟花的位置
            positionFirework[i * 3 + 0] = to.x
            positionFirework[i * 3 + 1] = to.y
            positionFirework[i * 3 + 2] = to.z
            //设置烟花所有粒子初始化大小
            scaleFireArray[i] = Math.random()
            //设置四周发射的角度
            let theta = Math.random() * 2 * Math.PI
            let bata = Math.random()* 2 * Math.PI
            let r = Math.random()
            directionArray[i*3 + 0] = r * Math.sin(theta) + r * Math.sin(bata)
            directionArray[i*3 + 1] = r * Math.cos(theta) + r * Math.cos(bata)
            directionArray[i*3 + 2] = r * Math.sin(theta) + r * Math.cos(bata)
        }
        this.fireworkGeometry.setAttribute(
            'position',
            new Three.BufferAttribute(positionFirework,3)
        )
        this.fireworkGeometry.setAttribute(
            'aScale',
            new Three.BufferAttribute(scaleFireArray,1)
        )
        this.fireworkGeometry.setAttribute(
            'aRandom',
            new Three.BufferAttribute(directionArray,3)
        )
        this.fireworkMaterial = new Three.ShaderMaterial({
            vertexShader:fireVertexShader,
            fragmentShader:fireFragmentShader,
            transparent:true,
            blending:Three.AdditiveBlending,
            depthWrite:false,
            uniforms:{
                uTime:{
                    value:0
                },
                uSize:{
                    value:0
                },
                uColor:{
                    value:this.color
                }
            }
        })
        this.fireworks = new Three.Points(this.fireworkGeometry,this.fireworkMaterial)
    }
    //添加到场景
    addScene(scene,camera){
        scene.add(this.startPoint)
        scene.add(this.fireworks)
        this.scene = scene
    }
    update(){
        const elapsedTime = this.clock.getElapsedTime()
        if(elapsedTime<1){
            //点击，小于一秒发射烟花
            this.startMaterial.uniforms.uTime.value = elapsedTime
            this.startMaterial.uniforms.uSize.value = 20
        }else{
            const time = elapsedTime - 1
            //让烟花元素消失
            this.startMaterial.uniforms.uSize.value = 0
            //从内存中清除
            this.startPoint.clear()
            this.startGeometry.dispose()
            this.startMaterial.dispose()

            //设置烟花显示
            this.fireworkMaterial.uniforms.uSize.value = 20
            this.fireworkMaterial.uniforms.uTime.value = time
            if(time>5){
                this.fireworks.clear()
                this.fireworkGeometry.dispose()
                this.fireworkMaterial.dispose()
            }
        }
    }
}