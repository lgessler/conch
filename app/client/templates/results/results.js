self = this;

Template.results.helpers({
  moreResults: function() {
    // If, once the subscription is ready, we have less rows than we
    // asked for, we've got all the rows in the collection.
    return !(Texts.find().count() < Session.get("textsLimit"));
  },
  texts: function() {
    return Texts.find();
  },
  term: function() {
    return Router.current().params.term;
  }
});

// Fill this in with something real eventually
idlist = ["2j2jv4292d13d19"];

var TEXTS_INCREMENT = 20;
Session.setDefault('textsLimit', TEXTS_INCREMENT);
Deps.autorun(function() {
  var term = Session.get('term');
  var limit = Session.get('textsLimit');
  console.log(term, limit, "hi");
  Meteor.subscribe('texts', {term: term, limit: limit});
});


// whenever #showMoreResults becomes visible, retrieve more results
function showMoreVisible() {
  var threshold, target = $("#showMoreResults");
  if (!target.length) return;

  threshold = $(window).scrollTop() + $(window).height() - target.height();

  if (target.offset().top < threshold) {
    if (!target.data("visible")) {
      // console.log("target became visible (inside viewable area)");
      target.data("visible", true);
      Session.set("textsLimit",
        Session.get("textsLimit") + texts_INCREMENT);
    }
  } else {
    if (target.data("visible")) {
      // console.log("target became invisible (below viewable arae)");
      target.data("visible", false);
    }
  }
}

// run the above func every time the user scrolls
$(window).scroll(showMoreVisible);