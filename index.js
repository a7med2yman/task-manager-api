const app = require('./app')
require('./db/mongoose')

const port = process.env.PORT || 3000
app.listen(port, () =>
console.log(`Backend server is running on port ${port}!`))
