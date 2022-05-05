import express from 'express'
import { changeStatus, createTodo, deleteTodo, getCompleteTodos, getTodo, getTodos, updateTodo } from '../Controller/todo.controller'
const router = express.Router()

router.post('/create', createTodo)
router.get('/', getTodos)
router.get('/completed', getCompleteTodos)
router.get('/:id', getTodo)
router.patch('/:id', updateTodo)
router.patch('/status/:id', changeStatus)
router.delete('/:id', deleteTodo)

export default router