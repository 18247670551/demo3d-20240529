
class QueueTask {

    // 并行执行数
    private readonly parallelCount: number
    // 正在执行的任务数
    private runningCount: number = 0
    private readonly tasks: { task: Function, resolve: (value: any) => any, reject: (reason: any) => any }[] = []

    constructor(parallelCount = 2) {
        this.parallelCount = parallelCount
    }

    add(task: Function) {
        return new Promise((resolve, reject) => {
            this.tasks.push({task, resolve, reject})
            this._run()
        })
    }

    _run() {
        while (this.runningCount < this.parallelCount && this.tasks.length) {
            const {task, resolve, reject} = this.tasks.shift()!
            this.runningCount++
            Promise.resolve(task()).then(resolve, reject)
                .finally(() => {
                    this.runningCount--
                    this._run()
                })

        }
    }

}


// 模拟一个耗时任务
function coastTask(time: number) {
    return new Promise((resolve: Function) => {
        setTimeout(() => resolve(), time)
    })
}


const queue = new QueueTask()

function addTask(name: string, time: number) {
    console.log("添加任务: ", name)
    queue.add(() => coastTask(time))
        .then(() => {
            console.log(`${name}完成`)
        })
}

addTask("任务1", 10000)
addTask("任务2", 5000)
addTask("任务3", 3000)
addTask("任务4", 4000)
addTask("任务5", 5000)

// 添加任务:  任务1
// 添加任务:  任务2
// 添加任务:  任务3
// 添加任务:  任务4
// 添加任务:  任务5
//
// 任务2完成
// 任务3完成
// 任务1完成
// 任务4完成
// 任务5完成
