

////////////////////////////////////////////////////
////////  			HTTP SERVER     		 ///////
///////            version 0.5.0            ///////
//////////////////////////////////////////////////
require('dotenv').config()
var express =   require('express');
var http =      require('http');
var path =      require('path');
const Redis =   require('ioredis')

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
/*
// ===============================
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Force Socket.io to ONLY use "websockets"; No Long Polling.
io.set('transports', ['websocket']);

// using redislabs 
// subscribe and listen and emit
redis.subscribe('newMessage', function (err, count) {
    console.log("Subscribed to " + count + " channel")
});

  redis.on('message', function (channel, message) {
       console.log('Received  ' + channel + ' message: ' + message);
     });


// Allow sockets to access session data
io.use((socket, next) => {
    require('../session')(socket.request, {}, next);
});

// Define all Events
ioEvents(io);

// The server object will be then used to listen to a port number
return server;

// =======================================================
*/
var app = express();
var server = new http.Server(app);
var io = require('socket.io')(server);
var port = 3000;
var htmlFile = path.resolve(__dirname, './index.html');

// Force Socket.io to ONLY use "websockets"; No Long Polling.
//io.set('transports', ['websocket']);

app.use(express.static(path.resolve(__dirname, 'public')));

const ioEvents = (io) => {
    io.on('connection', (socket) => {

        console.log('io socket connection')

        socket.on('newMessage', (message) => {
            console.log('new message received from socket')
            console.log(message)
        })
        socket.on('chat message', (message) => {
            console.log('chat message received from socket')
            console.log(message)
            io.emit('chat message', 'happening')
            pub.publish('chat', message);            
        })
        socket.on('disconnect', () => {
            console.log('disconnnect from socket')
        })        

    })
}

function onError(err) {
    console.log(err);
}

// This is an experimental function that shows the use of prototypes and scope (this)
function tryit() {
    "use strict";

    function Product(id, name, price, quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    Product.prototype = {
        add : function (count) {
            this.quantity += count === 0 || count ? count : 1;
        },

        remove : function (count) {
            this.quantity -= count === 0 || count ? count : 1;
        },

        setPrice : function (value) {
            this.price = value;
        },

        toString : function () {
            return this.name;
        }
    };

    function Inventory() {
        this.items = Array.prototype.slice.call(arguments);
    }

    Inventory.prototype = {
        add : function (item) {
            this.items.push(item);
        },

        remove : function (item) {
            var index = this.items.indexOf(item);

            if (index > -1) {
                this.items.splice(index, 1);
            }
        },

        getTotalPrice : function () {
            var sum = this.items.reduce(function (previousValue, currentValue, index, array) {
				console.log('prev ' + previousValue)
				console.log('cur ' + currentValue)
				console.log('index ' + index)
				console.log('array ' + array)
                return previousValue + currentValue.price * currentValue.quantity;
            }, 0);

            return sum;
        }
    };

    var peaches = new Product(0, "peaches", 5, 5000),
        carrots = new Product(1, "carrots", 2, 10000),
        bananas = new Product(2, "bananas", 6, 3000),
        inventory = new Inventory(peaches, carrots, bananas);

    return inventory.getTotalPrice();
	
	
};
let obj = {}
let obj2 = {
		message: "hi",
		test: []
		}
obj = JSON.parse(JSON.stringify(obj2))
obj.test.push("hi")
console.log("-----------------------test----------------")
console.log(obj2)

redis.subscribe('news', 'music', 'watch', function (err, count) {
    // Now we are subscribed to both the 'news' and 'music' channels.
    // `count` represents the number of channels we are currently subscribed to.

    pub.publish('news', 'Hello world!');
    pub.publish('music', 'Hello again!');
});

redis.on('message', function (channel, message) {
    // Receive message Hello world! from channel news
    // Receive message Hello again! from channel music
    console.log('Receive message %s from channel %s', message, channel);
    io.emit('chat message', message)
});
/*
setInterval(function(){
  io.emit('time', new Date);
  console.log("emitting date " + new Date)
	}, 25000);
*/
app.get('/', function(req, res) {
		//console.log(tryit());
		res.sendFile(htmlFile)
        });
        
ioEvents(io)

server.listen(port);    

console.log("running on port " + port);
