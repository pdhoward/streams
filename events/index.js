
const conn =                    require('../db')
const {redisevents} =           require('./redis')

////////////////////////////////////////////////////////////////
////////////////  Register Events and Connect    //////////////
//////////////////////////////////////////////////////////////

const events = (app) => {
  return new Promise(async (resolve, reject) => {   
    let db = await conn(process.env.ATLAS_STREAM)
    let {pub, redis} = await redisevents()
    resolve({db, pub, redis}) 
  })  
}

module.exports = {
  events    
}