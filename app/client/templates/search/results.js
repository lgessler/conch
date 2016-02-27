
Template.searchResults.created = function () {
  Streamy.emit('search', {term: Session.get('term')});
  Streamy.on('search', function(d) {
     Blaze.renderWithData(Template.searchResultItem, d, $("#main")[0]);
  });
};

Template.searchResults.destroyed = function () {

};

Template.searchResults.helpers({
  texts: function() {
    return Session.get('searchResults');
  },
  term: function() {
    return Router.current().params.term;
  }
});

