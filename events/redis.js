
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
const redis = new Redis(options)

/////////////////////////////////////////////////////
/////////////////////redis events //////////////////
////////////////////////////////////////////////////    

exports.redisevents = () => {
    return new Promise((resolve, reject)=> {
        try {
            redis.subscribe('watch', function (err, count) {
                console.log(`Currently tracking ${count} channels`)
            });

            redis.on('error', function (err) {
                console.log('Redis error: ' + err);
            });      
            console.log(g(`Redis events registered`))
            resolve({pub, redis})
        } catch(error) {
            reject(error)
        }
    })   
}

// publishing channel

exports.publish = (channel, message) => {
    pub.publish(channel, message)
}
