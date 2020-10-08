require('dotenv').config();

///////////////////////////////////////////////////////////////
////////     Proxy Server - Mocking IOT Messages       ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const util =                  require('util')
const { v4: uuidv4 } =        require('uuid');
const {events} =              require('../events')
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();
const PORT = process.env.RUN_PORT || 4000

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
  const pub = servers['pub']  
  const redis = servers['redis']
  const db = servers['db']
  
  // supports promise as well as other commands
  redis.monitor().then(function (monitor) {
      monitor.on('monitor', function (time, args, source, database) {
        console.log(time + ": " + util.inspect(args));
      });
    });

  redis.subscribe('device', function (err, count) {
      console.log(`Currently tracking ${count} channels`)
  });

  redis.on('message', function (channel, msg) {        
    let msgObj = JSON.parse(msg)
    switch (msgObj.Context) {     
      case 'GeoFence':          
        console.log(`Channel: ${ channel } Message: ${msg}`);
        db.collection('signals').insertOne(msgObj)
        break;
      default:
        console.log(`------No context detected-----`)    
    }
  });

  setInterval(() => {
    let msg = {}
    msg.UUID = uuidv4()
    msg.Context = "GeoFence" 
    msg.Timestamp = Date.now()
    msg.Body = `Discounts today only`
    pub.publish('device', JSON.stringify(msg))
  }, 1000)
  
}

startBroadcasts()
// let testmsg = 'Tests Started'
// require('../test')(testmsg)

app.listen(PORT, () => {
  console.log(g(`Server listening on port ${PORT}`)) 
})










