import * as THREE from "three"

export type QuarterArc = "X2Y1" | "X2Z1" | "Y2X1" | "X2Z2" | "Y2Z1" | "X1Y1" | "X2Y2" | "Y1X1" | "Y1Z2"
    | "Z1X1" | "X1Y2" | "Y1Z1" | "Z2X2" | "Y2Z2" | "X1Z2" | "Z1X2" | "Z1Y2" | "Z1Y1" | "Z2Y1" | "Z2Y2"


export default class PathUtils {

    readonly points: number[][]
    readonly last: { x: number, y: number, z: number }

    constructor() {
        this.points = []
        this.last = {x: 0, y: 0, z: 0}
    }

    /**
     * 添加一个点, 并更新last
     */
    push(point: number[]) {
        this.points.push(point)

        this.last.x = point[0]
        this.last.y = point[1]
        this.last.z = point[2]
    }

    /**
     * 添加一个点, 不更新last
     * <br>用于循环添加时, 比如添加管道拐弯的弧线, 添加完所有弧线上的点再手动调用 updateLast() 更新一次就可以了
     */
    pushPointNoUpdateLast(point: number[]) {
        this.points.push(point)
    }

    updateLast() {
        this.last.x = this.points[this.points.length - 1][0]
        this.last.y = this.points[this.points.length - 1][1]
        this.last.z = this.points[this.points.length - 1][2]
    }

    /**
     * 添加多个点并更新last
     * @param points
     */
    pushMany(points: number[][]) {
        this.points.push(...points)

        this.last.x = points[points.length - 1][0]
        this.last.y = points[points.length - 1][1]
        this.last.z = points[points.length - 1][2]
    }

    /**
     *
     * @param aX
     * @param aY
     * @param aRadius
     * @param aStartAngle
     * @param aEndAngle
     * @param aClockwise
     * @param pointCount 从弧线上获取点的数量
     * @param func
     */
    pushArc(
        aX: number,
        aY: number,
        aRadius: number,
        aStartAngle: number,
        aEndAngle: number,
        aClockwise: boolean,
        pointCount: number,
        func: (lastX: number, lastY: number, lastZ: number, x: number, y: number) => number[]
    ) {
        new THREE.ArcCurve(
            aX, aY,
            aRadius,
            aStartAngle,
            aEndAngle,
            aClockwise
        ).getPoints(pointCount).forEach((item, i) => {
            //第一个点和直管道的最后一个点重复, 要去除第一个点, 否则管道转弯处有褶皱
            if (i != 0) {
                this.points.push(func(this.last.x, this.last.y, this.last.z, item.x, item.y))
            }
        })

        this.updateLast()


        const path = new THREE.Path();
        // 设置路径起点
        path.moveTo( 0, 0 );
        // 创建一条曲线段
        path.quadraticCurveTo( 10, 10, 20, 0 );
        // 创建一条弧线段
        path.arc( 0, 0, 10, 0, Math.PI, true );
        // 在路径末尾自动添加一条线段，形成闭合路径
        path.autoClose = true;
        const points = path.getPoints();
        // 创建一个线性材质，并使用定义的路径创建一个网格对象
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const mesh = new THREE.Line(geometry, material);
        // 添加网格对象到场景中
    }

    /**
     * 正半轴为1, 负半轴为2
     * <br>egg: X轴负到Y轴正的转弯则为 X2Y1, 即: 垂直向上转水平向后
     * <br>egg: Y轴正到X轴负的转弯则为 Y1X2, 即: 水平向左转垂直向下
     */
    pushQuarterArc(quarterArc: QuarterArc, curveRadius: number, pointCount: number = 32) {

        let aX: number,
            aY: number,
            aRadius: number,
            aStartAngle: number,
            aEndAngle: number,
            aClockwise: boolean,
            func: (lastX: number, lastY: number, lastZ: number, x: number, y: number) => number[]

        switch (quarterArc) {
            //由左向上
            case "X2Y1":
                aX = 0
                aY = curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 1.5
                aEndAngle = 0
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY + y, lastZ]
                break
            //由右向前
            case "X2Z1":
                aX = 0
                aY = -curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 0.5
                aEndAngle = 0
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY, lastZ - y]
                break
            //由下向右
            case "Y2X1":
                aX = curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = Math.PI
                aEndAngle = Math.PI * 0.5
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY + y, lastZ]
                break
            //由左向后
            case "X2Z2":
                aX = 0
                aY = -curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 0.5
                aEndAngle = 0
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY, lastZ + y]
                break
            //由下向右
            case "Y2Z1":
                aX = -curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = 0
                aEndAngle = Math.PI * 0.5
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ - x]
                break
            //由左向上
            case "X1Y1":
                aX = 0
                aY = curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 1.5
                aEndAngle = Math.PI
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY + y, lastZ]
                break
            //由左向下
            case "X2Y2":
                aX = 0
                aY = -curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 0.5
                aEndAngle = 0
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY + y, lastZ]
                break
            //由上向右
            case "Y1X1":
                aX = curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = Math.PI
                aEndAngle = Math.PI * 1.5
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY + y, lastZ]
                break
            //由上向右 另一种实现形式
            // case "Y1X1":
            //     aX = -curveRadius
            //     aY = 0
            //     aRadius = curveRadius
            //     aStartAngle = 0
            //     aEndAngle = Math.PI * 1.5
            //     aClockwise = true
            //     func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX - x, lastY + y, lastZ]
            //     break
            //下向后
            case "Y1Z2":
                aX = curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = Math.PI
                aEndAngle = Math.PI * 1.5
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ - x]
                break
            //由前向右
            case "Z1X1":
                aX = curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = Math.PI
                aEndAngle = Math.PI * 0.5
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY, lastZ - y]
                break
            //由右向下
            case "X1Y2":
                aX = 0
                aY = -curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 0.5
                aEndAngle = Math.PI
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY + y, lastZ]
                break
            //由上向前
            case "Y1Z1":
                aX = curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = Math.PI
                aEndAngle = Math.PI * 1.5
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ + x]
                break
            //由后向左
            case "Z2X2":
                aX = -curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = 0
                aEndAngle = Math.PI * 1.5
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY, lastZ - y]
                break
            //由下向后
            case "Y2Z2":
                aX = curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = Math.PI
                aEndAngle = Math.PI * 0.5
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ - x]
                break
            //由右向后
            case "X1Z2":
                aX = 0
                aY = curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 1.5
                aEndAngle = Math.PI
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY, lastZ - y]
                break
            //由前向左
            case "Z1X2":
                aX = -curveRadius
                aY = 0
                aRadius = curveRadius
                aStartAngle = 0
                aEndAngle = Math.PI * 0.5
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX + x, lastY, lastZ - y]
                break
            //由前向下
            case "Z1Y2":
                aX = 0
                aY = -curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 0.5
                aEndAngle = 0
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ - x]
                break
            //由前向上
            case "Z1Y1":
                aX = 0
                aY = curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 1.5
                aEndAngle = 0
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ - x]
                break
            //由后向下
            case "Z2Y2":
                aX = 0
                aY = -curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 0.5
                aEndAngle = 0
                aClockwise = true
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ + x]
                break
            //由后向下
            case "Z2Y1":
                aX = 0
                aY = curveRadius
                aRadius = curveRadius
                aStartAngle = Math.PI * 1.5
                aEndAngle = 0
                aClockwise = false
                func = (lastX: number, lastY: number, lastZ: number, x: number, y: number) => [lastX, lastY + y, lastZ + x]
                break


        }

        this.pushArc(
            aX,
            aY,
            aRadius,
            aStartAngle,
            aEndAngle,
            aClockwise,
            pointCount,
            func
        )
    }

}