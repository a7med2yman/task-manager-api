const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL)
.then(console.log('db connection successful !'))
.catch((err)=>console.log('Error!',err))

module.exports = mongoose