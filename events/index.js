
const {dbevents} =              require('./db')
const {redisevents} =           require('./redis')
const { g, b, gr, r, y } =      require('../console');

////////////////////////////////////////////////////////////////
////////////////Register Events and Start Server //////////////
//////////////////////////////////////////////////////////////

const events = (app) => {
  let server = require('http').Server(app);
  dbevents()
  redisevents()
  return {server}
}

module.exports = {
  events    
}