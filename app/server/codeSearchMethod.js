// Code below taken from http://eureka.ykyuen.info/2015/02/26/meteor-run-shell-command-at-server-side/

var spawn = Meteor.npmRequire('child_process').spawn;

var lineToResultObj = function(line, i) {
  var elts;
  var newObj;
  var line;

  elts = line.split('\t');

  newObj = {
    text: elts[2],
    corpus: elts[1],
    index: i
  };

  if (newObj.text === undefined)
    return;

  return newObj;
};

Streamy.on('search', function(d, s) {
  i = 0;
  var csearch = spawn('/home/luke/.go/bin/csearch', ['-n', d.term]);

  csearch.stdout.on('data', function(data) {
    var o = lineToResultObj(data.toString(), i);
    if (o) {
      console.log(o);
      i += 1;
      Streamy.emit('search', o, s);
    }
  });
});
