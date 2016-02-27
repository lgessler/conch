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
    csearch = spawn('/home/luke/.go/bin/csearch', ['-n', d.term]);
    procs[s.id] = csearch;

    csearch.stdout.on('data', function (data) {
      o = lineToResultObj(data.toString());
      if (o) {
        Streamy.emit('search', o, s);
      }
    });
  }
});
