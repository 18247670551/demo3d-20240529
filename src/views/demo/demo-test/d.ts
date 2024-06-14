const createBox = (color,y = -1) => {
    const geometry = new THREE.BoxGeometry( 0.3, 0.1, 0.1 );
    const BoxMaterial = new THREE.ShaderMaterial({
        uniforms:{
            uColor:{
                value: new THREE.Color(0x73162392)
            }
        },
        vertexShader:`
            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * (viewMatrix * modelPosition);
            }
        `,
        fragmentShader:`
            uniform vec3 uColor;
            void main() {
                gl_FragColor = vec4(uColor,1.0);
                //gl_FragColor = vec4(1.0,1.0,1.0,1.0);
            }
        `,
    });
    const cube = new THREE.Mesh( geometry, BoxMaterial );
    cube.position.y = y;
    scene.add( cube );

    return {
        BoxMaterial:BoxMaterial
    }
}

//执行
createBox();
