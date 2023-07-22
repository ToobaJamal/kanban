export default class Kanban{
    static getTasks(columnId) {
        const data = read()
        return data[columnId].tasks
    }

    static insertTask(columnId, content) {
        const data = read()[columnId]
        const task = {
            taskId: Math.floor(Math.random() * 100000),
            content: content 
        }
        data.tasks.push(task)
        save(data)
        return task
    }

    static deleteTask(taskId) {
        const data = read()
        for(const column of data) {
            const task = column.tasks.find(task => task.takId == taskId)
            column.tasks.splice(column.tasks.indexOf(task), 1)
        }
        save(data)
    }

    static updateTask(taskId, updatedContent) {
        const data = read()
        function findColumnTask() {
            for(const column of data) {
                const task = column.tasks.find(task => task.taskId == taskId)
                if(task) {
                    return [task, column]
                }
            }
        }

        const [task, currentColumn] = findColumnTask()

        const targetColumn = data.find(column => column.columnId == updatedContent.columnId)

        // update task
        task.content = updatedContent.content

        // update column
        currentColumn.tasks.splice(currentColumn.tasks.indexOf(task), 1)
        targetColumn.tasks.push(task)

        save(data)
    }

    static getAllTasks() {
        const data = read()
        return [data[0].tasks, data[1].tasks, data[2].tasks]
    }
}

function read() {
    const data = localStorage.getItem("data")
    if(!data) {
        return [
            {columnId: 0, tasks: []}, 
            {columnId: 1, tasks: []}, 
            {columnId: 2, tasks: []}
        ]
    }
    return JSON.parse(data)
}

function save(data) {
    localStorage.setItem("data", JSON.stringify(data))
}