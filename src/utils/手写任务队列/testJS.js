import QueueTask from "./TaskQueueJS.js"


// 模拟一个耗时任务
function coastTask(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
    })
}


const queue = new QueueTask()

function addTask(name, time) {
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
