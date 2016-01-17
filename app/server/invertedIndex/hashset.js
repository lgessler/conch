/**
 * Created by lukegessler on 1/17/16.
 */

DocIdSet = class DocIdSet {
  constructor(iterable) {
    if (iterable) {
      var self = this;
      iterable.forEach(function(elt) {
        self[elt] = true;
      });
    }
  }

  add(elt) {
    throw "Don't use this: instead, use set[elt] = true";
  }
  remove(elt) {
    throw "Don't use this: instead, use delete set[elt]";
  }

  static union(sets) {
    var answer = sets[0];

    for (var i = 1; i < sets.length; i++) {
      var currentSet = sets[i];
      Object.keys(currentSet).forEach(function(elt) {
        if (!(elt in answer))
          answer[elt] = true;
      });
    }
    return answer;
  }

  // assume sets is at least of length 1
  static intersect(sets) {
    console.log("Begin intersect...");
    var firstSet = sets[0],
      answer = new DocIdSet();

    for (var i = 1; i < sets.length; i++) {
      var currentSet = sets[i];
      Object.keys(firstSet).forEach(function(elt) {
        if (elt in currentSet)
          answer[elt] = true;
      });
      console.log("Done with intersection", i);
    }
    console.log("Intersect finished.");
    return answer;
  }

  static difference(set1, set2) {
    throw "Not implemented: DocIdSet.difference()";
  }
}

