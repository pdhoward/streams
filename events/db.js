
const db =                      require('../db')
const { g, b, gr, r, y } =      require('../console');

/////////////////////////////////////////////////////
/////////////////////database events ////////////////
//////////////////////////////////////////////////// 

//const collection = db.collection(process.env.MONGO_TEST_COLLECTION);

exports.dbevents = () => {

    db.on('error', console.error.bind(console, 'Connection Error:'))

    db.once('open', () => {      
      console.log(g(`db connection is a success`))
    });

    console.log(g(`DB events registered`))
}
/*
    // note this needs to be repositioned to excute when redis message received 
    collection.insertOne({ channel: channel, message: message }, function (err) {
      assert.ifError(err);
    });
*/