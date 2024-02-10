const mongoose = require('mongoose')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const Task = require('../../models/Task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id : userOneId ,
    name :'userone' ,
    email : 'userone@gmail.com' ,
    password : '123456',
    tokens :[
        {
            token : jwt.sign({ _id:userOneId } , process.env.JWT_TOKEN )
        }
    ]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id : userTwoId ,
    name :'usertwo' ,
    email : 'usertwo@gmail.com' ,
    password : '123456',
    tokens :[
        {
            token : jwt.sign({ _id:userTwoId } , process.env.JWT_TOKEN )
        }
    ]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    desc : 'first task',
    completed : false ,
    owner : userOne._id
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    desc : 'second task',
    completed : true ,
    owner : userOne._id
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    desc : 'third task',
    completed : true ,
    owner : userTwo._id
}

const setupDatabase = async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId ,
    userOne ,
    userTwoId,
    userTwo ,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}