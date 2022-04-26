let openModalBtn = document.getElementById('openForm')
let formModal = document.getElementById('modal')
let closeModalBtn = document.getElementById('close')
let form = document.getElementById('addTaskForm')
// form input
let titleInput = <HTMLInputElement>document.getElementById('inputTitle')
let descriptionInput = <HTMLTextAreaElement>document.getElementById('inputDescription')
let dateInput = <HTMLInputElement>document.getElementById('inputDate')
let msg = <HTMLDivElement>document.getElementById('msg')

let tasks = <HTMLDivElement>document.getElementById('tasks')

let doneBtn = document.getElementById('done')
let completedTasksContainer = <HTMLDivElement>document.getElementById('completed-tasks-container')
let completedTasks = <HTMLDivElement>document.getElementById('completed-tasks')
completedTasksContainer.style.setProperty('display', 'none')

// open modal
openModalBtn?.addEventListener('click', () => {
    formModal?.style.setProperty('visibility', 'visible')
})
// close modal
closeModalBtn?.addEventListener('click', () => {
    formModal?.style.setProperty('visibility', 'hidden')
})

// submit form
form?.addEventListener('submit', (e) => {
    e.preventDefault()

    formValidation()
})

// validate form
let formValidation = () => {
    if ((titleInput.value === '') || (descriptionInput.value === '') || (dateInput.value === '')) {
        msg.innerText = 'Fill in all the fields'
        msg.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px'
    }else {
        msg.innerText = 'Task added successully'
        msg.style.cssText = 'background-color: #c1fec1; color: #0c0; padding: 10px; border: 1px solid #0c0; border-radius: 4px'

        addData()

        setTimeout(() => {
            msg.innerText = ''
            msg.style.cssText = ''
            formModal?.style.setProperty('visibility', 'hidden')
        }, 700);
    }
}

let data: any = {}
// add data
let addData = () => {
    data['title'] = titleInput.value
    data['description'] = descriptionInput.value
    data['date'] = dateInput.value

    createTask()
}

// create task
let createTask = () => {
    tasks.innerHTML += 
    `<div class="task">
        <div class="color"></div>
        <div class="task-info">
            <h4>${titleInput.value}</h4>
            <p class="description">${descriptionInput.value}</p>

            <div class="time-status">
                <p class="date">
                    <ion-icon name="time-outline"></ion-icon>
                    ${dateInput.value}
                </p>

                <button id="done" onclick="markDone(this)">Mark as Done</button>
            </div>

            <div class="actions">
                <ion-icon name="create-outline" onClick="editTask(this)"></ion-icon>

                <ion-icon name="trash-outline" onClick="deleteTask(this)"></ion-icon>
            </div>
        </div>
    </div>`

    resetForm()
}

// reset form
let resetForm = () => {
    titleInput.value = ''
    descriptionInput.value = ''
    dateInput.value = ''
}

// delete
let deleteTask = (e:any) => {
    e.parentElement.parentElement.parentElement.remove()
}

// edit task
let editTask = (e:any) => {
    formModal?.style.setProperty('visibility', 'visible')

    let selected = e.parentElement.parentElement.parentElement

    titleInput.value = selected.children[1].children[0].innerText
    descriptionInput.value = selected.children[1].children[1].innerText
    dateInput.value = selected.children[1].children[2].children[0].innerText

    selected.remove()
}

// complete task
let markDone = (e: any) => {
    let selected = e.parentElement.parentElement.parentElement

    titleInput.value = selected.children[1].children[0].innerText
    descriptionInput.value = selected.children[1].children[1].innerText
    dateInput.value = selected.children[1].children[2].children[0].innerText

    
    completedTasksContainer.style.setProperty('display', 'block')
    let status: any;
    
    if ((getDayDiff() > 0) && (getDayDiff() < 1)) {

        status = `<p class='status'>Status: <span class='ontime'>Task completed earlier by ${Math.ceil(getDayDiff())} day(s)</span></p>`
                
    } else if(getDayDiff() < -1) {

        status = `<p class='status'>Status: <span class='late'>Task submitted late by ${Math.abs(Math.ceil(getDayDiff()))} day(s)</span></p>`
                     
    }else if(getDayDiff() > 0){

        status = `<p class='status'>Status: <span class='ontime'>Task completed earlier by ${Math.floor(getDayDiff())} day(s)</span></p>`

    }else {

        status = `<p class='status'>Status: <span class='ontime'>Task completed on time</span></p>`
                
    }    

    completedTasks.innerHTML += 
        `<div class="task">
            <div class="color"></div>
            <div class="task-info">
                <h4>${titleInput.value}</h4>
                <p class="description">${descriptionInput.value}</p>

                <div class="time-status">
                    <p class="date">
                        <ion-icon name="time-outline"></ion-icon>
                        ${dateInput.value}
                    </p>

                    ${status}
                </div>
            </div>
        </div>`

    selected.remove()
    resetForm()
}

// get difference between due date and current date
let getDayDiff = () => {
    let current = new Date().getTime()
    let dueDate = new Date(dateInput.value).getTime()
    let timeDiff = dueDate - current
    let dayDiff = timeDiff/ (1000 * 3600 * 24)

    return dayDiff
}