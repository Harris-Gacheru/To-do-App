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
exports.deleteTodo = exports.updateTodo = exports.getTodo = exports.getTodos = exports.createTodo = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../Config/config"));
const uuid_1 = require("uuid");
const createTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (0, uuid_1.v1)();
        const { title, description, due_date } = req.body;
        let pool = yield mssql_1.default.connect(config_1.default);
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('title', mssql_1.default.VarChar, title)
            .input('description', mssql_1.default.VarChar, description)
            .input('due_date', mssql_1.default.VarChar, due_date)
            .execute('createTodo');
        res.json({ message: 'Todo created successfully' });
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
        console.log('Getting todos...');
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.getTodos = getTodos;
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
        console.log('Getting todo...');
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
        const { title, description, due_date } = req.body;
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
                .execute('updateTodo');
            res.json({ message: 'Todo updated successfuly' });
            console.log('Updating todo...');
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
            res.json({ message: `Todo was deleted successfully` });
            console.log('Deleting todo...');
        }
    }
    catch (error) {
        res.json({ Error: error.message });
    }
});
exports.deleteTodo = deleteTodo;
