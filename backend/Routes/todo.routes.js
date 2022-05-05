"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todo_controller_1 = require("../Controller/todo.controller");
const router = express_1.default.Router();
router.post('/create', todo_controller_1.createTodo);
router.get('/', todo_controller_1.getTodos);
router.get('/completed', todo_controller_1.getCompleteTodos);
router.get('/:id', todo_controller_1.getTodo);
router.patch('/:id', todo_controller_1.updateTodo);
router.patch('/status/:id', todo_controller_1.changeStatus);
router.delete('/:id', todo_controller_1.deleteTodo);
exports.default = router;
