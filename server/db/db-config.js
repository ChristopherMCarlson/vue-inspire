let mongoose = require('mongoose')
const connectionString = 'mongodb://student:student1@ds259912.mlab.com:59912/vue-inspire'
let connection = mongoose.connection

console.log("one", connectionString)

mongoose.connect(connectionString, { useNewUrlParser: true })
console.log("past here")

connection.on('error', err => {
  console.log("DATABASE ERROR: ", err)
})

connection.once('open', () => {
  console.log("Connected to Database")
})