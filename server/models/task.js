let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId
let schemaName = 'Task'

let schema = new Schema({
  name: { type: String, required: true },
  //every email must be unique on the database
  user: { type: String, required: true },
  completed: { type: Boolean, default: false }
})

module.exports = mongoose.model(schemaName, schema)