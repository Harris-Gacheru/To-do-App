var _a, _b;
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
                        "<div class=\"task\">\n                        <div class=\"color\"></div>\n                        <div class=\"task-info\">\n                            <h4>".concat(todo.title, "</h4>\n                            <p class=\"description\">").concat(todo.description, "</p>\n            \n                            <div class=\"time-status\">\n                                <div class=\"date-user\">\n                                    <p class=\"date\">\n                                        <ion-icon name=\"time-outline\"></ion-icon>\n                                        ").concat(todo.due_date, "\n                                    </p>\n\n                                    <p class=\"date\">\n                                        Assigned To: ").concat(todo.assigned_to, "\n                                    </p>\n                                </div>\n            \n                                <button id=\"done\" onclick=\"markDone('").concat(todo.id, "')\">Mark as Done</button>\n                            </div>\n            \n                            <div class=\"actions\">\n                                <ion-icon name=\"create-outline\" onClick=\"editTask('").concat(todo.id, "')\"></ion-icon>\n            \n                                <ion-icon name=\"trash-outline\"  onClick=\"deleteTask('").concat(todo.id, "')\"></ion-icon>\n                            </div>\n                        </div>\n                    </div>");
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
                    var p;
                    var difference = todo.hourDifference / 24;
                    if (difference > 0) {
                        p = "<p class='early date'>Completed early by ".concat(difference, " day(s)</p>");
                    }
                    else if (difference == 0) {
                        p = "<p class='early date'>Completed on time </p>";
                    }
                    else {
                        p = "<p class='late date'>Completed late by ".concat(Math.abs(difference), " day(s) </p>");
                    }
                    _this.completedTasksDiv.innerHTML +=
                        "<div class=\"task\">\n                        <div class=\"color\"></div>\n                        <div class=\"task-info\">\n                            <h4>".concat(todo.title, "</h4>\n                            <p class=\"description\">").concat(todo.description, "</p>\n            \n                            <div class=\"time-status\">\n                                <div>\n                                    <p class=\"date\">\n                                        Due Date:  ").concat(todo.due_date, "\n                                    </p>\n                                    <p class=\"date\">\n                                        Completion Date:  ").concat(todo.completed_at, "\n                                    </p>\n                                    ").concat(p, "\n                                </div>\n                                <p class=\"done-by\"><span>Task done by:</span> ").concat(todo.assigned_to, "</p>\n                            </div>\n            \n                            <div class=\"actions\">            \n                                <ion-icon name=\"trash-outline\"  onClick=\"deleteTask('").concat(todo.id, "')\"></ion-icon>\n                            </div>\n                        </div>\n                    </div>");
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
            form.updateInputs(data[0].title, data[0].description, data[0].due_date, data[0].assigned_to, data[0].id);
            return id;
        })["catch"](function (err) {
            console.log(err.message);
        });
    };
    TaskHandler.prototype.markAsComplete = function (id) {
        var _this = this;
        var state = new Spinner();
        state.isLoading(true);
        fetch("http://localhost:7000/todo/status/".concat(id), {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (res) { return res.json(); })
            .then(function (result) {
            state.isLoading(false);
            _this.todoAlertDiv.innerText = result.message;
            _this.todoAlertDiv.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px';
            setTimeout(function () {
                location.reload();
            }, 1500);
        })["catch"](function (err) {
            state.isLoading(false);
            _this.todoAlertDiv.innerText = err.message;
            _this.todoAlertDiv.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        });
    };
    return TaskHandler;
}());
var FormHandler = /** @class */ (function () {
    function FormHandler() {
        this.titleInput = document.getElementById('inputTitle');
        this.descriptionInput = document.getElementById('inputDescription');
        this.dateInput = document.getElementById('inputDate');
        this.assignedToInput = document.getElementById('inputAssignedTo');
        this.inputTitleUpdate = document.getElementById('inputTitleUpdate');
        this.inputDescriptionUpdate = document.getElementById('inputDescriptionUpdate');
        this.inputDateUpdate = document.getElementById('inputDateUpdate');
        this.inputAssignedToUpdate = document.getElementById('inputAssignedToUpdate');
        this.alert = document.getElementById('alert');
        this.taskForm = document.getElementById('addTaskForm');
        this.idInput = document.getElementById('todoid');
    }
    FormHandler.prototype.submit = function () {
        var _this = this;
        var state = new Spinner();
        state.isLoading(true);
        new Promise(function (resolve, reject) {
            fetch('http://localhost:7000/todo/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: _this.titleInput.value,
                    description: _this.descriptionInput.value,
                    due_date: _this.dateInput.value,
                    assigned_to: _this.assignedToInput.value
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                if (data.Error) {
                    return reject(data.Error);
                }
                resolve(data);
            })["catch"](function (err) { return reject(err); });
        })
            .then(function (msg) {
            state.isLoading(false, true);
            _this.alert.innerText = msg.message;
            _this.alert.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px';
            setTimeout(function () {
                _this.reset();
                new ModalHandler().close();
                location.reload();
            }, 1500);
        })["catch"](function (err) {
            state.isLoading(false, true);
            _this.alert.innerText = err;
            _this.alert.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        });
    };
    FormHandler.prototype.updateInputs = function (title, description, date, assigned_to, id) {
        this.inputTitleUpdate.value = title;
        this.inputDescriptionUpdate.value = description;
        this.inputDateUpdate.value = date;
        this.inputAssignedToUpdate.value = assigned_to;
        this.idInput.value = id;
    };
    FormHandler.prototype.updateTodo = function () {
        var _this = this;
        var state = new Spinner();
        state.isLoading(true);
        new Promise(function (resolve, reject) {
            fetch("http://localhost:7000/todo/".concat(_this.idInput.value), {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    title: _this.inputTitleUpdate.value,
                    description: _this.inputDescriptionUpdate.value,
                    due_date: _this.inputDateUpdate.value,
                    assigned_to: _this.inputAssignedToUpdate.value
                })
            })
                .then(function (res) { return res.json(); })
                .then(function (result) {
                if (result.Error) {
                    return reject(result.Error);
                }
                resolve(result);
            })["catch"](function (err) { return reject(err); });
        })
            .then(function (msg) {
            state.isLoading(false, true);
            _this.alert.innerText = msg.message;
            _this.alert.style.cssText = 'background-color: #c2fec2; color: #00cb00; padding: 10px; border: 1px solid #00cb00; border-radius: 4px';
            setTimeout(function () {
                _this.reset();
                new ModalHandler().close();
                location.reload();
            }, 1500);
        })["catch"](function (err) {
            state.isLoading(false, true);
            _this.alert.innerText = err;
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
var Spinner = /** @class */ (function () {
    function Spinner() {
        this.wrapper = document.getElementById('wrapper');
        this.spinner = document.getElementById('spinner');
        this.modal = document.getElementById('modal');
    }
    Spinner.prototype.isLoading = function (state, open) {
        if (state) {
            this.spinner.style.setProperty('visibility', 'visible');
            this.wrapper.style.setProperty('visibility', 'hidden');
            this.modal.style.setProperty('visibility', 'hidden');
        }
        else {
            if (open) {
                this.spinner.style.setProperty('visibility', 'hidden');
                this.wrapper.style.setProperty('visibility', 'visible');
                this.modal.style.setProperty('visibility', 'visible');
            }
            else {
                this.spinner.style.setProperty('visibility', 'hidden');
                this.wrapper.style.setProperty('visibility', 'visible');
                // this.modal.style.setProperty('visibility', 'visible')
            }
        }
    };
    return Spinner;
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
