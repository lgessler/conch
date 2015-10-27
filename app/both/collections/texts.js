// Fields:
//   text:    UTF-8 Hindi text, usually a sentence, rarely up to five sentences.
//   type:    the type of the text
//   corpus:  corpus of origin
// To populate this, use the python script outside the app folder.
Texts = new Meteor.Collection("texts");

// Collection Helpers https://github.com/dburles/meteor-collection-helpers
// Collection Hooks https://github.com/matb33/meteor-collection-hooks

if (Meteor.isServer) {
  Meteor.publish('texts', function(params) {
    //ids = ids.map(function(id) { return ObjectId(id); });
    console.log(params);
    return Texts.find({
      text: {
        $in: [params.term]
      }
    }, { limit: params.limit }); //TODO: modify this line
  });
}