// Takes in query sent by client and narrows down number of docs in the inverted index to search.
processQuery = function (q) {
  // Array of values (other arrays) from the InvertedIndex
  var i,
    j,
    subQueries = q["sub"],
    subQueryLen = subQueries.length,
    trigramList = q["trigram"],
    trigramListLen = trigramList.length,
    docIdLists = [],
    resultList;

  for (i = 0; i < subQueryLen; i++) {
    docIdLists.push(processQuery(subQueries[i]));
  }

  for (i = 0; i < trigramListLen; i++) {
    docIdLists.push(Meteor.call('getDocIds', trigramList[i]));
  }

  console.log(JSON.stringify(q, null, 2));
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

      for (var docIdList in docIdLists) {
        for (var docId in docIdList) {
          if (docIdList.indexOf(docId) < 0) {
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
  return resultList.map(function (x) { return parseInt(x, 10) } );
};

