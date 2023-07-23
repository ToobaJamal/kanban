import Kanban from "./kanban.js";

const todo = document.querySelector(".cards.todo")
const pending = document.querySelector(".cards.pending")
const completed= document.querySelector(".cards.completed")

const taskbox = [todo, pending, completed]

function addTaskCard(task, index) {
    taskbox[index].innerHTML += `
        <form class="card" draggable="true">
        <input type="text" name="task" autocomplete="off" disabled="disabled" value="${task.content}"/>
        <div>
            <span class="task-id">
                #${task.taskId}
            </span>
            <span>
                <button class="edit" data-id="${task.taskId}">Edit</button>
                <button class="update hide" data-id="${task.taskId}" data-column="${index}">Update</button>
                <button class="delete" data-id="${task.taskId}">Delete</button>
            </span>
        </div>
    </form>
        `
}

Kanban.getAllTasks().forEach((tasks, index) => {
    console.log("YES")
    tasks.forEach(task => {
        addTaskCard(task, index)
    })
})



const addForm = document.querySelectorAll(".add") 

addForm.forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault()
        if(form.task.value.trim()) {
            const task = Kanban.insertTask(form.submit.dataset.id, form.task.value.trim())
            addTaskCard(task, form.submit.dataset.id)
            form.reset()
        }
    })
})

taskbox.forEach(column => {
    column.addEventListener("click", event => {
        event.preventDefault()
        const formInput = event.target.parentElement.parentElement.previousElementSibling
        if(event.target.classList.contains("edit")) {
           formInput.removeAttribute("disabled")
            event.target.classList.add("hide")
            event.target.nextElementSibling.classList.remove("hide")
        }

        if(event.target.classList.contains("update")) {
           formInput.setAttribute("disabled", "disabled")
            event.target.classList.add("hide")
            event.target.previousElementSibling.classList.remove("hide")

            const taskId = event.target.dataset.id
            const columnId = event.target.dataset.column
            const content =formInput.value
            Kanban.updateTask(taskId, {columnId, content})
        }

        if(event.target.classList.contains("delete")) {
            formInput.parentElement.remove()
            Kanban.deleteTask(event.target.dataset.id)
        }
    })
})