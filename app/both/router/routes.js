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
  }
});