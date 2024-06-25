

export default class QueueTask {

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