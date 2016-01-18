// Takes in query sent by client. Evaluates it recursively
// and returns an array of "candidate" doc ids.
processQuery = function (q) {
  var i,

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

  console.log("Combining subquery with op", q["op"]);
  switch (q["op"]) {
    case "AND":
      resultList = Object.keys(DocIdSet.intersect(docIdLists));
      break;

    case "OR":
      resultList = Object.keys(DocIdSet.union(docIdLists));
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

  // Mongo expects _custom_id's as ints, not strings
  return resultList.map(function (x) { return parseInt(x, 10) } );
};
