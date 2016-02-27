self = this;

Template.searchResults.helpers({
  texts: function() {
    return Session.get('searchResults');
  },
  term: function() {
    return Router.current().params.term;
  }
});

