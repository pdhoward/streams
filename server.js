

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

app.use(express.static(path.resolve(__dirname, 'public')));

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

redis.subscribe('news', 'music', 'watch', function (err, count) {
    // Now we are subscribed to both the 'news' and 'music' channels.
    // `count` represents the number of channels we are currently subscribed to.
    let msg = {}
    msg.From = '+17042221234'
    msg.Channel = "GeoFence"
    msg.Body = 'Hello World!'

    pub.publish('news', JSON.stringify(msg))
    msg.Body = 'Life is very good!'
    pub.publish('music', JSON.stringify(msg))
});

redis.on('message', function (channel, message) {
    // Receive message Hello world! from channel news
    // Receive message Hello again! from channel music
    console.log('Receive message %s from channel %s', message, channel);
    io.emit('chat message', message)
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
