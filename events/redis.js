require('dotenv').config()
const Redis =                       require('ioredis')
const { g, b, gr, r, y } =          require('../console');

////////////////////////////////////////////////////////////////
////////////////// streaming server ///////////////////////////
///////////////////////////////////////////////////////////////

let redisport = process.env.REDISPORT;
let redishost = process.env.REDISHOST;
let redispassword = process.env.REDISPASSWORD;

const redis = new Redis({
    port: redisport,
    host: redishost,
    password: redispassword,
    showFriendlyErrorStack: true,
    retryStrategy: function (times) {
        //console.log("RETRY STRATEGY INVOKED")
        //console.log(times)
        var delay = Math.min(times * 50, 2000);
        //console.log(delay)
        return delay
    },
    reconnectOnError: function (err) {
        console.log("CONNECTION ERROR")
        var targetError = 'READONLY';
        if (err.message.slice(0, targetError.length) === targetError) {
            // Only reconnect when the error starts with "READONLY"
            return true
        }
    }
});

var pub = new Redis({
    port: redisport,
    host: redishost,
    password: redispassword
})

/////////////////////////////////////////////////////
/////////////////////redis events //////////////////
////////////////////////////////////////////////////    

exports.redisevents = () => {
    try {
        //redis.subscribe('monitor', function (err, count) {
        //    console.log(`Currently tracking ${count} channels`)
        //});

        //redis.on('error', function (err) {
            //console.log('Redis error: ' + err);
        //});

        redis.on('message', function (channel, msg) {
            msgObj = JSON.parse(msg)
            message = msgObj.Body
            console.log(gr(`Message from the ${channel} channel`))
            console.log(gr(`${message}`))
        });
        console.log(g(`Redis events registered`))
    }
    catch(error) {
        console.log(r('Error Connecting to Redis Labs'))
    }
}

// publishing channel

exports.publish = (channel, message) => {
    pub.publish(channel, message);
}
