class Task {
    constructor (public title: string, public description: string, public date: string){
        this.title = title
        this.description = description
        this.date = date
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

    getUncompletedTasks() {
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
            
                                <button id="done" onclick="markDone('${todo.id}')">Mark as Done</button>
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

    getCompletedTasks() {
        fetch('http://localhost:7000/todo/completed', {
            method: 'GET'
        })
        .then((response) => response.json())
        .then((todos) => {       
            if (todos.length == 0) {
                let msg = `<p class='no-tasks'>No completed tasks available!</p>`
                this.completedTasksDiv.innerHTML = msg
            } else {
                todos.map((todo: any) => {                    
                    this.completedTasksDiv.innerHTML +=  
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
            
                            </div>
            
                            <div class="actions">            
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
        fetch(`http://localhost:7000/todo/${id}`, {
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
        fetch(`http://localhost:7000/todo/${id}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then((data) => {            
            let modal = new ModalHandler()
            modal.open()
            modal.addTaskFormDisplay(false)
            modal.updateTaskFormDisplay(true)
            let form = new FormHandler()
            form.updateInputs(data[0].title, data[0].description, data[0].due_date, data[0].id) 

            return id
        }).catch((err) => {
            console.log(err.message)            
        });          
    }

    markAsComplete(id: string) {
        fetch(`http://localhost:7000/todo/status/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res =>  res.json())
        .then(result => {
            this.todoAlertDiv.innerText = result.message
            this.todoAlertDiv.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px'

            setTimeout(() => {
                location.reload()
            }, 800);
        })
        .catch((err) => {  
            this.todoAlertDiv.innerText = err.message
            this.todoAlertDiv.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px'          
        })
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
    inputTitleUpdate: HTMLInputElement
    inputDescriptionUpdate: HTMLTextAreaElement
    inputDateUpdate: HTMLInputElement
    alert: HTMLDivElement
    taskForm: HTMLFormElement
    idInput: HTMLInputElement

    constructor() {
        this.titleInput = <HTMLInputElement>document.getElementById('inputTitle')
        this.descriptionInput = <HTMLTextAreaElement>document.getElementById('inputDescription')
        this.dateInput = <HTMLInputElement>document.getElementById('inputDate') 
        this.inputTitleUpdate = <HTMLInputElement>document.getElementById('inputTitleUpdate')
        this.inputDescriptionUpdate = <HTMLTextAreaElement>document.getElementById('inputDescriptionUpdate')
        this.inputDateUpdate = <HTMLInputElement>document.getElementById('inputDateUpdate')      
        this.alert = <HTMLDivElement>document.getElementById('alert') 
        this.taskForm = <HTMLFormElement> document.getElementById('addTaskForm')
        this.idInput = <HTMLInputElement>document.getElementById('todoid')
    }

    validation(){
        if ((this.titleInput.value === '') || (this.descriptionInput.value === '') || (this.dateInput.value === '')) {
            return false
        }else{
            return true
        }
    }

    submit() {
        if (this.validation()) {
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
                console.log(msg.message)
                
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
        } else {
            this.alert.innerText = 'Fill in all details'
            this.alert.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px' 
        }
        
        
    }

    updateInputs(title: string, description: string, date: string, id:string) {
        this.inputTitleUpdate.value = title
        this.inputDescriptionUpdate.value = description
        this.inputDateUpdate.value = date
        this.idInput.value = id
    }

    updateTodo() {
        fetch(`http://localhost:7000/todo/${this.idInput.value}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: this.inputTitleUpdate.value,
                description: this.inputDescriptionUpdate.value,
                due_date: this.inputDateUpdate.value
            }),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(msg => {
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
    addTaskForm: HTMLFormElement
    updateTaskForm: HTMLFormElement

    constructor() {
        this.modal = <HTMLDivElement>document.getElementById('modal')        
        this.addTaskForm = <HTMLFormElement>document.getElementById('addTaskForm')
        this.updateTaskForm = <HTMLFormElement>document.getElementById('updateTaskForm')
    }

    open(){
        this.modal.style.setProperty('visibility', 'visible')
        new FormHandler().reset()
    }

    close() {
        this.modal.style.setProperty('visibility', 'hidden')
        new FormHandler().reset()
    }

    addTaskFormDisplay(display: boolean) {      
        if (display === true) {
            this.addTaskForm.style.setProperty('display', 'block')  
        }  else{
            this.addTaskForm.style.setProperty('display', 'none')  
        }
    }

    updateTaskFormDisplay(display: boolean) {
        if (display) {
            this.updateTaskForm.style.setProperty('display', 'block') 
        }  else{
            this.updateTaskForm.style.setProperty('display', 'none') 
        }
    }
}

// open modal
let openModal = () => {
    let modal: any = new ModalHandler()
    modal.open()
    modal.updateTaskFormDisplay(false)
    modal.addTaskFormDisplay(true)
}

// close modal
let closeModal = () => {
    new ModalHandler().close()
}

// add task
document.getElementById('addTaskForm')?.addEventListener('submit', (e: Event) => {
    e.preventDefault()
    new FormHandler().submit()
})

// update task
document.getElementById('updateTaskForm')?.addEventListener('submit', (e) => {
    e.preventDefault()
    new FormHandler().updateTodo()    
})

// get completed Task
new TaskHandler().getUncompletedTasks()

// get uncompleted tasks
new TaskHandler().getCompletedTasks()

// delete
let deleteTask = (id: string) => {
    new TaskHandler().deleteTask(id)
}

// edit
let editTask = (id: string) => {
    new TaskHandler().editTask(id)
}

// mark as complete
let markDone = (id: string) => {
    new TaskHandler().markAsComplete(id)
}