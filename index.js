import Kanban from "./kanban.js";

const todo = document.querySelector(".cards.todo")
const pending = document.querySelector(".cards.pending")
const completed= document.querySelector(".cards.completed")
const cards = document.getElementsByClassName("card")

const taskbox = [todo, pending, completed]

function addTaskCard(task, index) {
    taskbox[index].innerHTML += `
        <form class="card" draggable="true" data-id="${task.taskId}">
        <input type="text" name="task" autocomplete="off" value="${task.content}"/>
        <span class="date">${task.date}</span>
        <input type="date" class="deadline-input hide" name="date"/>
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
    tasks.forEach(task => {
        addTaskCard(task, index)
    })
})

const addForm = document.querySelectorAll(".add") 

addForm.forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault()
        console.log(form.date)
        if(form.task.value.trim()) {
            const task = Kanban.insertTask(form.submit.dataset.id, form.task.value.trim(), form.date.value)
            addTaskCard(task, form.submit.dataset.id)
            form.reset()
        }
    })
})

taskbox.forEach(column => {
    column.addEventListener("click", event => {
        event.preventDefault()
        const card = event.target.closest(".card")

        if (!card) return

        const dateDisplay = card.querySelector('span');
        const formInput = card.querySelector('input[name="task"]')
        const dateInput = event.target.closest(".card").querySelector('input[name="date"]')

        if(event.target.classList.contains("edit")) {
            formInput.removeAttribute("disabled")
            dateInput.classList.remove("hide")
            dateInput.value = dateDisplay.textContent.trim()
            dateDisplay.classList.add("hide")
            event.target.classList.add("hide")
            event.target.nextElementSibling.classList.remove("hide")
        }

        if(event.target.classList.contains("deadline-input")) {
            dateInput.showPicker()
        }

        if(event.target.classList.contains("update")) {
           formInput.setAttribute("disabled", "disabled")
            event.target.classList.add("hide")
            event.target.previousElementSibling.classList.remove("hide")
            dateInput.classList.add("hide")
            dateDisplay.classList.remove("hide")

            dateDisplay.textContent = dateInput.value

            const taskId = event.target.dataset.id
            const columnId = event.target.dataset.column
            const content =formInput.value
            const date = dateInput.value
            Kanban.updateTask(taskId, {columnId, date, content})
        }

        if(event.target.classList.contains("delete")) {
            formInput.parentElement.remove()
            Kanban.deleteTask(event.target.dataset.id)
        }
    })

    column.addEventListener("dragstart", event => {
        if(event.target.classList.contains("card")) {
            event.target.classList.add("dragging")
        }
    })

    column.addEventListener("dragover", event => {
        const card = document.querySelector(".dragging")
        column.appendChild(card)
    })

    column.addEventListener("dragend", event => {
        if(event.target.classList.contains("card")) {
            event.target.classList.remove("dragging")
            Kanban.updateTask(event.target.dataset.id, {columnId: event.target.parentElement.dataset.id, content: event.target.task.value})
        }
    })
})

function updateTaskCardStyle() {
    const now = new Date();
    for(const card of cards) {
        const deadlineInput = card.querySelector('.date')
        const deadline = new Date(deadlineInput.textContent)
        if (deadline < now) {
            card.classList.add('deadline-passed')
          }
    }
  }

window.addEventListener('load', updateTaskCardStyle)