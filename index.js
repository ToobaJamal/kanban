import Kanban from "./kanban.js";

const todo = document.querySelector(".cards.todo")
const pending = document.querySelector(".cards.pending")
const completed= document.querySelector(".cards.completed")
const cards = document.getElementsByClassName("card")

const taskbox = [todo, pending, completed]

function addTaskCard(task, index) {
    taskbox[index].innerHTML += `
        <form class="card mb-4 bg-white rounded-md p-4 w-full flex flex-col" draggable="true" data-id="${task.taskId}">
        <input class="text-black font-normal" type="text" name="task" autocomplete="off" disabled="disabled" value="${task.content}"/>
        <span class="date self-center justify-self-center text-black">${task.date}</span>
        <input type="date" class="deadline-input hide" name="date"/>
        <div class="flex flex-row justify-between">
            <span class="task-id rounded-md p-1 font-medium bg-blue-background text-white">
                #${task.taskId}
            </span>
            <span class="flex justify-end items-center">
                <button class="edit-btn p-1 bg-cyan-600 rounded-md flex my-auto" data-id="${task.taskId}"><span class="material-symbols-outlined edit text-white font-bold">
                edit
                </span></button>
                <button class="update-btn hide p-1 bg-cyan-600 rounded-md flex my-auto" data-id="${task.taskId}" data-column="${index}"><span class="material-symbols-outlined update text-white font-bold">
                check
                </span></button>
                <button class="delete-btn p-1 bg-red-500 rounded-md flex my-auto ml-2" data-id="${task.taskId}"><span class="material-symbols-outlined delete text-white font-bold" >
                delete
                </span></button>
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
        const editBtn = card.querySelector('.edit-btn')
        const edit = card.querySelector('.edit')
        const updateBtn = card.querySelector('.update')
        const update = card.querySelector('.update-btn')
        const deleteBtn = card.querySelector('.delete-btn')

        if(event.target.classList.contains("edit") || event.target.classList.contains("edit-btn")) {
            console.log("UES")
            formInput.removeAttribute("disabled")
            dateInput.classList.remove("hide")
            dateInput.value = dateDisplay.textContent.trim()
            dateDisplay.classList.add("hide")
            event.target.classList.add("hide")
            editBtn.classList.add('hide')
            updateBtn.classList.remove('hide')
            update.classList.remove('hide')

            dateInput.value = dateDisplay.textContent
        }

        if(event.target.classList.contains("deadline-input")) {
            dateInput.showPicker()
        }

        if(event.target.classList.contains("update") || event.target.classList.contains("update-btn")) {
            console.log("YES")
            formInput.setAttribute("disabled", "disabled")
            updateBtn.classList.add("hide")
            update.classList.add('hide')
            editBtn.classList.remove("hide")
            edit.classList.remove("hide")
            dateInput.classList.add("hide")
            dateDisplay.classList.remove("hide")
            dateDisplay.textContent = dateInput.value

            const taskId = update.dataset.id
            const columnId = update.dataset.column
            const content =formInput.value
            const date = dateInput.value
            Kanban.updateTask(taskId, {columnId, date, content})
        }

        if(event.target.classList.contains("delete") || event.target.classList.contains("delete-btn")) {
            formInput.parentElement.remove()
            Kanban.deleteTask(deleteBtn.dataset.id)
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
        const columnId = card.querySelector('.update-btn').dataset.column
        if (columnId !== 2 && deadline < now) {
            card.classList.add('deadline-passed')
          }
    }
  }

updateTaskCardStyle()