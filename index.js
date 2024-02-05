const express = require('express')
const mongoose = require('mongoose');
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

const app = express()

app.use(express.json())

app.use('/users' , userRouter)
app.use('/tasks' , taskRouter)

mongoose.connect(process.env.MONGO_URL)
.then(console.log('db connection successful !'))
.catch((err)=>console.log('Error!',err))


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Backend server is running on port ${port}!`))


// const User = require('./models/User')
// const main = async()=>{
//     const user = await User.findById('65aecb2024723bca5f866051')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }
// main()