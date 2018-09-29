var express = require('express')
var bp = require('body-parser')
var server = express()
var cors = require('cors')
var port = 3000



var whitelist = ['http://localhost:8080'];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
server.use(cors(corsOptions))

//Fire up database connection
require('./db/db-config')


//REGISTER MIDDLEWEAR
server.use(bp.json())
server.use(bp.urlencoded({
  extended: true
}))

//REGISTER YOUR AUTH ROUTES BEFORE YOUR GATEKEEPER, OTHERWISE YOU WILL NEVER GET LOGGED IN
let auth = require('./server-assets/auth/routes')
server.use(auth.session)
server.use(auth.router)
// @ts-ignore



//Gate Keeper Must login to access any route below this code
server.use((req, res, next) => {
  if (!req.session.uid) {
    return res.status(401).send({
      error: 'please login to continue'
    })
  }
  next()
})

//YOUR ROUTES HERE!!!!!!
let userRoutes = require('./routes/user')
server.use('/api/user', userRoutes)
let taskRoutes = require('./routes/tasks')
server.use('/api/task', taskRoutes)






//Catch all
// @ts-ignore
server.get('*', (req, res, next) => {
  res.status(404).send({
    error: 'No matching routes'
  })
})

server.listen(port, () => {
  console.log('server running on port', port)
  //socket connected users
})