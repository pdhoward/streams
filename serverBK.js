

////////////////////////////////////////////////////
////////  			HTTP SERVER     		 ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////
require('dotenv').config()
const express =             require('express');
const http =                require('http');
const path =                require('path');
const Redis =               require('ioredis')
const reqIP =               require('request-ip')
const ipRegex =             require('ip-regex')
const obj =                 require('./data/obj')

const app = express();
const server = new http.Server(app);
const io = require('socket.io')(server);
const port = 3000;
const htmlFile = path.resolve(__dirname, './index.html');

app.use(express.static(path.resolve('public')));

let redisport = process.env.REDISPORT;
let redishost = process.env.REDISHOST;
let redispassword = process.env.REDISPASSWORD;

var redis = new Redis({
    port: redisport,
    host: redishost,
    password: redispassword

});
var pub = new Redis({
    port: redisport,
    host: redishost,
    password: redispassword
})

let extractIP

// Force Socket.io to ONLY use "websockets"; No Long Polling.
//io.set('transports', ['websocket']);

const ioEvents = (io) => {
    io.on('connection', (socket) => {

        console.log('io socket connection')
        
        socket.on('chat message', (message) => {
            console.log('chat message received from socket')
            console.log(message)
            io.emit('chat message', 'Got your message')
            obj.From = extractIP
            obj.Body = message
            pub.publish('chat', JSON.stringify(obj));            
        })
        socket.on('disconnect', () => {
            console.log('disconnnect from socket')
        })

        //console.log('-----SOCKET ADDRESS--------')
        //var ip = socket.handshake.headers;
        //console.log(ip)

    })
}

function onError(err) {
    console.log(err);
}

redis.subscribe('watch', function (err, count) {
    // Now we are subscribed to watch channel -- listening for machine messages.
    // `count` represents the number of channels we are currently subscribed to.
    let msg = {}
    msg.From = '+17042221234'
    msg.Context = "GeoFence"
    msg.Body = 'Stream Server Connected'

    pub.publish('monitor', JSON.stringify(msg))
    msg.Body = `Displays all Messages on Port ${port}`
    pub.publish('monitor', JSON.stringify(msg))
});

redis.on('message', function (channel, msg) {
    
     msgObj = JSON.parse(msg)
     message = msgObj.Body
     console.log(`Received ${ message } from ${ channel }`);    

      switch (msgObj.Context) {
        case 'Bookstore':
        case 'Voting Booth':
        case 'Bank':
        case 'GeoFence':          
          io.emit('chat message', msg)
          break;
        default:
          console.log(`No context detected`)          

      }

});

app.get('/', function(req, res) {
        //console.log(tryit());
        console.log("IP ADDRESSES ---- ")
        console.log(req.connection.remoteAddress)      
        const clientIp = reqIP.getClientIp(req);
        console.log('-------------')
        console.log(clientIp)        
        console.log("IPV4 Mapped Addr")
        console.log(ipRegex().test(clientIp))
        extractIP = clientIp.match(ipRegex())
        console.log(extractIP)

		res.sendFile(htmlFile)
        });

ioEvents(io)

server.listen(port);    

console.log("running on port " + port);