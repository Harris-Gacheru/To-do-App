var _a;
var Task = /** @class */ (function () {
    function Task(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.title = title;
        this.description = description;
        this.date = date;
    }
    Task.prototype.display = function () {
        var task = new TaskHandler;
        task.createTask(this.title, this.description, this.date);
    };
    return Task;
}());
var TaskHandler = /** @class */ (function () {
    function TaskHandler() {
        this.tasksDivElement = document.getElementById('tasks');
        this.completedTasksMain = document.getElementById('completed-tasks-container');
        this.completedTasksDiv = document.getElementById('completed-tasks');
        this.todoAlertDiv = document.getElementById('todoAlert');
    }
    TaskHandler.prototype.createTask = function (title, description, date) {
        this.tasksDivElement.innerHTML +=
            "<div class=\"task\">\n            <div class=\"color\"></div>\n            <div class=\"task-info\">\n                <h4>".concat(title, "</h4>\n                <p class=\"description\">").concat(description, "</p>\n\n                <div class=\"time-status\">\n                    <p class=\"date\">\n                        <ion-icon name=\"time-outline\"></ion-icon>\n                        ").concat(date, "\n                    </p>\n\n                    <button id=\"done\" onclick=\"markDone(this)\">Mark as Done</button>\n                </div>\n\n                <div class=\"actions\">\n                    <ion-icon name=\"create-outline\" onClick=\"editTask(this)\"></ion-icon>\n\n                    <ion-icon name=\"trash-outline\"  onClick=\"deleteTask(this)\"></ion-icon>\n                </div>\n            </div>\n        </div>");
    };
    TaskHandler.prototype.getTasks = function () {
        var _this = this;
        fetch('http://localhost:7000/todo/', {
            method: 'GET'
        })
            .then(function (response) { return response.json(); })
            .then(function (todos) {
            if (todos.length == 0) {
                var msg = "<p class='no-tasks'>No todo tasks available!</p>";
                _this.tasksDivElement.innerHTML = msg;
            }
            else {
                todos.map(function (todo) {
                    console.log(todo);
                    _this.tasksDivElement.innerHTML +=
                        "<div class=\"task\">\n                        <div class=\"color\"></div>\n                        <div class=\"task-info\">\n                            <h4>".concat(todo.title, "</h4>\n                            <p class=\"description\">").concat(todo.description, "</p>\n            \n                            <div class=\"time-status\">\n                                <p class=\"date\">\n                                    <ion-icon name=\"time-outline\"></ion-icon>\n                                    ").concat(todo.due_date, "\n                                </p>\n            \n                                <button id=\"done\" onclick=\"markDone(this)\">Mark as Done</button>\n                            </div>\n            \n                            <div class=\"actions\">\n                                <ion-icon name=\"create-outline\" onClick=\"editTask('").concat(todo.id, "')\"></ion-icon>\n            \n                                <ion-icon name=\"trash-outline\"  onClick=\"deleteTask('").concat(todo.id, "')\"></ion-icon>\n                            </div>\n                        </div>\n                    </div>");
                });
            }
        })["catch"](function (err) { return alert(err.message); });
    };
    TaskHandler.prototype.deleteTask = function (id) {
        var _this = this;
        var todoId = id;
        fetch("http://localhost:7000/todo/".concat(todoId), {
            method: 'DELETE'
        })
            .then(function (res) { return res.json(); })
            .then(function (result) {
            console.log(result.message);
            _this.todoAlertDiv.innerText = result.message;
            _this.todoAlertDiv.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px';
            setTimeout(function () {
                location.reload();
            }, 800);
        })["catch"](function (err) {
            console.log(err);
            _this.todoAlertDiv.innerText = err.message;
            _this.todoAlertDiv.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        });
    };
    TaskHandler.prototype.editTask = function (id) {
        var todoId = id;
        fetch("http://localhost:7000/todo/".concat(todoId))
            .then(function (res) { return res.json(); })
            .then(function (data) {
            console.log(data[0].due_date);
            new ModalHandler().open();
            new FormHandler().assign(data[0].title, data[0].description, data[0].due_date);
        });
        // let selectedTask = e.parentElement.parentElement.parentElement
        // new ModalHandler().open()
        // new FormHandler().assign(selectedTask.children[1].children[0].innerText, selectedTask.children[1].children[1].innerText, selectedTask.children[1].children[2].children[0].innerText)
        // deleteTask(e)
    };
    TaskHandler.prototype.markAsComplete = function (e) {
        this.completedTasksMain.style.setProperty('display', 'block');
        var selectedTask = e.parentElement.parentElement.parentElement;
        var date = selectedTask.children[1].children[2].children[0].innerText;
        var status;
        if ((this.getDayDiff(date) > 0) && (this.getDayDiff(date) < 1)) {
            status = "<p class='status'>Status: <span class='ontime'>Task completed earlier by ".concat(Math.ceil(this.getDayDiff(date)), " day(s)</span></p>");
        }
        else if (this.getDayDiff(date) < -1) {
            status = "<p class='status'>Status: <span class='late'>Task submitted late by ".concat(Math.abs(Math.ceil(this.getDayDiff(date))), " day(s)</span></p>");
        }
        else if (this.getDayDiff(date) > 0) {
            status = "<p class='status'>Status: <span class='ontime'>Task completed earlier by ".concat(Math.floor(this.getDayDiff(date)), " day(s)</span></p>");
        }
        else {
            status = "<p class='status'>Status: <span class='ontime'>Task completed on time</span></p>";
        }
        this.completedTasksDiv.innerHTML +=
            "<div class=\"task\">\n            <div class=\"color\"></div>\n            <div class=\"task-info\">\n                <h4>".concat(selectedTask.children[1].children[0].innerText, "</h4>\n                <p class=\"description\">").concat(selectedTask.children[1].children[1].innerText, "</p>\n\n                <div class=\"time-status\">\n                    <p class=\"date\">\n                        <ion-icon name=\"time-outline\"></ion-icon>\n                        ").concat(selectedTask.children[1].children[2].children[0].innerText, "\n                    </p>\n\n                    ").concat(status, "\n                </div>\n            </div>\n        </div>");
        selectedTask.remove();
    };
    TaskHandler.prototype.getDayDiff = function (dueDate) {
        var currentDate = new Date();
        var due = new Date(dueDate);
        var timeDiff = due.getTime() - currentDate.getTime();
        var dayDiff = timeDiff / (1000 * 3600 * 24);
        return dayDiff;
    };
    return TaskHandler;
}());
var FormHandler = /** @class */ (function () {
    function FormHandler() {
        this.titleInput = document.getElementById('inputTitle');
        this.descriptionInput = document.getElementById('inputDescription');
        this.dateInput = document.getElementById('inputDate');
        this.addTaskBtn = document.getElementById('addTask');
        this.alert = document.getElementById('alert');
    }
    FormHandler.prototype.validation = function () {
        if ((this.titleInput.value === '') || (this.descriptionInput.value === '') || (this.dateInput.value === '')) {
            return false;
        }
        else {
            return true;
        }
    };
    FormHandler.prototype.submit = function () {
        var _this = this;
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
            .then(function (res) { return res.json(); })
            .then(function (msg) {
            console.log(msg);
            _this.alert.innerText = msg.message;
            _this.alert.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px';
            setTimeout(function () {
                _this.reset();
                new ModalHandler().close();
                location.reload();
            }, 800);
        })["catch"](function (err) {
            _this.alert.innerText = err.message;
            _this.alert.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        });
    };
    FormHandler.prototype.reset = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.dateInput.value = '';
        this.alert.innerText = '';
        this.alert.style.cssText = '';
    };
    FormHandler.prototype.assign = function (title, description, date) {
        this.titleInput.value = title;
        this.descriptionInput.value = description;
        this.dateInput.value = date;
    };
    return FormHandler;
}());
var ModalHandler = /** @class */ (function () {
    function ModalHandler() {
        this.modal = document.getElementById('modal');
    }
    ModalHandler.prototype.open = function () {
        this.modal.style.setProperty('visibility', 'visible');
        new FormHandler().reset();
    };
    ModalHandler.prototype.close = function () {
        this.modal.style.setProperty('visibility', 'hidden');
        new FormHandler().reset();
    };
    return ModalHandler;
}());
// open modal
var openModal = function () {
    new ModalHandler().open();
};
// close modal
var closeModal = function () {
    new ModalHandler().close();
};
// onsubmit
(_a = document.getElementById('modal')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) {
    e.preventDefault();
    new FormHandler().submit();
});
// get Task
new TaskHandler().getTasks();
// delete
var deleteTask = function (id) {
    new TaskHandler().deleteTask(id);
};
// edit
var editTask = function (id) {
    new TaskHandler().editTask(id);
};
// mark as complete
var markDone = function (e) {
    new TaskHandler().markAsComplete(e);
};
