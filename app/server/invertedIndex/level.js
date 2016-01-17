// We use LevelDB to store the trigram inverted index. Meteor.npmRequire is from meteorhacks:npm.
var Level = Meteor.npmRequire('level');

// Get absolute path using this one weird trick
// Trick taken from VeliovGroup/Meteor-root: https://github.com/VeliovGroup/Meteor-root/blob/master/meteor-root.js
var levelPath = __meteor_bootstrap__.serverDir.split('app/.meteor')[0] + 'leveldb';

// Open the connection outside of the method. If made inside, two threads might try to access it at the same time,
// and one of them would fail due to the lock.
var db = Level(levelPath);

Meteor.methods({
  'getDocIds': function getDocIds(trigram) {
    console.log("Fetching trigram",trigram,"from level.");
    // Async is from meteorhacks:async
    var future = Async.runSync(function(done) {
      db.get(trigram, function(err, val) {
        if (err) done(err, null);
        done(null, val);
      });
    });

    // parse str
    console.log("Splitting string array from level...");
    var strArray = future.result.split(',');
    console.log("Done splitting.");
    return strArray;
  }
});