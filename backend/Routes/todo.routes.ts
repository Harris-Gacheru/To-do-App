import express from 'express'
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '../Controller/todo.controller'
const router = express.Router()

router.post('/create', createTodo)
router.get('/', getTodos)
router.get('/:id', getTodo)
router.patch('/:id', updateTodo)
router.delete('/:id', deleteTodo)

export default router