// Used to call the nodejs script that interacts with leveldb

var Level = Meteor.npmRequire('level');
//var Future = Meteor.npmRequire('fibers/future');
var db = Level("/Users/lukegessler/Sync/playground/corpex/leveldb");

Meteor.methods({
  'getDocIds': function getDocIds(trigram) {
    var str = Async.runSync(function(done) {
      db.get(trigram, function(err, val) {
        if (err) done(err, null);
        done(null, val);
      });
    });

    // parse str
    var strArray = str.result.split(',');
    return strArray;
  }
});