
Template.searchResults.created = function () {
  Streamy.emit('search', {term: Session.get('term')});
};

Template.searchResults.helpers({
  term: function() {
    return Router.current().params.term;
  }
});

