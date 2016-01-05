self = this;

function suppressDuplicates(textList) {
  var seen = {};
  return textList.filter(function(text) {
    return seen.hasOwnProperty(text.text) ? false : (seen[text.text] = true);
  });
}

Template.results.helpers({
  moreResults: function() {
    // If, once the subscription is ready, we have fewer rows than we
    // asked for, we've got all the rows in the collection.
    return !(Texts.find().count() < Session.get("textsLimit"));
  },
  texts: function() {
    console.log("Trying to find texts...");
    var coll = Texts.find().fetch();
    console.log(coll);
    //coll = suppressDuplicates(coll);
    var index = 0;
    coll.forEach(function(text) {
      var term = Session.get('term');
      //text.text = text.text.replace(term, '<span style="background-color: #FFFF00">' + term + '</span>');
      text.index = index;
      index += 1;
    });

    return coll;
  },
  term: function() {
    return Router.current().params.term;
  }
});

