Template.home.rendered = function() {
  Session.setDefault('advancedMode', false);
};

Template.home.events({
  "submit form": function(e) {
    e.preventDefault();
    var term = $(e.target).find('[name=term]').val();
    Session.set('prevTerm', term);
    Router.go('searchResults', {'term': term} );
  },
  "click #modebutton" : function(e) {
    e.preventDefault();
    Session.set('advancedMode', !Session.get('advancedMode'));
  }
});

Template.home.helpers({
  prevTerm: function() {
    return Session.get('prevTerm');
  },
  advanced: function() {
    return Session.get('advancedMode');
  }
});