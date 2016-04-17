// Home Route
Router.route('/', {
  name: 'home'
});

Router.route('advanced', {
  name: 'buildRegex',
  path: '/advanced',
  template: 'buildRegex'
});

Router.route('searchResults', {
  name: 'searchResults',
  path: '/search/:term',
  template: 'searchResults',
  progress: false,

  onBeforeAction: function() {
    Session.set('ready', false);
    Session.set('term', this.params.term);

    this.next();
  }
});
