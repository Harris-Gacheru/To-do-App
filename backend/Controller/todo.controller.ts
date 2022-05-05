import { RequestHandler } from "express"
import mssql from 'mssql'
import sqlConfig from "../Config/config"
import { v1 as uid } from 'uuid'
import { FormSchema } from "../Helper/formValidator"

export const createTodo: RequestHandler = async(req, res) => {
    try {
        const id = uid()
        const { title, description, due_date } = req.body as { title: string, description: string, due_date: string }

        // const { error } = FormSchema.validate(req.body)
        // if (error) {
        //     return res.json({Error: error.message})
        // }

        let pool = await mssql.connect(sqlConfig)
        await pool.request()
        .input('id', mssql.VarChar, id)
        .input('title', mssql.VarChar, title)
        .input('description', mssql.VarChar, description)
        .input('due_date', mssql.VarChar, due_date)
        .execute('createTodo')

        res.json({message: 'Todo created successfully'})
    } catch (error: any) {        
        res.json({Error: error.message})
    }
}

export const getTodos: RequestHandler = async(req, res) => {
    try {
        let pool = await mssql.connect(sqlConfig)
        const todos = await pool.request().execute('getTodos')
        res.json(todos.recordset)     
    } catch (error: any) {
        res.json({Error: error.message})
    }
}

export const getCompleteTodos: RequestHandler = async(req, res) => {
    try {
        let pool = await mssql.connect(sqlConfig)
        const todos = await pool.request().execute('getCompletedTodos')
        res.json(todos.recordset)       
    } catch (error: any) {
        res.json({Error: error.message})
    }
}

export const getTodo: RequestHandler<{id: string}> = async(req, res) => {
    try {
        const id = req.params.id
        let pool = await mssql.connect(sqlConfig)
        const todo = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getTodo')

        if (!todo.recordset[0]) {
            return res.json({message:`Todo with id ${id} does not exist`})
        }

        res.json(todo.recordset)
    } catch (error: any) {
        res.json({Error: error.message})
    }
}

export const updateTodo: RequestHandler<{id: string}> = async(req, res) => {
    try {
        const id = req.params.id
        let pool = await mssql.connect(sqlConfig)
        const { title, description, due_date } = req.body as { title: string, description: string, due_date: string }
        
        // const { error } = FormSchema.validate(req.body)
        // if (error) {
        //     return res.json({Error: error.message})
        // }

        const todo = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getTodo')

        if (!todo.recordset[0]) {
            res.json({message: `Todo with id ${id} does not exist`})
        } else{
            await pool.request()
            .input('id', mssql.VarChar, id)
            .input('title', mssql.VarChar, title)
            .input('description', mssql.VarChar, description)
            .input('due_date', mssql.VarChar, due_date)
            .execute('updateTodo')

            res.json({message: 'Todo updated successfuly'})
        }
    } catch (error: any) {
        res.json({Error: error.message})
    }
}

export const deleteTodo: RequestHandler<{id: string}> = async(req, res) => {
    try {
        const id = req.params.id

        let pool = await mssql.connect(sqlConfig)
        const todo = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getTodo')

        if (!todo.recordset[0]) {
            res.json({message: `Todo with id ${id} does not exist`})
        } else{
            await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('deleteTodo')

            res.json({message: `Todo deleted successfully`})
        }
    } catch (error: any) {
        res.json({Error: error.message})
    }    
}

export const changeStatus: RequestHandler<{id: string}> = async (req, res) => {
    try {
        const id = req.params.id

        let pool = await mssql.connect(sqlConfig)
        const todo = await pool.request()
        .input('id', mssql.VarChar, id)
        .execute('getTodo')

        if(!todo.recordset[0]){
            res.json({message: `Todo with id ${id} does not exist`})
        } else{
            await pool.request()
            .input('id', mssql.VarChar, id)
            .execute('changeStatus')
    
            res.json({message: 'Task completed'})
        }
        
    } catch (error: any) {
        res.json({Error: error.message})
    }
}