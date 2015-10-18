Dictionary = new Meteor.Collection("Dictionary");

if (Meteor.isServer) {
    Meteor.publish("Dictionary", function() {
        return Dictionary.find();
    });
}

if (Meteor.isClient) {
    Meteor.subscribe("Dictionary");
}