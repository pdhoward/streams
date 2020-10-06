
const conn =                    require('../db')
const { g, b, gr, r, y } =      require('../console');

/////////////////////////////////////////////////////
/////////////////////database events ////////////////
//////////////////////////////////////////////////// 

exports.dbevents = async () => {
    const db = await conn(process.env.ATLAS_STREAM)
    db.on('error', console.error.bind(console, 'Connection Error:'))

    db.once('open', () => {      
      console.log(g(`db connection is a success`))
    });

    console.log(g(`DB events registered`))
}
