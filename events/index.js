
const conn =                    require('../db')
const {redisevents} =           require('./redis')
const { g, b, gr, r, y } =      require('../console');

////////////////////////////////////////////////////////////////
////////////////  Register Events and Connect    //////////////
//////////////////////////////////////////////////////////////

const events = (app) => {
  return new Promise(async (resolve, reject) => {
    let server = require('http').Server(app);
    let db = await conn(process.env.ATLAS_STREAM)
    let {pub, redis} = await redisevents()
    resolve({server, db, pub, redis}) 
  })
  
}

module.exports = {
  events    
}