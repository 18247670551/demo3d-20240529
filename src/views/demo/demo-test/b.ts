function createPoint (color, position, from) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: {
                value: 0
            },
            uColor: {
                value: color
            },
            uSize: {
                value: 20.0
            }
        },
        vertexShader: ` 
            attribute vec3 aStep;
            uniform float uTime;
            uniform float uSize;

            void main() {
                vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

                // 设置点的 位置 aStep 就是 to 的 xyz  uTime 就是 [0,1];
                modelPosition.xyz += (aStep*uTime);

                gl_Position = projectionMatrix * viewMatrix * modelPosition;
                gl_PointSize = uSize;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            void main() {
                float str = 1.0 - distance(gl_PointCoord , vec2(0.5)) * 3.0;
                gl_FragColor = vec4(uColor,str);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // 设置点开始的位置
    const buffreArray = new Float32Array(3);
    buffreArray[0] = from.x;
    buffreArray[1] = from.y;
    buffreArray[2] = from.z;

    // 点发射到什么位置 也可以直接 写 to.x to.y to.z
    const asteArray = new Float32Array(3);
    asteArray[0] = to.x - from.x;
    asteArray[1] = to.y - from.y;
    asteArray[2] = to.z - from.z;

    // 设置属性 传递倒着色器中
    geometry.setAttribute(
        'aStep',
        new THREE.BufferAttribute(asteArray, 3)
    );
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(buffreArray, 3)
    );

    // 创建点
    const points = new THREE.Points(geometry, material);

    // 获取一个 执行的时间
    const clock = new THREE.Clock();

    // 创建烟花
    const fireworks = createFireworks(color , to);
    fireworks.addScene();

    return {
        material,
        // 添加材质 到 scene 中
        addScene(){
            scene.add(points);
        },
        update() {
            // 获取时间
            const elapsedTime = clock.getElapsedTime();

            if (elapsedTime < 1) {
                material.uniforms.uTime.value = elapsedTime;
            } else {
                const time = elapsedTime - 1;
                material.uniforms.uSize.value = 0;
                points.clear();
                geometry.dispose();
                scene.remove(points);


                // 这里是创建烟花的代码 ....
                // 设置烟花显示
                fireworks.update(time);

            }
        }
    }
}
