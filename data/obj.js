

const uuidv1 = require('uuid/v1')

exports.obj = {
  MessageSid: uuidv1(),
  SmsSid:uuidv1(),
  AccountSid: uuidv1(),
  MessagingServiceSid: uuidv1(),
  From: user,
  To: platform,
  Body: "",
  NumMedia: "",
  NumSegments: "",
  MediaContentType: " ",
  MediaUrl: " ",
  FromCity:"Charlotte",
  FromState: "NC",
  FromZip: "28222",
  FromCounty: "USA",
  SmsStatus: "",
  ToCity: "Charlotte",
  ToState: "NC",
  ToZip: "28222",
  ToCountry: "USA",
  AddOns: " ",
  ApiVersion: "v1",
  PostDate: Date.now(),
  ChaoticSid: uuidv1(),
  ChaoticSource: "web",
  Token: undefined
}