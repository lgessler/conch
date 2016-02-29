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


// We use Streamy's s.id attribute to uniquely map from client to child process. This is to
// ensure that with more than one user, we will only ever kill that user's process.
var procs = {};
var limits = {};
var numsSent = {};
var lineBuffers = {};
Streamy.on('search', function(d, s) {
  var o;
  var lineBuffer = lineBuffers[s.id];
  var csearch = procs[s.id];

  console.dir(s);
  
  try {
  console.log("Server hears an emission on 'search'", d, "from client", s.id, "at", s.headers['x-forwarded-for']);
  }
  catch (e) {
    console.log("Server hears an emission on 'search'", d, "from client", s.id);
  }

  console.log(s.ip);

  switch (d.type) {
    case 'KILL':
      if (csearch) {
        csearch.kill('SIGKILL');
        delete procs[s.id];
      }
      break;

    case 'INCR':
      if (csearch && numsSent[s.id] >= limits[s.id] - d.amt) {
        limits[s.id] += d.amt;
        csearch.kill('SIGCONT');
      }
      else {
        throw new Meteor.Error(500, "Tried to INCR a csearch that didn't exist!");
      }
      break;

    // we have a new search--spawn a new process for it
    case 'TERM':
      csearch = spawn(Meteor.settings.CSEARCH_PATH, ['-n', d.term]);
      procs[s.id] = csearch;
      numsSent[s.id] = 0;
      limits[s.id] = 20;
      lineBuffer = [];
      lineBuffers[s.id] = lineBuffer;

      csearch.stdout.on('data', function (data) {
        //console.log(data.toString(), numsSent[s.id], "of", limits[s.id]);

        // NOTE: this could give us more than one line at a time, so we must split on \n
        var lines = data.toString().split('\n');
        lines = lines.slice(0, lines.length-1); //get rid of empty line at the end
        lines.forEach(function(line) {
          lineBuffer.push(line);
        });

        while (lineBuffer[numsSent[s.id]] && numsSent[s.id] < limits[s.id]) {
          o = lineToResultObj(lineBuffer[numsSent[s.id]]);
          if (o) {
            Streamy.emit('search', {
              type: 'DATA',
              data: o
            }, s);
            numsSent[s.id]++;
          } else {
            lineBuffer = lineBuffer.splice(numSent, 1);
          }
        }

        if (numsSent[s.id] >= limits[s.id]) {
          csearch.kill('SIGSTOP');
        }

      });

      // let client know when we're done
      csearch.on('close', function() {
        Streamy.emit('search', {type: 'DONE'}, s);
      });
      break;

    default:
      throw new Meteor.Error(500, "Malformed Streamy emission received on server--how did that happen?");
  }
});

/* INDEX UPDATE */
// This code calls cindex every hour to check for changes to local files.
var callCindex = function() {
  console.log("Running cindex cron job");
  spawn(Meteor.settings.CINDEX_PATH); // no args--we already know _what_ to index
};

var cron = new Meteor.Cron({
  events: {
    "0 * * * *": callCindex
  }
});
