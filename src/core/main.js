var _a, _b;
var Task = /** @class */ (function () {
    function Task(title, description, date) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.title = title;
        this.description = description;
        this.date = date;
    }
    return Task;
}());
var TaskHandler = /** @class */ (function () {
    function TaskHandler() {
        this.tasksDivElement = document.getElementById('tasks');
        this.completedTasksMain = document.getElementById('completed-tasks-container');
        this.completedTasksDiv = document.getElementById('completed-tasks');
        this.todoAlertDiv = document.getElementById('todoAlert');
    }
    TaskHandler.prototype.getUncompletedTasks = function () {
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
                    _this.tasksDivElement.innerHTML +=
                        "<div class=\"task\">\n                        <div class=\"color\"></div>\n                        <div class=\"task-info\">\n                            <h4>".concat(todo.title, "</h4>\n                            <p class=\"description\">").concat(todo.description, "</p>\n            \n                            <div class=\"time-status\">\n                                <p class=\"date\">\n                                    <ion-icon name=\"time-outline\"></ion-icon>\n                                    ").concat(todo.due_date, "\n                                </p>\n            \n                                <button id=\"done\" onclick=\"markDone('").concat(todo.id, "')\">Mark as Done</button>\n                            </div>\n            \n                            <div class=\"actions\">\n                                <ion-icon name=\"create-outline\" onClick=\"editTask('").concat(todo.id, "')\"></ion-icon>\n            \n                                <ion-icon name=\"trash-outline\"  onClick=\"deleteTask('").concat(todo.id, "')\"></ion-icon>\n                            </div>\n                        </div>\n                    </div>");
                });
            }
        })["catch"](function (err) { return alert(err.message); });
    };
    TaskHandler.prototype.getCompletedTasks = function () {
        var _this = this;
        fetch('http://localhost:7000/todo/completed', {
            method: 'GET'
        })
            .then(function (response) { return response.json(); })
            .then(function (todos) {
            if (todos.length == 0) {
                var msg = "<p class='no-tasks'>No completed tasks available!</p>";
                _this.completedTasksDiv.innerHTML = msg;
            }
            else {
                todos.map(function (todo) {
                    _this.completedTasksDiv.innerHTML +=
                        "<div class=\"task\">\n                        <div class=\"color\"></div>\n                        <div class=\"task-info\">\n                            <h4>".concat(todo.title, "</h4>\n                            <p class=\"description\">").concat(todo.description, "</p>\n            \n                            <div class=\"time-status\">\n                                <p class=\"date\">\n                                    <ion-icon name=\"time-outline\"></ion-icon>\n                                    ").concat(todo.due_date, "\n                                </p>\n            \n                            </div>\n            \n                            <div class=\"actions\">            \n                                <ion-icon name=\"trash-outline\"  onClick=\"deleteTask('").concat(todo.id, "')\"></ion-icon>\n                            </div>\n                        </div>\n                    </div>");
                });
            }
        })["catch"](function (err) { return alert(err.message); });
    };
    TaskHandler.prototype.deleteTask = function (id) {
        var _this = this;
        fetch("http://localhost:7000/todo/".concat(id), {
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
        fetch("http://localhost:7000/todo/".concat(id), {
            method: 'GET'
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            var modal = new ModalHandler();
            modal.open();
            modal.addTaskFormDisplay(false);
            modal.updateTaskFormDisplay(true);
            var form = new FormHandler();
            form.updateInputs(data[0].title, data[0].description, data[0].due_date, data[0].id);
            return id;
        })["catch"](function (err) {
            console.log(err.message);
        });
    };
    TaskHandler.prototype.markAsComplete = function (id) {
        var _this = this;
        fetch("http://localhost:7000/todo/status/".concat(id), {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (res) { return res.json(); })
            .then(function (result) {
            _this.todoAlertDiv.innerText = result.message;
            _this.todoAlertDiv.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px';
            setTimeout(function () {
                location.reload();
            }, 800);
        })["catch"](function (err) {
            _this.todoAlertDiv.innerText = err.message;
            _this.todoAlertDiv.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        });
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
        this.inputTitleUpdate = document.getElementById('inputTitleUpdate');
        this.inputDescriptionUpdate = document.getElementById('inputDescriptionUpdate');
        this.inputDateUpdate = document.getElementById('inputDateUpdate');
        this.alert = document.getElementById('alert');
        this.taskForm = document.getElementById('addTaskForm');
        this.idInput = document.getElementById('todoid');
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
                .then(function (res) { return res.json(); })
                .then(function (msg) {
                console.log(msg.message);
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
        }
        else {
            this.alert.innerText = 'Fill in all details';
            this.alert.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        }
    };
    FormHandler.prototype.updateInputs = function (title, description, date, id) {
        this.inputTitleUpdate.value = title;
        this.inputDescriptionUpdate.value = description;
        this.inputDateUpdate.value = date;
        this.idInput.value = id;
    };
    FormHandler.prototype.updateTodo = function () {
        var _this = this;
        fetch("http://localhost:7000/todo/".concat(this.idInput.value), {
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
            .then(function (res) { return res.json(); })
            .then(function (msg) {
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
        this.addTaskForm = document.getElementById('addTaskForm');
        this.updateTaskForm = document.getElementById('updateTaskForm');
    }
    ModalHandler.prototype.open = function () {
        this.modal.style.setProperty('visibility', 'visible');
        new FormHandler().reset();
    };
    ModalHandler.prototype.close = function () {
        this.modal.style.setProperty('visibility', 'hidden');
        new FormHandler().reset();
    };
    ModalHandler.prototype.addTaskFormDisplay = function (display) {
        if (display === true) {
            this.addTaskForm.style.setProperty('display', 'block');
        }
        else {
            this.addTaskForm.style.setProperty('display', 'none');
        }
    };
    ModalHandler.prototype.updateTaskFormDisplay = function (display) {
        if (display) {
            this.updateTaskForm.style.setProperty('display', 'block');
        }
        else {
            this.updateTaskForm.style.setProperty('display', 'none');
        }
    };
    return ModalHandler;
}());
// open modal
var openModal = function () {
    var modal = new ModalHandler();
    modal.open();
    modal.updateTaskFormDisplay(false);
    modal.addTaskFormDisplay(true);
};
// close modal
var closeModal = function () {
    new ModalHandler().close();
};
// add task
(_a = document.getElementById('addTaskForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (e) {
    e.preventDefault();
    new FormHandler().submit();
});
// update task
(_b = document.getElementById('updateTaskForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', function (e) {
    e.preventDefault();
    new FormHandler().updateTodo();
});
// get completed Task
new TaskHandler().getUncompletedTasks();
// get uncompleted tasks
new TaskHandler().getCompletedTasks();
// delete
var deleteTask = function (id) {
    new TaskHandler().deleteTask(id);
};
// edit
var editTask = function (id) {
    new TaskHandler().editTask(id);
};
// mark as complete
var markDone = function (id) {
    new TaskHandler().markAsComplete(id);
};
