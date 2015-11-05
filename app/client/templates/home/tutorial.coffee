tutorialSteps = [
    template: "tutorial_1"
  ,
    template: "tutorial_2"
  ,
    template: "tutorial_3"
    spot: ".form-group"
    #require:
    #  event: "something-emitted"
]

Session.setDefault "tutorialNotFinished", true

Template.home.helpers
  options:
    id: "myCoolTutorial"
    steps: tutorialSteps
    emitter: new EventEmitter()
    onFinish: ->
      Session.set "tutorialNotFinished", false
  tutorialNotFinished: ->
    Session.get "tutorialNotFinished"
