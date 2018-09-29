let router = require('express').Router()
let Users = require('../models/user')

router.put('/city', (req, res) => {
  Users.findById(req.body.userId)
    .then((user) => {
      user.city = req.body.city
      user.save()
      res.send(user)
    })
})

router.get('/', (req, res, next) => {
  // @ts-ignore
  Users.find({ _id: req.session.uid })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

module.exports = router 