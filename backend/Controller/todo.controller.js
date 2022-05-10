"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeStatus = exports.deleteTodo = exports.updateTodo = exports.getTodo = exports.getCompleteTodos = exports.getTodos = exports.createTodo = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../Config/config"));
const uuid_1 = require("uuid");
const formValidator_1 = require("../Helper/formValidator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v1)();
        const { title, description, due_date, assigned_to } = req.body;
        const { error } = formValidator_1.FormSchema.validate(req.body);
        if (error) {
            return res.json({ Error: error.message });
        }
        let pool = yield mssql_1.default.connect(config_1.default);
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('title', mssql_1.default.VarChar, title)
            .input('description', mssql_1.default.VarChar, description)
            .input('due_date', mssql_1.default.VarChar, due_date)
            .input('assigned_to', mssql_1.default.VarChar, assigned_to)
            .execute('createTodo');
        try {
            let transporter = nodemailer_1.default.createTransport({ port: 587, host: 'smtp.gmail.com', secure: false, requireTLS: true, auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS } });
            yield transporter.sendMail({
                from: process.env.EMAIL,
                to: assigned_to,
                subject: 'New Task Assigned',
                text: 'Task assignment',
                html: `<p>Hello, </p>
                <p>You have been assigned a new task. Task details are as follows: </p>
                <p><span style="font-weight: bold;">Title: </span>${title}</p>
                <p><span style="font-weight: bold;">Description: </span>${description}</p>
                <p style="font-weight: bold;"><span>Due date: </span>${due_date}</p>`
            });
            res.json({ message: 'Todo created and assigned successfully' });
        }
        catch (error) {
            res.json({ Error: error });
        }
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.createTodo = createTodo;
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const todos = yield pool.request().execute('getTodos');
        res.json(todos.recordset);
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.getTodos = getTodos;
const getCompleteTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let pool = yield mssql_1.default.connect(config_1.default);
        const todos = yield pool.request().execute('getCompletedTodos');
        res.json(todos.recordset);
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.getCompleteTodos = getCompleteTodos;
const getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const todo = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getTodo');
        if (!todo.recordset[0]) {
            return res.json({ message: `Todo with id ${id} does not exist` });
        }
        res.json(todo.recordset);
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.getTodo = getTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const { title, description, due_date, assigned_to } = req.body;
        const { error } = formValidator_1.FormSchema.validate(req.body);
        if (error) {
            return res.json({ Error: error.message });
        }
        const todo = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getTodo');
        if (!todo.recordset[0]) {
            res.json({ message: `Todo with id ${id} does not exist` });
        }
        else {
            yield pool.request()
                .input('id', mssql_1.default.VarChar, id)
                .input('title', mssql_1.default.VarChar, title)
                .input('description', mssql_1.default.VarChar, description)
                .input('due_date', mssql_1.default.VarChar, due_date)
                .input('assigned_to', mssql_1.default.VarChar, assigned_to)
                .execute('updateTodo');
            if (todo.recordset[0].assigned_to !== assigned_to) {
                try {
                    let transporter = nodemailer_1.default.createTransport({ port: 587, host: 'smtp.gmail.com', secure: false, requireTLS: true, auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS } });
                    yield transporter.sendMail({
                        from: process.env.EMAIL,
                        to: todo.recordset[0].assigned_to,
                        subject: 'Task Unassignment',
                        text: 'Task Reassignment',
                        html: `<p>Hello, </p>
                        <p>You have been unassigned the task: </p>
                        <p><span style="font-weight: bold;">Title: </span>${todo.recordset[0].title}</p>
                        <p><span style="font-weight: bold;">Description: </span>${todo.recordset[0].description}</p>`
                    });
                    yield transporter.sendMail({
                        from: process.env.EMAIL,
                        to: assigned_to,
                        subject: 'New Task Assigned',
                        text: 'Task assignment',
                        html: `<p>Hello, </p>
                        <p>You have been assigned a new task. Task details are as follows: </p>
                        <p><span style="font-weight: bold;">Title: </span>${title}</p>
                        <p><span style="font-weight: bold;">Description: </span>${description}</p>
                        <p style="font-weight: bold;"><span>Due date: </span>${due_date}</p>`
                    });
                    res.json({ message: 'Todo updated and reassigned successfully' });
                }
                catch (error) {
                    res.json({ Error: error });
                }
            }
            else {
                res.json({ message: 'Todo updated successfully' });
            }
        }
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const todo = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getTodo');
        if (!todo.recordset[0]) {
            res.json({ message: `Todo with id ${id} does not exist` });
        }
        else {
            yield pool.request()
                .input('id', mssql_1.default.VarChar, id)
                .execute('deleteTodo');
            res.json({ message: `Todo deleted successfully` });
        }
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.deleteTodo = deleteTodo;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        let pool = yield mssql_1.default.connect(config_1.default);
        const todo = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getTodo');
        if (!todo.recordset[0]) {
            res.json({ message: `Todo with id ${id} does not exist` });
        }
        else {
            yield pool.request()
                .input('id', mssql_1.default.VarChar, id)
                .execute('changeStatus');
            try {
                let assignedUser = yield pool.request()
                    .query(`SELECT assigned_to, title, completed_at FROM Todos Where id = '${id}'`);
                let email = assignedUser.recordset[0].assigned_to;
                let title = assignedUser.recordset[0].title;
                let completed_at = assignedUser.recordset[0].completed_at;
                let transporter = nodemailer_1.default.createTransport({ port: 587, host: 'smtp.gmail.com', secure: false, requireTLS: true, auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS } });
                yield transporter.sendMail({
                    from: email,
                    to: process.env.EMAIL,
                    subject: 'Task Completed',
                    text: 'Task Completed',
                    html: `<p>Hello, </p>
                    <p>The task with the title: ${title} assigned to ${email} has been completed successfully on ${new Date(completed_at)}</p>`
                });
                res.json({ message: 'Todo completed successfully' });
            }
            catch (error) {
                res.json({ Error: error });
            }
            // res.json({message: 'Task completed'})
        }
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.changeStatus = changeStatus;
