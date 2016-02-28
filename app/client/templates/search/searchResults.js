
// Though we put this here because it's logically associated with this template,
// note that this is active _globally_ on all templates
Streamy.on('search', function(d) {
  if (Router.current().route.getName() === "searchResults") {

    if (d.type === 'DATA') {
      console.log("received data", d);
      var data = d.data;
      data.text = data.text.replace('\n', ' ');

      Blaze.renderWithData(
          Template.searchResultItem,
          data,
          $("#searchResults")[0],  // parent node
          $("#scrollDiv")[0]       // node to insert before
      );
    } else {
      console.log("received non-data message", d);
      Session.set('moreResults', false);
    }
  } else {
    throw "Got an object " + d.toString() + ", but we aren't on searchResults!";
  }
});

Template.searchResults.created = function () {
  Session.set('moreResults', true);

  Streamy.emit('search', {
    type: 'TERM',
    term: Session.get('term')
  });
};

Template.searchResults.destroyed = function () {
  Streamy.emit('search', {
    type: 'KILL'
  });
};

Template.searchResults.rendered = function () {
  this.$("#searchResults").bind('scroll', function() {
    console.log($(this).scrollTop(), $(this).innerHeight(), $(this)[0].scrollHeight);
    if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight) {
      if (Session.get('moreResults')) {
        Streamy.emit('search', {type: 'INCR', amt: 30});
      }
    }
  });
};

Template.searchResults.helpers({
  term: function() {
    return Router.current().params.term;
  },
  moreResults: function() {
    return Session.get('moreResults');
  }
});

