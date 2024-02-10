const router = require("express").Router();
const User = require("../models/User");
const Task = require("../models/Task");
const {auth} = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account')

router.post("/register", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const user = await newUser.save();
    sendWelcomeEmail(user.email , user.name)
    const token = await user.generateAuthToken()

    res.status(201).send({ user,token }); // (201) create
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login',async(req,res)=>{
  try{
    const user = await User.findByCredentials(req.body.email , req.body.password)
    const token = await user.generateAuthToken()
    
    res.send({ user, token });
  }catch(err){
    res.status(400).send(err);
  }
})

router.post('/logout' , auth , async (req,res)=>{
  try{
    req.user.tokens = req.user.tokens.filter((token)=>{
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  }catch(err){
    res.status(500).send(err);
  }
})

router.post('/logoutAll' , auth , async(req,res)=>{
  try{
    req.user.tokens = []
    await req.user.save()
    res.send()
  }catch(err){
    res.status(500).send(err)
  }
})

router.get("/profile",auth, async (req, res) => {  // auth-> second argument
  res.send(req.user)
})

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// update procces that uses variables with dynamic method 
router.patch("/profile", auth , async (req, res) => {
  const updates = Object.keys(req.body); // array of strings  
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => // if all elements true >every return true , if have single false > every return false 
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    updates.forEach((update)=> req.user[update] = req.body[update])
//bracket notaion[] => to access a property dynamically
//user.password = req.body.password  ( property static)

    await req.user.save()
    res.send(req.user);
  } catch (err) {
    res.status(400).send(err)
  }
});

// update procces that uses variables with static method 
router.patch("/static/profile", auth , async (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body .password
    const age = req.body.age
  try{
      req.user.name = name ;
      req.user.email = email ;
      req.user.password = password ;
      req.user.age = age ;
      
      await req.user.save()

    res.send(req.user)
  }catch(err){
    res.status(400).send(err)
  }
})


router.delete('/profile', auth , async(req,res)=>{
  try{
    await req.user.deleteOne();
    sendCancelationEmail(req.user.email , req.user.name)
    res.send(req.user)
  }catch(err){
    res.status(500).send(err)
  }
})

const upload = multer({   // upload -> work as instance
  limits:{
    fileSize:1000000  //1,000,000 bytes which is equivalent to 1 megabyte
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('pleace upload an image'))
    }
    cb(null , true)
  }
})
router.post('/profile/avater' , auth , upload.single('avater') , async(req,res)=>{
  const buffer = await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
  req.user.avater = buffer;
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
}
)

router.delete('/profile/avater' , auth ,async (req,res)=>{
  req.user.avater = undefined;
  await req.user.save()
  res.send()
  })

  router.get('/:id/avater' , async (req,res)=>{
    try{
      const user = await User.findById(req.params.id)
      if(!user || !user.avater){
        throw new Error()
      }
        res.set('Content-Type' , 'image/png')
        res.send(user.avater)
    }catch(err){
      res.status(404).send()
    }
  })

module.exports = router;
