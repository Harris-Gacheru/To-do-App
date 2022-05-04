class Task {
    constructor (public title: string, public description: string, public date: string){
        this.title = title
        this.description = description
        this.date = date
    }

    display(){
        let task = new TaskHandler
        task.createTask(this.title, this.description, this.date)
    }
}


class TaskHandler {
    tasksDivElement: HTMLDivElement
    completedTasksMain: HTMLDivElement
    completedTasksDiv: HTMLDivElement
    todoAlertDiv: HTMLDivElement

    constructor() {
        this.tasksDivElement = <HTMLDivElement>document.getElementById('tasks')
        this.completedTasksMain = <HTMLDivElement>document.getElementById('completed-tasks-container')
        this.completedTasksDiv = <HTMLDivElement>document.getElementById('completed-tasks')
        this.todoAlertDiv = <HTMLDivElement>document.getElementById('todoAlert')
    }

    createTask(title: string, description: string, date: string) {
        this.tasksDivElement.innerHTML += 
        `<div class="task">
            <div class="color"></div>
            <div class="task-info">
                <h4>${title}</h4>
                <p class="description">${description}</p>

                <div class="time-status">
                    <p class="date">
                        <ion-icon name="time-outline"></ion-icon>
                        ${date}
                    </p>

                    <button id="done" onclick="markDone(this)">Mark as Done</button>
                </div>

                <div class="actions">
                    <ion-icon name="create-outline" onClick="editTask(this)"></ion-icon>

                    <ion-icon name="trash-outline"  onClick="deleteTask(this)"></ion-icon>
                </div>
            </div>
        </div>`
    }
    

    getTasks() {
        fetch('http://localhost:7000/todo/', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((todos) => {       
            if (todos.length == 0) {
                let msg = `<p class='no-tasks'>No todo tasks available!</p>`
                this.tasksDivElement.innerHTML = msg
            } else {
                todos.map((todo: any) => {

                    console.log(todo);
                    
                    this.tasksDivElement.innerHTML +=  
                    `<div class="task">
                        <div class="color"></div>
                        <div class="task-info">
                            <h4>${todo.title}</h4>
                            <p class="description">${todo.description}</p>
            
                            <div class="time-status">
                                <p class="date">
                                    <ion-icon name="time-outline"></ion-icon>
                                    ${todo.due_date}
                                </p>
            
                                <button id="done" onclick="markDone(this)">Mark as Done</button>
                            </div>
            
                            <div class="actions">
                                <ion-icon name="create-outline" onClick="editTask('${todo.id}')"></ion-icon>
            
                                <ion-icon name="trash-outline"  onClick="deleteTask('${todo.id}')"></ion-icon>
                            </div>
                        </div>
                    </div>`               
                })              
            }
        })
        .catch(err => alert(err.message))
    }

    deleteTask(id: string) {
        let todoId = id
        fetch(`http://localhost:7000/todo/${todoId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then((result) => {
            console.log(result.message)
            this.todoAlertDiv.innerText = result.message
            this.todoAlertDiv.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px'
            
            setTimeout(() => {
                location.reload()
            }, 800); 
        }).catch((err) => {
            console.log(err)  
            this.todoAlertDiv.innerText = err.message
            this.todoAlertDiv.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px'          
        })
    }

    editTask(id: string){
        let todoId = id

        fetch(`http://localhost:7000/todo/${todoId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data[0].due_date)
            
            new ModalHandler().open()
            new FormHandler().assign(data[0].title, data[0].description, data[0].due_date)
        })
        
        // let selectedTask = e.parentElement.parentElement.parentElement

        // new ModalHandler().open()
        // new FormHandler().assign(selectedTask.children[1].children[0].innerText, selectedTask.children[1].children[1].innerText, selectedTask.children[1].children[2].children[0].innerText)

        // deleteTask(e)
        
    }

    markAsComplete(e : any) {
        this.completedTasksMain.style.setProperty('display', 'block')
        let selectedTask = e.parentElement.parentElement.parentElement
        let date = selectedTask.children[1].children[2].children[0].innerText
        let status: string

        if ((this.getDayDiff(date) > 0) && (this.getDayDiff(date) < 1)) {

            status = `<p class='status'>Status: <span class='ontime'>Task completed earlier by ${Math.ceil(this.getDayDiff(date))} day(s)</span></p>`
                    
        } else if(this.getDayDiff(date) < -1) {
    
            status = `<p class='status'>Status: <span class='late'>Task submitted late by ${Math.abs(Math.ceil(this.getDayDiff(date)))} day(s)</span></p>`
                         
        }else if(this.getDayDiff(date) > 0){
    
            status = `<p class='status'>Status: <span class='ontime'>Task completed earlier by ${Math.floor(this.getDayDiff(date))} day(s)</span></p>`
    
        }else {
    
            status = `<p class='status'>Status: <span class='ontime'>Task completed on time</span></p>`
                    
        }   
        
        this.completedTasksDiv.innerHTML += 
        `<div class="task">
            <div class="color"></div>
            <div class="task-info">
                <h4>${selectedTask.children[1].children[0].innerText}</h4>
                <p class="description">${selectedTask.children[1].children[1].innerText}</p>

                <div class="time-status">
                    <p class="date">
                        <ion-icon name="time-outline"></ion-icon>
                        ${selectedTask.children[1].children[2].children[0].innerText}
                    </p>

                    ${status}
                </div>
            </div>
        </div>`

        selectedTask.remove()
    }

    getDayDiff(dueDate: string) {
        let currentDate = new Date()
        let due = new Date(dueDate)
        let timeDiff = due.getTime() - currentDate.getTime()
        let dayDiff = timeDiff/ (1000 * 3600 * 24)

        return dayDiff
    }
}

class FormHandler {

    titleInput: HTMLInputElement
    descriptionInput: HTMLTextAreaElement
    dateInput: HTMLInputElement
    addTaskBtn: HTMLButtonElement
    alert: HTMLDivElement

    constructor() {
        this.titleInput = <HTMLInputElement>document.getElementById('inputTitle')
        this.descriptionInput = <HTMLTextAreaElement>document.getElementById('inputDescription')
        this.dateInput = <HTMLInputElement>document.getElementById('inputDate')
        this.addTaskBtn = <HTMLButtonElement>document.getElementById('addTask')       
        this.alert = <HTMLDivElement>document.getElementById('alert') 
    }

    validation(){
        if ((this.titleInput.value === '') || (this.descriptionInput.value === '') || (this.dateInput.value === '')) {
            return false
        }else{
            return true
        }
    }

    submit() {
        fetch('http://localhost:7000/todo/create', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                title: this.titleInput.value,
                description: this.descriptionInput.value,
                due_date: this.dateInput.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(msg => {
            console.log(msg)
            this.alert.innerText = msg.message
            this.alert.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px'

            setTimeout(() => {
                this.reset()
                new ModalHandler().close()
                location.reload()
            }, 800);
        })
        .catch(err => {
            this.alert.innerText = err.message
            this.alert.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px'      
        })
        
    }

    reset() {
        this.titleInput.value = ''
        this.descriptionInput.value = ''
        this.dateInput.value = ''
        this.alert.innerText = ''
        this.alert.style.cssText = '' 
    }

    assign(title: string, description: string, date: string){
        this.titleInput.value = title
        this.descriptionInput.value = description
        this.dateInput.value = date
    }
}

class ModalHandler {
    modal: HTMLDivElement

    constructor() {
        this.modal = <HTMLDivElement>document.getElementById('modal')
    }

    open(){
        this.modal.style.setProperty('visibility', 'visible')
        new FormHandler().reset()
    }

    close() {
        this.modal.style.setProperty('visibility', 'hidden')
        new FormHandler().reset()
    }
}

// open modal
let openModal = () => {
    new ModalHandler().open()
}

// close modal
let closeModal = () => {
    new ModalHandler().close()
}

// onsubmit
document.getElementById('modal')?.addEventListener('submit', (e: Event) => {
    e.preventDefault()
    new FormHandler().submit()
})
// get Task
new TaskHandler().getTasks()

// delete
let deleteTask = (id: string) => {
    new TaskHandler().deleteTask(id)
}

// edit
let editTask = (id: string) => {
    new TaskHandler().editTask(id)
}

// mark as complete
let markDone = (e: Event) => {
    new TaskHandler().markAsComplete(e)
}