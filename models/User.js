const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const Task = require('./Task')

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required : true, 
        trim : true // triming space before or after
    },
    email :{
        type: String,
        required : true,
        unique: true,
        trim : true,
        lowercase : true ,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    age : {
        type : Number,
        default : 0 ,
        validate(value){   // value is considered as argument
            if(value<0){
                throw new Error('age must be a positive number')
            }
        }
    },
    password : {
        type : String ,
        required : true ,
        minlength : [6, 'Too few letters'] , //min with Number but minlength with String
        trim : true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cannot contain"password"')
            }
        }
        },
    tokens :[{
        token:{
            type : String , 
            require: true
        }
    }],
    avater : {
        type : Buffer ,
        default :''
    }
},{
    timestamps:true
})
// virtual property -> realtionship
userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

//Hiding private data   
userSchema.methods.toJSON = function(){
    const user = this ;
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avater

    return userObject
}

//generate access token
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = JWT.sign({_id : user.id.toString() } , process.env.JWT_TOKEN , {expiresIn : '7d'})
    user.tokens = user.tokens.concat({token : token})
    await user.save()
    return token
}

// log in
userSchema.statics.findByCredentials = async (email , password)=>{
    const user = await User.findOne({email})
    
    if(!user){
        throw new Error('unable to login') // stop execute function
    }

    const isMatch = await bcrypt.compare(password , user.password)

    if(!isMatch){
        throw new Error('unable to login') // stop execute function
    }
    
    return user;
}

// Hash password before saving
userSchema.pre('save' , async function(next){
    const user = this; // "this" refers to the document that being save ( "user.save()" that will be save)
    if(user.isModified('password')){ // in case user modify on field ('password')
        user.password = await bcrypt.hash(user.password , 8) // 8=> salt round
    }
    next() //next()  just say when the function is over
})

// delete user tasks before user is deleted
userSchema.pre('deleteOne', { document: true } , async function(next){
    try{
        const user = this;
        await Task.deleteMany({ owner: user._id })
        next()
    }catch(err){
        console.err('error' , err)
    }
})


const User = mongoose.model('User' , userSchema)
module.exports = User ;