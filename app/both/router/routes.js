// Home Route
Router.route('/', {
  name: 'home'
});

Router.route('results', {
  name: 'results',
  path: '/results/:term',
  template: 'results',
  progress: false,
  waitOn: function() {
    Session.set('term', this.params.term);
    var term = Session.get('term');
    var limit = Session.get('textsLimit');
    return Meteor.subscribe('texts', {term: term, limit: limit});
  }
});