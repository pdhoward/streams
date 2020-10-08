
//////////////////////////////////////////////////////
////////   mongoDB connection manager         ///////
////////////////////////////////////////////////////

const MongoClient =             require('mongodb').MongoClient;
const Cache =                   require('lru-cache')
const { g, b, gr, r, y } =      require('../console');

const dbOptions = {
  	poolSize: 10, // Maintain up to x socket connections        
    useNewUrlParser: true,
    useUnifiedTopology: true }

const cacheOptions = {
    max: 500,
    length: function (n, key) { return n * 2 + key.length },
    dispose: function (key, n) {
      console.log(`${key} connection closed`)
      n.close() }, // auto close based on max age
    maxAge: 1000 * 60 * 10,
    updateAgeOnGet: true
}

const cache = new Cache(cacheOptions)

const log = console

module.exports = (url) => {

  return new Promise(async (resolve, reject) => {
        
      const api = url;  // dbname is embedded in Atlas url
      let conn;

      // retrieve db server connection
      conn = await cache.get(api)  

      // if connection is in cache, will reuse it, otherwise create it
      if (typeof conn === 'undefined' || typeof conn === null) {
          log.info('creating new connection for ' + api);
          const conn = new MongoClient(api, dbOptions);
          conn.once('open', () => {      
            log.info(g(`MongoDB server connection live`))
            });
          conn.connect(async(err) => {
            if (err) reject(err)           
            await cache.set(api, conn) 
            // create db connection and return 
            let db = conn.db()          
            resolve(db)                   
            });        
      }
      else {
          log.info('Reusing existing MongoDB connection')
          // create db connection and return
          let db = conn.db()
          resolve(db)         
      }
 })
}
