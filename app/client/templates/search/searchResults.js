RESULT_CHARACTER_LIMIT = 100;

// ugly, ugly, ugly, but it works most of the time, and the solution,
// to use white-space: pre, doesn't work: the table sizing algorithm
// in chrome doesn't seem to pay attention to white-space values
// TODO: find a better way to do this
var whiteRegex = /\s/;
var trimSpaceOnLeft = function(s) {
  if (whiteRegex.test(s.charAt(0))) {
    s = '&nbsp;' + s.substr(1);
  }
  return s;
};
var trimSpaceOnRight = function(s) {
  if (whiteRegex.test(s.charAt(s.length-1))) {
    s = s.substr(0, s.length-1) + '&nbsp;';
  }
  return s;
};

// Though we put this here because it's logically associated with this template,
// note that this is active _globally_ on all templates
Streamy.on('search', function(d) {
  if (Router.current().route.getName() === "searchResults") {

    if (d.type === 'DATA') {
      console.log("received data", d);
      var data = d.data;
      data.text = data.text.replace('\n', ' ');

      var rex = new RegExp(Session.get('term'), 'g');
      // assume we only have one occurrence per text
      // TODO: generalize this
      var matched = data.text.match(rex)[0];



      data.left = trimSpaceOnRight(
          data.text.substr(0, data.text.indexOf(matched)));
      if (data.left.length > RESULT_CHARACTER_LIMIT) {
        data.left = '…' + data.left.substr(data.left.length - RESULT_CHARACTER_LIMIT);
      }

      data.center = trimSpaceOnLeft(trimSpaceOnRight(matched));

      data.right = trimSpaceOnLeft(
          data.text.substr(data.text.indexOf(matched) + matched.length));
      if (data.right.length > RESULT_CHARACTER_LIMIT) {
        data.right = data.right.substr(0, RESULT_CHARACTER_LIMIT) + '…';
      }

      Blaze.renderWithData(
          Template.searchResultItem,
          data,
          $("#searchResults")[0]  // parent node
      );

      $('#searchResultsWindow').scrollTo($('#centerCol'), {
        axis: 'x',
        offset: {left: -($(window).width() *.5), top: 0}
      });

      Session.set('ready', true);
    }
    else {
      console.log("received non-data message", d);
      Session.set('moreResults', false);
    }
  } else {
    throw "Got an object " + d.toString() + ", but we aren't on searchResults!";
  }
});

Template.searchResults.created = function () {
  Session.set('moreResults', true);
  Session.set('lastIncr', new Date());

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
  this.$("#searchResultsWindow").bind('scroll', function() {
    console.log($(this).scrollTop(), $(this).innerHeight(), $(this)[0].scrollHeight);
    if($(this).scrollTop() + $(this).innerHeight() >= ($(this)[0].scrollHeight - 40)) {
      if (Session.get('moreResults') && (new Date() - Session.get('lastIncr') > 200)) {
        Streamy.emit('search', {type: 'INCR', amt: 30});
        Session.set('lastIncr', new Date());
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
  },
  ready: function() {
    return Session.get('ready');
  }
});

