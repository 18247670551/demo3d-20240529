


export default class TaskQueueJS {

    constructor(parallelCount = 2) {
        this.parallelCount = parallelCount
        this.tasks = []
        this.runningCount = 0
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.tasks.push({task, resolve, reject})
            this._run()
        })
    }

    _run() {
        while (this.runningCount < this.parallelCount && this.tasks.length) {
            const {task, resolve, reject} = this.tasks.shift()
            this.runningCount++
            Promise.resolve(task()).then(resolve, reject)
                .finally(() => {
                    this.runningCount--
                    this._run()
                })

        }
    }

}