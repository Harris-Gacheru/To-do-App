import { RequestHandler } from "express"
import mssql from 'mssql'
import sqlConfig from "../Config/config"
import { v1 as uid } from 'uuid'
import { FormSchema } from "../Helper/formValidator"
import nodemailer from 'nodemailer'

export const createTodo: RequestHandler = async(req, res) => {
    try {
        const id = uid()
        const { title, description, due_date, assigned_to } = req.body as { title: string, description: string, due_date: string, assigned_to: string }

        const { error } = FormSchema.validate(req.body)
        if (error) {
            return res.json({Error: error.message})
        }

        let pool = await mssql.connect(sqlConfig)
        await pool.request()
        .input('id', mssql.VarChar, id)
        .input('title', mssql.VarChar, title)
        .input('description', mssql.VarChar, description)
        .input('due_date', mssql.VarChar, due_date)
        .input('assigned_to', mssql.VarChar, assigned_to)
        .execute('createTodo')

        try {
            let transporter = nodemailer.createTransport({port: 587, host: 'smtp.gmail.com', secure: false, requireTLS: true, auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASS}})

            await transporter.sendMail({
                from: process.env.EMAIL,
                to: assigned_to,
                subject: 'New Task Assigned',
                text: 'Task assignment',
                html: 
                `<p>Hello, </p>
                <p>You have been assigned a new task. Task details are as follows: </p>
                <p><span style="font-weight: bold;">Title: </span>${title}</p>
                <p><span style="font-weight: bold;">Description: </span>${description}</p>
                <p style="font-weight: bold;"><span>Due date: </span>${due_date}</p>`
            })

            res.json({message: 'Todo created and assigned successfully'})
        } catch (error) {
            res.json({Error: error})
        }
        
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
        const { title, description, due_date, assigned_to } = req.body as { title: string, description: string, due_date: string, assigned_to: string }
        
        const { error } = FormSchema.validate(req.body)
        if (error) {
            return res.json({Error: error.message})
        }

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
            .input('assigned_to', mssql.VarChar, assigned_to)
            .execute('updateTodo')

            if (todo.recordset[0].assigned_to !== assigned_to) {
                try {
                    let transporter = nodemailer.createTransport({port: 587, host: 'smtp.gmail.com', secure: false, requireTLS: true, auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASS}})
        
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: todo.recordset[0].assigned_to,
                        subject: 'Task Unassignment',
                        text: 'Task Reassignment',
                        html: 
                        `<p>Hello, </p>
                        <p>You have been unassigned the task: </p>
                        <p><span style="font-weight: bold;">Title: </span>${todo.recordset[0].title}</p>
                        <p><span style="font-weight: bold;">Description: </span>${todo.recordset[0].description}</p>`
                    })
                    
                    await transporter.sendMail({
                        from: process.env.EMAIL,
                        to: assigned_to,
                        subject: 'New Task Assigned',
                        text: 'Task assignment',
                        html: 
                        `<p>Hello, </p>
                        <p>You have been assigned a new task. Task details are as follows: </p>
                        <p><span style="font-weight: bold;">Title: </span>${title}</p>
                        <p><span style="font-weight: bold;">Description: </span>${description}</p>
                        <p style="font-weight: bold;"><span>Due date: </span>${due_date}</p>`
                    })
        
                    res.json({message: 'Todo updated and reassigned successfully'})
                } catch (error) {
                    res.json({Error: error})
                }
            } else {
                res.json({message: 'Todo updated successfully'})
            }
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
            
            try {                
                let assignedUser = await pool.request()
                .query(`SELECT assigned_to, title, completed_at FROM Todos Where id = '${id}'`)

                let email = assignedUser.recordset[0].assigned_to
                let title = assignedUser.recordset[0].title
                let completed_at = assignedUser.recordset[0].completed_at

                let transporter = nodemailer.createTransport({port: 587, host: 'smtp.gmail.com', secure: false, requireTLS: true, auth: {user: process.env.EMAIL, pass: process.env.EMAIL_PASS}})
    
                await transporter.sendMail({
                    from: email,
                    to: process.env.EMAIL,
                    subject: 'Task Completed',
                    text: 'Task Completed',
                    html: 
                    `<p>Hello, </p>
                    <p>The task with the title: ${title} assigned to ${email} has been completed successfully on ${new Date(completed_at)}</p>`
                })
    
                res.json({message: 'Todo completed successfully'})
            } catch (error) {
                res.json({Error: error})
            }

            // res.json({message: 'Task completed'})
        }
        
    } catch (error: any) {
        res.json({Error: error.message})
    }
}