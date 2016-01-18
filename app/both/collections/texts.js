/**
 * Texts is a collection that represents a mapping from strings to bundles of
 * metadata that describe each known occurrence of it. For now, metadata includes
 * the following:
 *
 *       url: a URL pointing to the text's occurrence, or null
 *      date: the date the URL was crawled, or null
 *    corpus: the corpus of origin, or null
 *
 * Every entry in the Texts collection has a field "text" for the string, and
 * a field "metadata" for a key-value store of each of the metadata fields.
 *
 * To populate this, use the python script outside the app folder.
 */
Texts = new Meteor.Collection("texts");

/******************************************
 *  Ensure docs are indexed by _custom_id *
 ******************************************/
console.log("Making sure Mongo's Texts collection has an index for _custom_id...");
Meteor.startup(function() {
  Texts._ensureIndex( {"_custom_id": 1} );
  // indexing fails on field "text" because of a character limit
  //Texts._ensureIndex( {"_custom_id": 1, "text": 1} );
});
console.log("Done building Mongo index.");


/**************
 * Publishing *
 **************/
if (Meteor.isServer) {
  /**
   * This method allows the client to subscribe to he Texts collection. The server takes in the parameters
   * of the subscription request and returns the appropriate subset of the Texts collection.
   *
   * Params contains:
   *   - params['term']: UTF-8 string representing the RegExp to be checked against the corpus
   *   - params['limit']: int, upper bound on how many texts are to be retrieved
   */
  Meteor.publish('texts', function(params) {
    /**
     *  Begin by logging the request and the IP address of origin.
     *
     *  Note: if you're behind a reverse proxy, this will return the address of
     *  your proxy. To solve this, set the environment variable
     *  HTTP_FORWARDED_COUNT before launching meteor. E.g.,
     *     export HTTP_FORWARDED_COUNT=1
     *     meteor
     *  Cf. https://github.com/mizzao/meteor-user-status/issues/48
     */
    console.log('Got a request for ' + params['term'] + ' from ' + this.connection.clientAddress);

    /**
     * Ideally, we would now run a regular expression match (using Mongo's $regex operator)
     * over the entire corpus of texts. But this can take a very long time: for HMC 0.5 (44 million docs, 10GB),
     * a naive $regex query can take 20 minutes or longer.
     *
     * Instead, we use a "trigram inverted index", described by Russ Cox (https://swtch.com/~rsc/regexp/regexp4.html)
     * and partly implemented in Javascript by Bright Fulton (https://github.com/bfulton/regex-trigram-js). The details
     * are beyond the scope of this comment, but the basic idea is that we will create a key-value store: the keys will
     * be three consecutive Unicode code points[1] (called a "trigram"[2] by Cox), and the values will be the
     * corresponding list of _custom_id's on docs that contain the "trigram".
     *
     * Cox shows that regular expressions can be approximated by set operations on trigrams. Consider a query
     * /abcd/ and three docs:
     *
     *   1. abdbcd
     *   2. abcd
     *   3. abcxbcd
     *
     * The key-value mapping would look like this:
     *
     *   abc -> 2, 3
     *   abd -> 1
     *   bcd -> 1, 2, 3
     *   bcx -> 3
     *   bdb -> 1
     *   bdc -> 1
     *   cxb -> 3
     *   dbc -> 1
     *   dcd -> 1
     *   xbc -> 3
     *
     *  The approximation of the query in set operations would be:
     *
     *    abc AND bcd
     *
     *  Mapping these to the values of the key-value store, we would get [2, 3] AND [1, 2, 3], yielding [2, 3].
     *  The set operation approximation correctly does not retrieve document 1 but *does* retrieve document 3,
     *  which is not correct.
     *
     *  The outcome is that while this inverted index trigram approach is useful for avoiding running an expensive
     *  regex operation over every doc in the collection, we cannot avoid running it over the preliminary list
     *  of documents the inverted index gives us. Fortunately, in practice, #[returned docs] << #[total docs]
     *
     * [1] Not sure if this is the right terminology. Come back to this.
     * [2] Bioinformatitians have a similar concept for DNA sequencing which they call "k-mers". Cf.
     *     https://en.wikipedia.org/wiki/K-mer
     */

    // The list of docIds the trigram inverted index gives us
    var docIdList,

    // The query that represents something like `abc AND bcd` that we hand to server/invertedIndex's processQuery
    // function.
      trigramQuery,

    // The query we will hand to Mongo for the final call to Texts.find()
      mongoQuery;

    // Inverted index optimization is still unstable
    try {
      console.log("Building trigram query...");
      // Build using bfulton/regex-trigram's query and parse functions
      trigramQuery = regexTrigram.query(regexTrigram.parse(params['term']));
      console.log("Trigram query done.");

      // This performs the set operations on the inverted index, giving us a preliminary list of doc ids.
      console.log("Calling processQuery...");
      docIdList = processQuery(trigramQuery);

      // If all goes well, Mongo will get this query. First finds docs that are in the list, and then
      // sees whether their text matches the regex.
      mongoQuery = {
        _custom_id: {$in: docIdList},
        text: new RegExp(params['term'])
      };

      mongoQuery["_custom_id"] = mongoQuery["_custom_id"].slice(0, 10000);
    }
    // Did something bad happen? In that case, bite the bullet and brute force the regex.
    // A few things can cause this, including wildcard (`.`) characters.
    catch (e) {
      console.log("Error processing query for term", "\"" + params["term"] + "\"", "\n Error object:", e.stack);
      console.log("Falling back to normal regular expression query over the entire corpus.");
      mongoQuery = {
        text: new RegExp(params['term'])
      };
    }

    /* test for correctness
    var coll = Texts.find(mongoQuery, { limit: params.limit });
    if (mongoQuery["_custom_id"]) {
      var coll2 = Texts.find({text: mongoQuery['text']}, {limit: params.limit });
      if (coll.count() === coll2.count()) {
        console.log("Collections match in size!");
      } else {
        console.log("Collections don't match in size--coll has", coll.count(), "while coll2 has", coll2.count());
      }
    } */

    var coll = Texts.find(mongoQuery, {limit: params.limit });
    return coll;
  });
}