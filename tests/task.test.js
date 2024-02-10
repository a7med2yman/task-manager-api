const request = require('supertest')
const app = require('../app')
const Task = require('../models/Task')
const {
    userOneId ,
    userOne ,
    userTwo , 
    taskOne , 
    setupDatabase 
} = require('./fixtures/db')

beforeEach (setupDatabase)

test('should create task for user ' , async()=>{
    const response = await request(app)
        .post('/tasks/add')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            desc : 'from my test'
        })
        .expect(201)
    // Assert task is saved in database
        const task = await Task.findById(response.body._id)
        expect(task).not.toBeNull()
    // assert that completed property is false
        expect(task.completed).toEqual(false)   // toBe -> you can use it
})

test('Should fetch userOne tasks', async ()=>{
    const response = await request(app)
        .get('/tasks')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    // check the length of the response array is 2
        expect(response.body.length).toEqual(2)
})

test('Should not delete other users tasks' , async ()=>{
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization' , `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    // assert that task is still in database ,will not deleted
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})