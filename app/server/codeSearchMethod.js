// Code below taken from http://eureka.ykyuen.info/2015/02/26/meteor-run-shell-command-at-server-side/

var Future = Npm.require("fibers/future");
// Load exec
var execFile = Npm.require("child_process").execFile;

Meteor.methods({
  codeSearch: function(term) {
    this.unblock();
    var future = new Future();

    var options = {
      maxBuffer: 1024 * 5000,
      timeout: 1000
    };

    execFile('/home/luke/.go/bin/csearch', ['-n', term], options, function(error, stdout) {
      if (error) {
        console.log(error);
      }
      future.return(stdout.toString());
    });
    return future.wait();
  }
});