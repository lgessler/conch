// Home Route
Router.route('/', {
  name: 'home'
});



function suppressDuplicates(textList) {
  var seen = {};
  return textList.filter(function(text) {
    return seen.hasOwnProperty(text.text) ? false : (seen[text.text] = true);
  });
}


Router.route('searchResults', {
  name: 'searchResults',
  path: '/search/:term',
  template: 'searchResults',
  progress: false,

  waitOn: function() {
    Session.set('term', this.params.term);
    Session.set('searchResults', undefined);
    var term = this.params.term;

    Meteor.call('codeSearch', term, function(err, res) {
      if (err) {
        throw new Meteor.Error(500, "Something went wrong :(");
      }

      var texts = [];
      var rawLines;
      var elts;
      var newObj;
      var i, line;

      console.log("Found ", res.split('\n').length, "lines.");

      rawLines = res.split('\n');

      for (i = 0; i < rawLines.length; i++) {
        var line = rawLines[i];
        elts = line.split('\t');

        newObj = {
          text: elts[2],
          corpus: elts[1],
          index: texts.length
        };

        if (newObj.text === undefined)
          continue;

        console.log(newObj);
        texts.push(newObj);
      }

      Session.set('searchResults', texts);
    });
  }
});
