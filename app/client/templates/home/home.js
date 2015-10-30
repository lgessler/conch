Template.home.rendered = function() {

};
Template.home.events({
  "submit form": function(e) {
    e.preventDefault();
    var term = $(e.target).find('[name=term]').val();
    Session.set('prevTerm', term);
    Router.go('results', {'term': term} );
  }
});

Template.home.helpers({
  prevTerm: function() {
    return Session.get('prevTerm');
  }
});