
const Redis =                       require('ioredis')
const { g, b, gr, r, y } =          require('../console');

////////////////////////////////////////////////////////////////
////////////////// streaming server ///////////////////////////
///////////////////////////////////////////////////////////////

let redisport = process.env.REDISPORT;
let redishost = process.env.REDISHOST;
let redispassword = process.env.REDISPASSWORD;
let options = {
    port: redisport,
    host: redishost,
    password: redispassword,
    showFriendlyErrorStack: true,
    retryStrategy: function (times) {        
        let delay = Math.min(times * 10, 2000);        
        return delay
    },
    reconnectOnError: function (err) {        
        let targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true
        }
      }
    }

const pub = new Redis(options)
const sub = new Redis(options)

/////////////////////////////////////////////////////
/////////////////////redis events //////////////////
////////////////////////////////////////////////////    

exports.redisevents = () => {
    try {
        sub.subscribe('watch', function (err, count) {
            console.log(`Currently tracking ${count} channels`)
        });

        sub.on('error', function (err) {
            console.log('Redis error: ' + err);
        });      
        console.log(g(`Redis events registered`))
        return {pub, sub}
    }
    catch(error) {
        console.log(r('Error Connecting to Redis Labs'))
    }
}

// publishing channel

exports.publish = (channel, message) => {
    pub.publish(channel, message)
}
