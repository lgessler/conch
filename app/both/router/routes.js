// Home Route
Router.route('/', {
  name: 'home'
});

Router.route('results', {
  name: 'results',
  path: '/results/:term',
  template: 'results',
  onBeforeAction: function() {
    Session.set('term', this.params.term);
    this.next();
  },
  waitOn: function() {
    var term = Session.get('term');
    var limit = Session.get('textsLimit');
    Meteor.subscribe('texts', {term: term, limit: limit});


  }
});