// Fields:
//   text:    UTF-8 Hindi text, usually a sentence, rarely up to five sentences.
//   type:    the type of the text
//   corpus:  corpus of origin
// To populate this, use the python script outside the app folder.
Texts = new Meteor.Collection("texts");

// Collection Helpers https://github.com/dburles/meteor-collection-helpers
// Collection Hooks https://github.com/matb33/meteor-collection-hooks

if (Meteor.isServer) {
  // Basic idea: check for duplicates by hashing and checking for a collision.
  // http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array

  Meteor.publish('texts', function(params) {
    console.log(params);

    // Note: if you're behind a reverse proxy, this will return the address of
    // your proxy. To solve this, set the environment variable
    // HTTP_FORWARDED_COUNT before launching meteor. E.g.,
    //     export HTTP_FORWARDED_COUNT=1
    //     meteor
    // Cf. https://github.com/mizzao/meteor-user-status/issues/48
    console.log('This request came from ' + this.connection.clientAddress); 

    var arg1 = { text: new RegExp(params.term) };
    var coll = Texts.find(arg1, { limit: params.limit }); 
    return coll;
  });
}
