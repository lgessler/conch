// Texts is a collection that represents a mapping from strings to bundles of
// metadata that describe each known occurrence of it. For now, metadata includes
// the following:
//
//       url: a URL pointing to the text's occurrence, or null
//      date: the date the URL was crawled, or null
//    corpus: the corpus of origin, or null
//
// Every entry in the Texts collection has a field "text" for the string, and
// a field "metadata" for a key-value store of each of the metadata fields.
//
// To populate this, use the python script outside the app folder.
Texts = new Meteor.Collection("texts");

// Collection Helpers https://github.com/dburles/meteor-collection-helpers
// Collection Hooks https://github.com/matb33/meteor-collection-hooks

if (Meteor.isServer) {
  // Basic idea: check for duplicates by hashing and checking for a collision.
  // http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array

  Meteor.publish('texts', function(params) {
    console.log(params);

    // from server/imports.js
    var matches = new Future();
    HTTP.call('POST', 'http://127.0.0.1:6767', {
      data: { "val": params['term'] }
    }, function (error, response) {
      if (error) {
        matches.throw(error);
      } else {
        matches.return(response['data']['results']);
      }
    });
    matches.wait();
    matches = matches['value'];
    console.log(matches);

   /*  Note: if you're behind a reverse proxy, this will return the address of
    *  your proxy. To solve this, set the environment variable
    *  HTTP_FORWARDED_COUNT before launching meteor. E.g.,
    *     export HTTP_FORWARDED_COUNT=1
    *     meteor
    *  Cf. https://github.com/mizzao/meteor-user-status/issues/48
    */
    console.log('This request came from ' + this.connection.clientAddress); 

    var arg1 = { text: {$in: matches} };
    var coll = Texts.find(arg1, { limit: params.limit }); 
    return coll;
  });
}