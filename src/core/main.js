var openModalBtn = document.getElementById('openForm');
var formModal = document.getElementById('modal');
var closeModalBtn = document.getElementById('close');
var form = document.getElementById('addTaskForm');
// form input
var titleInput = document.getElementById('inputTitle');
var descriptionInput = document.getElementById('inputDescription');
var dateInput = document.getElementById('inputDate');
var msg = document.getElementById('msg');
var tasks = document.getElementById('tasks');
var doneBtn = document.getElementById('done');
var completedTasksContainer = document.getElementById('completed-tasks-container');
var completedTasks = document.getElementById('completed-tasks');
completedTasksContainer.style.setProperty('display', 'none');
// open modal
openModalBtn === null || openModalBtn === void 0 ? void 0 : openModalBtn.addEventListener('click', function () {
    formModal === null || formModal === void 0 ? void 0 : formModal.style.setProperty('visibility', 'visible');
});
// close modal
closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener('click', function () {
    formModal === null || formModal === void 0 ? void 0 : formModal.style.setProperty('visibility', 'hidden');
});
// submit form
form === null || form === void 0 ? void 0 : form.addEventListener('submit', function (e) {
    e.preventDefault();
    formValidation();
});
// validate form
var formValidation = function () {
    if ((titleInput.value === '') || (descriptionInput.value === '') || (dateInput.value === '')) {
        msg.innerText = 'Fill in all the fields';
        msg.style.cssText = 'background-color: #fec1c1; color: #ff2e2e; padding: 10px; border: 1px solid #ff2e2e; border-radius: 4px';
    }
    else {
        msg.innerText = 'Task added successully';
        msg.style.cssText = 'background-color: #c1fec1; color: #0c0; padding: 10px; border: 1px solid #0c0; border-radius: 4px';
        addData();
        setTimeout(function () {
            msg.innerText = '';
            msg.style.cssText = '';
            formModal === null || formModal === void 0 ? void 0 : formModal.style.setProperty('visibility', 'hidden');
        }, 700);
    }
};
var data = {};
// add data
var addData = function () {
    data['title'] = titleInput.value;
    data['description'] = descriptionInput.value;
    data['date'] = dateInput.value;
    createTask();
};
// create task
var createTask = function () {
    tasks.innerHTML +=
        "<div class=\"task\">\n        <div class=\"color\"></div>\n        <div class=\"task-info\">\n            <h4>".concat(titleInput.value, "</h4>\n            <p class=\"description\">").concat(descriptionInput.value, "</p>\n\n            <div class=\"time-status\">\n                <p class=\"date\">\n                    <ion-icon name=\"time-outline\"></ion-icon>\n                    ").concat(dateInput.value, "\n                </p>\n\n                <button id=\"done\" onclick=\"markDone(this)\">Mark as Done</button>\n            </div>\n\n            <div class=\"actions\">\n                <ion-icon name=\"create-outline\" onClick=\"editTask(this)\"></ion-icon>\n\n                <ion-icon name=\"trash-outline\" onClick=\"deleteTask(this)\"></ion-icon>\n            </div>\n        </div>\n    </div>");
    resetForm();
};
// reset form
var resetForm = function () {
    titleInput.value = '';
    descriptionInput.value = '';
    dateInput.value = '';
};
// delete
var deleteTask = function (e) {
    e.parentElement.parentElement.parentElement.remove();
};
// edit task
var editTask = function (e) {
    formModal === null || formModal === void 0 ? void 0 : formModal.style.setProperty('visibility', 'visible');
    var selected = e.parentElement.parentElement.parentElement;
    titleInput.value = selected.children[1].children[0].innerText;
    descriptionInput.value = selected.children[1].children[1].innerText;
    dateInput.value = selected.children[1].children[2].children[0].innerText;
    selected.remove();
};
// complete task
var markDone = function (e) {
    var selected = e.parentElement.parentElement.parentElement;
    titleInput.value = selected.children[1].children[0].innerText;
    descriptionInput.value = selected.children[1].children[1].innerText;
    dateInput.value = selected.children[1].children[2].children[0].innerText;
    completedTasksContainer.style.setProperty('display', 'block');
    var status;
    if ((getDayDiff() > 0) && (getDayDiff() < 1)) {
        status = "<p class='status'>Status: <span class='ontime'>Task completed earlier by ".concat(Math.ceil(getDayDiff()), " day(s)</span></p>");
    }
    else if (getDayDiff() < -1) {
        status = "<p class='status'>Status: <span class='late'>Task submitted late by ".concat(Math.abs(Math.ceil(getDayDiff())), " day(s)</span></p>");
    }
    else if (getDayDiff() > 0) {
        status = "<p class='status'>Status: <span class='ontime'>Task completed earlier by ".concat(Math.floor(getDayDiff()), " day(s)</span></p>");
    }
    else {
        status = "<p class='status'>Status: <span class='ontime'>Task completed on time</span></p>";
    }
    completedTasks.innerHTML +=
        "<div class=\"task\">\n            <div class=\"color\"></div>\n            <div class=\"task-info\">\n                <h4>".concat(titleInput.value, "</h4>\n                <p class=\"description\">").concat(descriptionInput.value, "</p>\n\n                <div class=\"time-status\">\n                    <p class=\"date\">\n                        <ion-icon name=\"time-outline\"></ion-icon>\n                        ").concat(dateInput.value, "\n                    </p>\n\n                    ").concat(status, "\n                </div>\n            </div>\n        </div>");
    selected.remove();
    resetForm();
};
// get difference between due date and current date
var getDayDiff = function () {
    var current = new Date().getTime();
    var dueDate = new Date(dateInput.value).getTime();
    var timeDiff = dueDate - current;
    var dayDiff = timeDiff / (1000 * 3600 * 24);
    return dayDiff;
};
