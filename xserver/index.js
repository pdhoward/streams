require('dotenv').config();

///////////////////////////////////////////////////////////////
////////     Proxy Server - Mocking IOT Messages       ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const util =                  require('util')
const path =                  require('path');
const {events} =              require('../events')
const {publish} =             require('../events/redis')
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
const createServers = () => {
  return new Promise(async (resolve, reject) => {
    const servers = await events(app)
    resolve(servers)
  })  
  
}

const startBroadcasts = async() => {
  const servers = await createServers()
  
  const server = servers['server']
  const pub = servers['pub']  
  const redis = servers['redis']
  const db = servers['db']
  // start server
  const port = process.env.RUN_PORT || 4000

  // supports promise as well as other commands
  redis.monitor().then(function (monitor) {
      monitor.on('monitor', function (time, args, source, database) {
        console.log(time + ": " + util.inspect(args));
      });
    });
  
  redis.on('message', function (channel, msg) {
      
    msgObj = JSON.parse(msg)
    message = msgObj.Body
    console.log(`Received ${ message } from ${ channel }`);    

    switch (msgObj.Context) {
      case 'Bookstore':
      case 'Device':
      case 'Bank':
      case 'GeoFence':          
        console.log(`------------This finally fired----------------`)
        break;
      default:
        console.log(`------No context detected-----`)          

    }

  });
  let msg = {}
  msg.From = '+17042221234'
  msg.Context = "GeoFence"
 
  msg.Body = `Displays all Messages on Port ${port}` 
  pub.publish('watch', JSON.stringify(msg))

  msg.Body = `----Is this really working----` 
  pub.publish('watch', JSON.stringify(msg))
 

  server.listen(port, () => {
    console.log(`listening on port ${port}`) 
  })
}

startBroadcasts()
// let testmsg = 'Tests Started'
// require('../test')(testmsg)










