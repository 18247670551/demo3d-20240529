let pointsArray = [];
let box = createBox();
const createClick = () => {
    // 随机颜色值
    let color = new THREE.Color(`hsl(${Math.floor(Math.random() * 360)},100%,80%)`);
    let position = {
        x: Math.random() - 0.5,
        y: Math.abs(Math.random() + 0.5),
        z: Math.random() - 0.5
    }
    // 点开始的位置
    let from = { x: 0, y: -1, z: 0 };
    const point = createPoint(color, position, from);
    box.material.uniforms.uColor.value = color;
    point.addScene();
    pointsArray.push(point);
}
window.addEventListener('click', createClick);
