Template.home.rendered = function() {

};
Template.home.events({
  "submit form": function(e) {
    e.preventDefault();

    Router.go('results', {'term': $(e.target).find('[name=term]').val()} );
  }
});