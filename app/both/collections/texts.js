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
    /*  Note: if you're behind a reverse proxy, this will return the address of
     *  your proxy. To solve this, set the environment variable
     *  HTTP_FORWARDED_COUNT before launching meteor. E.g.,
     *     export HTTP_FORWARDED_COUNT=1
     *     meteor
     *  Cf. https://github.com/mizzao/meteor-user-status/issues/48
     */
    console.log('Got a request for ' + params['term'] + ' from ' + this.connection.clientAddress);

    // See server/invertedIndex.js
    var docIdList,
      mongoQuery;
    try {
      var query = regexTrigram.query(regexTrigram.parse(params['term']));
      docIdList = processQuery(query);
      mongoQuery = {
        _custom_id: {$in: docIdList},
        text: new RegExp(params['term'])
      };
    } catch (e) {
      console.log("Error processing query for term", "\"" + params["term"] + "\"", "\n Error object:", e.stack);
      console.log("Falling back to normal regular expression query over the entire corpus.");
      mongoQuery = {
        text: new RegExp(params['term'])
      };
    }

    var coll = Texts.find(mongoQuery, { limit: params.limit });
    if (mongoQuery["_custom_id"]) {
      var coll2 = Texts.find({text: mongoQuery['text']}, {limit: params.limit });
      if (coll.count() === coll2.count()) {
        console.log("Collections match in size!");
      } else {
        console.log("Collections don't match in size--coll has", coll.count(), "while coll2 has", coll2.count());
      }
    }
    return coll;
  });
}