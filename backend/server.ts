import express from 'express'
import cors from 'cors'
import router from './Routes/todo.routes'
const app = express()
app.use(cors())
app.use(express.json())
app.use('/todo', router)


const PORT = 7000

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`)    
})