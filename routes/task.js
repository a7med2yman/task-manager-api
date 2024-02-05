const router = require("express").Router();
const Task = require("../models/Task");
const {auth} = require('../middleware/auth')

router.post("/add", auth , async (req, res) => {
  const task = new Task({
    ...req.body ,
    owner : req.user._id
  });
  try {
    await task.save();
    res.status(201).send(task); // (201) create
  } catch (err) {
    res.status(400).send(err);
  }
});
//GET /tasks?comleted=true
//GET /tasks?limit=10&skip=20   -> third page
//GET  /tasks?sortBy=createdAt:desc
router.get("/", auth ,async (req, res) => {
  match = {}
  sort = {}
  if(req.query.completed){
    match.completed = req.query.completed === 'true'  // Boolean
  }
  if(req.query.sortBy){
    const parts = req.query.sortBy.split(":")
    sort[parts[0]] = parts[1] === 'desc'? -1 : 1 
  }

  try {
    await req.user.populate({
      path:'tasks',
      match ,
      options:{
        limit : parseInt(req.query.limit),
        skip :  parseInt(req.query.skip),
        sort
      }
    })                           
    res.send(req.user.tasks);   
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", auth , async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id , owner:req.user._id })
    if (!task){
      return res.status(404).send();
    } 
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/:id", auth , async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["desc", "completed"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const task = await Task.findOne({_id:req.params.id , owner: req.user._id})
    
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update)=>task[update]=req.body[update])

    await task.save()
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/:id', auth , async(req,res)=>{
  try{
    const task = await Task.findOneAndDelete({_id: req.params.id , owner:req.user._id})
    if (!task) {
      return res.status(404).send();
    } 
    res.send(task)
  }catch(err){
    res.status(400).send(err)
    console.log(err)
  }
})


module.exports = router;
