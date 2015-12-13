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

    // from server/imports.js
    //var matches0 = new Future();
    var matches1 = new Future();
    var matches2 = new Future();
    var matches3 = new Future();
    var matches4 = new Future();
    var matches5 = new Future();
    var matches6 = new Future();
    var matches7 = new Future();

/*
    HTTP.call('POST', 'http://127.0.0.1:6112', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches0.throw(error);
      } else {
        matches0.return(response.data.results);
      }
    });
*/

    HTTP.call('POST', 'http://127.0.0.1:6113', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches1.throw(error);
      } else {
        console.log("Received response from shard 1");
        matches1.return(response.data.results);
      }
    });

    HTTP.call('POST', 'http://127.0.0.1:6114', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches2.throw(error);
      } else {
        console.log("Received response from shard 2");
        matches2.return(response.data.results);
      }
    });

    HTTP.call('POST', 'http://127.0.0.1:6115', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches3.throw(error);
      } else {
        console.log("Received response from shard 3");
        matches3.return(response.data.results);
      }
    });

    HTTP.call('POST', 'http://127.0.0.1:6116', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches4.throw(error);
      } else {
        console.log("Received response from shard 4");
        matches4.return(response.data.results);
      }
    });

    HTTP.call('POST', 'http://127.0.0.1:6117', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches5.throw(error);
      } else {
        console.log("Received response from shard 5");
        matches5.return(response.data.results);
      }
    });

    HTTP.call('POST', 'http://127.0.0.1:6118', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches6.throw(error);
      } else {
        console.log("Received response from shard 6");
        matches6.return(response.data.results);
      }
    });

    HTTP.call('POST', 'http://127.0.0.1:6119', {
      data: {"val": params['term']}
    }, function (error, response) {
      if (error) {
        matches7.throw(error);
      } else {
        console.log("Received response from shard 7");
        matches7.return(response.data.results);
      }
    });

    //matches0.wait();
    matches1.wait();
    matches2.wait();
    matches3.wait();
    matches4.wait();
    matches5.wait();
    matches6.wait();
    matches7.wait();
    var results = [];
    //results = results.concat(matches0);
    results = results.concat(matches1.value);
    results = results.concat(matches2.value);
    results = results.concat(matches3.value);
    results = results.concat(matches4.value);
    results = results.concat(matches5.value);
    results = results.concat(matches6.value);
    results = results.concat(matches7.value);

    console.log("These are the results");
    console.log(results);

    var arg1 = { text: {$in: results} };
    console.log("Fetching the resulting texts from Mongo");
    return Texts.find(arg1, { limit: params.limit });
  });
}
