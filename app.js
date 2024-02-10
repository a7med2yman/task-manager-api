const express = require('express')
require('./db/mongoose')
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const app = express()

app.use(express.json())

app.use('/users' , userRouter)
app.use('/tasks' , taskRouter)

module.exports = app