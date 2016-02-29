// Home Route
Router.route('/', {
  name: 'home'
});



function suppressDuplicates(textList) {
  var seen = {};
  return textList.filter(function(text) {
    return seen.hasOwnProperty(text.text) ? false : (seen[text.text] = true);
  });
}


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
