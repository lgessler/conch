/**
 * Created by lukegessler on 1/10/16.
 */

// InvertedIndex is a key-value store: keys are trigrams and
// values are arrays of ints, which correspond to a _custom_id
// on an element in the Texts collection. Any trigram occurs
// exactly once in InvertedIndex.
//
// TL;DR: fields are `trigram` and `docs`

InvertedIndex = new Meteor.Collection("invertedIndex");

Meteor.startup(function() {
  InvertedIndex._ensureIndex( {"trigram": 1} );
});
