const request = require('supertest')
const app = require('../app')
const User = require('../models/User')
const {userOneId , userOne , setupDatabase } = require('./fixtures/db')


beforeEach (setupDatabase)

test('should create new user' , async ()=>{
    const response = await request(app).post('/users/register').send({
        name : 'test',
        email : 'test@gmail.com',
        password : 'AAhhmmeed !'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response body (every property we want)
    expect(response.body).toMatchObject({
        user : {
            name : 'test' ,
            email : 'test@gmail.com' ,
        },
        token : user.tokens[0].token
    })
    expect(user.password).not.toBe('AAhhmmeed !')
})

test('should login existing user ' , async ()=>{
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password : userOne.password
    }).expect(200)

    // validate new token is saved
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login non existent user' , async ()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password : 'wrongPass'
    }).expect(400)
})

test('should get profile for user' , async ()=>{
    await request(app)
        .get('/users/profile')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}` )
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async ()=>{
    await request(app).get('/users/profile')
    .send()
    .expect(401)
})

test('should delete account for user' , async ()=>{
    await request(app)
        .delete('/users/profile')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // validate user is removed
        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('should not delete account for unauthenticated user' , async ()=>{
    await request(app)
        .delete('/users/profile')
        .send()
        .expect(401)
})

test('should uploade avater image' , async ()=>{
    await request(app)
        .post('/users/profile/avater')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .attach('avater','tests/fixtures/avatar-profile.jpg')
        .expect(200)

        //check the data stored on user by property of object
        const user = await User.findById(userOneId)
        expect(user.avater).toEqual(expect.any(Buffer))
})

test('should update valid user fields' , async ()=>{
    await request(app)
        .patch('/users/profile')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            name : 'user updated'
        })
        .expect(200)

    // validate new name is changed
        const user = await User.findById(userOneId)
        expect(user.name).toEqual('user updated')

})

test('should not upadte invalid user fields' , async ()=>{
    await request(app)
        .patch('/users/profile')
        .set('Authorization' , `Bearer ${userOne.tokens[0].token}`)
        .send({
            location : 'egypt'
        })
        .expect(400)
})