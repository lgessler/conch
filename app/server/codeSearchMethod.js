// Code below taken from http://eureka.ykyuen.info/2015/02/26/meteor-run-shell-command-at-server-side/

var spawn = Meteor.npmRequire('child_process').spawn;

var lineToResultObj = function(line) {
  var elts;
  var newObj;
  var line;

  elts = line.split('\t');

  newObj = {
    text: elts[2],
    corpus: elts[1]
  };

  if (newObj.text === undefined)
    return;

  return newObj;
};

// Client can emit two messages: one with a single attribute, "kill", set to true, and one with
// a single attribute, "term", representing the user's query. Depending on which we see,
// either kill the user's process (because she has navigated away from the results page),
// or spawn a new one.
//
// We use Streamy's s.id attribute to uniquely map from client to child process. This is to
// ensure that with more than one user, we will only ever kill that user's process.
var procs = {};
Streamy.on('search', function(d, s) {
  var o;
  console.log("Server hears an emission on 'search'", d);

  var csearch = procs[s.id];

  // if it already exists, kill it
  if (d.kill) {
    if (csearch) {
      csearch.kill('SIGKILL');
      delete procs[s.id];
    }
  }
  else {
    csearch = spawn(Meteor.settings.CSEARCH_PATH, ['-n', d.term]);
    procs[s.id] = csearch;

    csearch.stdout.on('data', function (data) {
      o = lineToResultObj(data.toString());
      if (o) {
        Streamy.emit('search', o, s);
      }
    });
  }
});

/* INDEX UPDATE */
// This code calls cindex every hour to check for changes to local files.
var callCindex = function() {
  spawn(Meteor.settings.CINDEX_PATH); // no args--we already know _what_ to index
};

var cron = new Meteor.Cron({
  events: {
    "0 * * * *": callCindex
  }
});
