
// Build inverted index

if (InvertedIndex.find().count() === 0) {
  console.log("InvertedIndex is empty. Constructing inverted index...");

  var docNum = 0,
    buffer = {};

  Texts.find().forEach(function (doc) {
    var docId = doc._custom_id;
    var text = doc.text;
    var docLength = doc.text.length;

    // keep track of trigrams we've already seen in this doc
    var alreadyAdded = [];
    for (var i = 0; i < docLength - 2; i++) {
      var trigram = text.substring(i, i + 3);

      if (buffer[trigram] && !(trigram in alreadyAdded)) {
        buffer[trigram].push(docId);
      } else {
        buffer[trigram] = [docId];
      }
      alreadyAdded.push(trigram);
    }
    docNum += 1;

    if (!(docNum % 10000)) {
      // Every 10000 docs, bulk write to Mongo
      console.log("Bulk writing past 10000 docs to Mongo...");
      var bulk = InvertedIndex._collection.rawCollection().initializeUnorderedBulkOp();

      Object.keys(buffer).forEach(function(trigram, i) {
        // Find element with trigram if it exists, otherwise create it
        bulk.find({trigram: trigram}).upsert().updateOne({
          $setOnInsert: { trigram: trigram },
          $push: { docs: { $each: buffer[trigram] } }
        });
        if (!(i%1000))
          console.log("Staged bulk op #", i);
      });
      bulk.execute();

      console.log("Processed doc", docNum, ". Trigrams: ", InvertedIndex.find().count());
      buffer = {};
    }
  });

  console.log("Found", InvertedIndex.find().count(), "trigrams in", Texts.find().count(), "docs.");
}

console.log(InvertedIndex.find({}, {limit: 5}).fetch());

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
    docIdLists.push(InvertedIndex.findOne({trigram: trigramList[i]}).docs);
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
  return resultList;
};

