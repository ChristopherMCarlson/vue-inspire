let router = require('express').Router()
let Tasks = require('../models/task')

router.post('/createTask', (req, res, next) => {
  Tasks.create(req.body)
    .then(newTask => {
      console.log("Task Created!")
      res.send(newTask)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

router.get('/:userId', (req, res, next) => {
  Tasks.find({ user: req.params.userId })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

router.put('/update/:taskId', (req, res, next) => {
  Tasks.findByIdAndUpdate(req.params.taskId, req.body)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(400).send(err)
    })
})

router.delete('/delete/:taskId', (req, res, next) => {
  Tasks.deleteOne({ _id: req.params.taskId })
    .then(data => {
      res.send(data)
      console.log("Task deleted!")
    })
    .catch(err => {
      res.send(400).send(err)
    })
})


module.exports = router 