// Takes in query sent by client. Evaluates it recursively
// and returns an array of "candidate" doc ids.
processQuery = function (q) {
  var i, j,

    // List of trigrams the query will be operating over with q["op"].
    trigramList = q["trigram"],
    trigramListLen = trigramList.length,

    // q["sub"] contains child queries whose evaluation results are combined with
    // the lists from q["trigram"] using the operation specified by q["op"].
    subQueries = q["sub"],
    subQueryLen = subQueries.length,

    // Array of arrays to be operated over using q["op"]
    docIdLists = [],

    // List for storing final result, a bunch of _custom_id's
    resultList;

  console.log("New call to subquery", q["trigram"]);
  // Push lists from recursive evaluations of child queries.
  for (i = 0; i < subQueryLen; i++) {
    docIdLists.push(processQuery(subQueries[i]));
  }

  // Get the lists that correspond to a single trigram
  // from our inverted index: see definition of this in server/level.js
  for (i = 0; i < trigramListLen; i++) {
    docIdLists.push(Meteor.call('getDocIds', trigramList[i]));
  }

  console.log("Combining subquery with ops...");
  switch (q["op"]) {
    case "AND":
      if (docIdLists.length === 0)
        break;
      resultList = docIdLists[0];

      // Iterate over remaining lists. If any elements
      // exist in them that aren't in the resultList,
      // remove the element from resultList.
      for (i = 0; i < docIdLists.length; i++) {
        var docIdList = docIdLists[i];
        for (j = 0; j < resultList.length; j++) {
          var docId = resultList[j];

          if (docIdList.indexOf(docId) < 0) {
            resultList.splice(j, 1);
          }
        }
      }
      break;

    case "OR":
      resultList = [];

      console.log("WARNING: using potentially incorrect trigram op \"OR\". See server/invertedIndex.js.");
      // I don't think this is correct--come back to it
      for (i = 0; i < docIdLists.length; i++) {
        var docIdList = docIdLists[i];
        for (j = 0; j < docIdList.length; j++ ) {
          var docId = docIdList[j];

          if (resultList.indexOf(docId) < 0) {
            resultList.push(docId);
          }
        }
      }
      break;

    case "ANY":
      throw "op NYI: \"ANY\"";
      break;

    case "ALL":
      throw "op NYI: \"ALL:\"";
      break;

    default:
      throw "Unrecognized op: " + q["op"];
  }

  console.log("About to return", typeof resultList, "which contains", typeof resultList[0]);
  console.log(JSON.stringify(q, null, 2));
  console.log(resultList.length);

  // Mongo expects _custom_id's as ints, not strings
  return resultList.map(function (x) { return parseInt(x, 10) } );
};

