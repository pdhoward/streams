
const {dbevents} =              require('./db')
const {redisevents} =           require('./redis')
const { g, b, gr, r, y } =      require('../console');

////////////////////////////////////////////////////////////////
////////////////Register Events and Start Server //////////////
//////////////////////////////////////////////////////////////

const events = (app) => {
  return new Promise((resolve, reject) => {
    let server = require('http').Server(app);
    let db = dbevents()
    let {pub, sub} = redisevents()
    resolve({server, db, pub, sub}) 
  })
  
}

module.exports = {
  events    
}