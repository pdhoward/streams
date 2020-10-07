require('dotenv').config();

///////////////////////////////////////////////////////////////
////////     Proxy Server - Mocking IOT Messages       ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const path =                  require('path');
const {getservers} =          require('../controller')
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();
const log = (msg) => console.log(msg)
//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const isDev = (app.get('env') === 'development');
log(`Stream is currently running in ${isDev ? `development` : `production`}`);

//////////////////////////////////////////////////////////////////////////
////////////  Event Registration for server, streams and db      ////////
////////////////////////////////////////////////////////////////////////

const servers = getservers(app)
const server = servers['server']
// const pub = servers['pub']

// let testmsg = 'Tests Started'
// require('../test')(testmsg)

// let msg = {}
// msg.From = '+17042221234'
// msg.Context = "GeoFence"
// msg.Body = 'Stream Server Connected'

// pub.publish('monitor', JSON.stringify(msg))
// msg.Body = `Displays all Messages on Port ${port}`
// pub.publish('monitor', JSON.stringify(msg))

// start server
const port = process.env.RUN_PORT || 4000

server.listen(port, () => {
    console.log(`listening on port ${port}`) 
  })


