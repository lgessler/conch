var tutorialSteps = [
  {
    template: "tutorial_1"
  },
  {
    template: "tutorial_2",
    spot: ".form-group"
    //require:
    //  event: "something-emitted"
  }
];

if (Cookie.get("tutorialNotFinished") === undefined) {
  Cookie.set("tutorialNotFinished", true);
}

Template.home.helpers({
  options: {
    id: "myCoolTutorial",
    steps: tutorialSteps,
    onFinish: function() {
      Cookie.set("tutorialNotFinished", false);
    }
  },
  tutorialNotFinished: function() {
    Cookie.get("tutorialNotFinished");
  }
});


