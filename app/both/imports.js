// This is for handling HTTP requests in texts.js
//Future = Npm.require('fibers/future');

if (Meteor.isServer) {
  regexTrigram = Meteor.npmRequire('regex-trigram');
  console.log("regex-trigram imported.");
}
