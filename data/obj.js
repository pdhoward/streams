

const uuidv1 = require('uuid/v1')

// 10 digit identifier for Machine platform
// platform handles all incoming messages
const platform = "+19148195104"

const user = null;

exports.obj = {
  MessageId: uuidv1(),   
  From: user,
  To: platform,
  Body: "",  
  FromCity:"Charlotte",
  FromState: "NC",
  FromZip: "28222",
  FromCounty: "USA",  
  ToCity: "Charlotte",
  ToState: "NC",
  ToZip: "28222",
  ToCountry: "USA",  
  ApiVersion: "v1",
  PostDate: Date.now(),  
  ChaoticSource: "web",
  Token: undefined
}