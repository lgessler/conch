Streamy.on('search', function(d) {
   if (Router.current().route.getName() !== "searchResults") {
     Streamy.emit('search', {kill: true});
   } else {
     Blaze.renderWithData(Template.searchResultItem, _.extend(d, {index: 0}), $("#searchResults")[0]);
   }
});