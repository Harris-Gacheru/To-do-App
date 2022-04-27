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
    }
    TaskHandler.prototype.createTask = function (title, description, date) {
        this.tasksDivElement.innerHTML +=
            "<div class=\"task\">\n            <div class=\"color\"></div>\n            <div class=\"task-info\">\n                <h4>".concat(title, "</h4>\n                <p class=\"description\">").concat(description, "</p>\n\n                <div class=\"time-status\">\n                    <p class=\"date\">\n                        <ion-icon name=\"time-outline\"></ion-icon>\n                        ").concat(date, "\n                    </p>\n\n                    <button id=\"done\" onclick=\"markDone(this)\">Mark as Done</button>\n                </div>\n\n                <div class=\"actions\">\n                    <ion-icon name=\"create-outline\" onClick=\"editTask(this)\"></ion-icon>\n\n                    <ion-icon name=\"trash-outline\"  onClick=\"deleteTask(this)\"></ion-icon>\n                </div>\n            </div>\n        </div>");
    };
    TaskHandler.prototype.deleteTask = function (e) {
        e.parentElement.parentElement.parentElement.remove();
    };
    TaskHandler.prototype.editTask = function (e) {
        var selectedTask = e.parentElement.parentElement.parentElement;
        new ModalHandler().open();
        new FormHandler().assign(selectedTask.children[1].children[0].innerText, selectedTask.children[1].children[1].innerText, selectedTask.children[1].children[2].children[0].innerText);
        deleteTask(e);
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
        if (this.validation()) {
            this.alert.innerText = '';
            this.alert.style.cssText = '';
            var task = new Task(this.titleInput.value, this.descriptionInput.value, this.dateInput.value);
            task.display();
            this.reset();
            new ModalHandler().close();
        }
        else {
            this.alert.innerText = 'Fill in all the fields';
            this.alert.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
        }
    };
    FormHandler.prototype.reset = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.dateInput.value = '';
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
    };
    ModalHandler.prototype.close = function () {
        this.modal.style.setProperty('visibility', 'hidden');
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
// delete
var deleteTask = function (e) {
    new TaskHandler().deleteTask(e);
};
// edit
var editTask = function (e) {
    new TaskHandler().editTask(e);
};
// mark as complete
var markDone = function (e) {
    new TaskHandler().markAsComplete(e);
};
