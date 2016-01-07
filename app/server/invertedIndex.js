// Build inverted index

var invertedIndex = {};

console.log("Constructing inverted index...");

var numTrigrams = 0,
  docNum = 0;
Texts.find().forEach( function(doc) {
  var docId = doc._id;
  var text = doc.text;
  var docLength = doc.text.length;
  for (var i = 0; i < docLength - 2; i++) {
    var trigram = text.substring(i, i + 3);
    if (trigram in invertedIndex) {
      invertedIndex[trigram].push(docId);
    } else {
      invertedIndex[trigram] = [docId];
      numTrigrams += 1;
    }
  }
  docNum += 1;
  console.log("Processed doc", docNum, ". Trigrams: ", numTrigrams);
});

console.log("Found", Object.keys(invertedIndex).length, "trigrams in", Texts.find().count(), "docs.");

// Takes in query sent by client and narrows down number of docs in the inverted index to search.
processQuery = function(q) {
  // Array of values (other arrays) from the invertedIndex
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
    docIdLists.push(invertedIndex[trigramList[i]]);
    //console.log(docIdLists[docIdLists.length-1]);
  }


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
  return resultList;
};