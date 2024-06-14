function createFireworks(color, to) {
    const fireworkGeometry = new THREE.BufferGeometry();
    const fireworkMateial = new THREE.ShaderMaterial({
        vertexShader:`
            attribute float aScale;
            attribute vec3 aRandom;
            uniform float uTime; 

            uniform float uSize;
            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                modelPosition.xyz += aRandom*uTime;
                gl_Position = projectionMatrix * (viewMatrix * modelPosition);
                gl_PointSize = (uSize*aScale)-uTime*20.0;
            }
        `,
        fragmentShader:`
            uniform vec3 uColor;
            void main() {
                float distanceTo = distance(gl_PointCoord , vec2(0.5));
                float str = distanceTo * 2.0;
                str = 1.0 - str;
                str = pow(str,1.5);
                gl_FragColor = vec4(uColor,str); 
            }
        `,
        blending:THREE.AdditiveBlending,
        depthWrite:false,
        uniforms:{
            uTime:{
                value:0
            },
            uSize:{
                value:0.0
            },
            uColor:{
                value:color
            }
        }
    });

    // 随机的烟花数量
    const fireworkConst = 180 + Math.floor(Math.random() * 180);
    const positionFireworksArray = new Float32Array(fireworkConst * 3); // 位置
    const scaleFireworkArray = new Float32Array(fireworkConst); // 大小
    const direcationArray = new Float32Array(fireworkConst * 3); // 移动方向

    for (let index = 0; index < fireworkConst; index++) {
        // 开始烟花的位置
        positionFireworksArray[index * 3 + 0] = to.x;
        positionFireworksArray[index * 3 + 1] = to.y;
        positionFireworksArray[index * 3 + 2] = to.z;
        // 设置烟花所有粒子的初始大小
        scaleFireworkArray[index] = Math.random();
        // 设置旋转的角度 四周发射的角度
        let theta = Math.random() * 2 * Math.PI;
        let beta = Math.random() * 2 * Math.PI;

        // 半径
        let r = Math.random();

        // 最不了解的是这里 三角形的弧度值
        direcationArray[index * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta);
        direcationArray[index * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta);
        direcationArray[index * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta);
    }


    fireworkGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positionFireworksArray, 3)
    );
    // 大小
    fireworkGeometry.setAttribute(
        'aScale',
        new THREE.BufferAttribute(scaleFireworkArray, 3)
    );
    // 随技方向
    fireworkGeometry.setAttribute(
        'aRandom',
        new THREE.BufferAttribute(direcationArray, 3)
    );

    const foreworksPoints = new THREE.Points(fireworkGeometry, fireworkMateial);

    return {
        fireworkGeometry,
        fireworkMateial,
        delete() {
            fireworkMateial.uniforms.uSize.value = 0;
            foreworksPoints.clear();
            fireworkGeometry.dispose();
            scene.remove(foreworksPoints);
        },
        update(time){
            fireworkMateial.uniforms.uTime.value = time;
            fireworkMateial.uniforms.uSize.value = 20.0;
            if(time > 5){
                this.delete();
            }
        },
        addScene() {
            scene.add(foreworksPoints);
        }
    }
}
