require('dotenv').config();

///////////////////////////////////////////////////////////////
////////     Proxy Server - Mocking IOT Messages       ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const path =                  require('path');
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();
const log = (msg) => console.log(msg)
//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }));)

const isDev = (app.get('env') === 'development');
log(`Stream is currently running in ${isDev ? `development` : `production`}`);

//////////////////////////////////////////////////////////////////////////
////////////  Event Registration for server, streams and db      ////////
////////////////////////////////////////////////////////////////////////

const servers = require('../events').events(app)
const server = servers['server']
const io = servers['io']

///////////////////////////////////////////////////////////////////////
/////////////////// messaging alert for platform errors ///////////////
//////////////////////////////////////////////////////////////////////

const handleErr = (err) => {
  console.log('uncaught exception')
  console.log(err)
}

const mailObject = {
  from: process.env.TRANSPORT_LABEL,
  to: process.env.TRANSPORT_RECEIVER,
  subject: 'Platform Error',
  text: ''
}
process.on('uncaughtException', function (er) {
    console.log("uncaught exception")
    console.error(er.stack)
    mailObject.text = er.stack;
    transport.sendMail(mailObject, function (er) {
       if (er) console.error(er)
       process.exit(1)
    })
  })

 //////////////////////////////////////////////////////
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////
const config =              express.Router({mergeParams: true})
const trigger =             express.Router({mergeParams: true})
const respond =             express.Router()
const record =              express.Router()
const events =              express.Router()
const message =             express.Router()
const state =               express.Router()

require('../routes/config')(config)
require('../routes/trigger')(trigger)
require('../routes/respond')(respond)
require('../routes/record')(record)
require('../tests/events')(events)
require('../tests/message')(message)
//require('../tests/state')(state)

//////////////////////////////////////////////////////////////////////////
///////////////////////////// API CATALOGUE /////////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})


// log everything for reverse engineering
app.get('/about', (req, res, next) => {
  console.log(b(`-----About detected------`))
  res.send(`<h2>You've reached Strategic Machines</h2>`)
  next()
})
// process the network configuration
app.get('/config/webapp/:id', [config])

// process a trigger from a client's web site via sdk
//app.post('/trigger/webapp', [trigger])
app.post('/trigger/webapp', function(req, res, next){
  console.log(b(`-----Route detected------`))
  req.io = io
  next()
  }, trigger)

// process web message
app.post('/api/web', [respond, record])

///////////////////////////////////////////////
////       routes to conduct tests       /////
/////////////////////////////////////////////
app.use('/api/events', [events])

app.use('/api/message', [message])

// REFACTOR - set up a set of automated using ava and nyc
//app.use('/api/state', [state])

// start server
const port = process.env.RUN_PORT || 4000

server.listen(port, () => {
    console.log(`listening on port ${port}`) 
  })


