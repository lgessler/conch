// -- Router Config --
Router.configure({
  //layoutTemplate: 'appLayout',
  layoutTemplate: 'authLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  progressSpinner : false
});

Router.plugin('loading', {loadingTemplate: 'loading'});
Router.plugin('dataNotFound', {dataNotFoundTemplate: 'notFound'});

// Accounts Config
AccountsTemplates.configureRoute('signIn', {layoutTemplate: 'appLayout'});
AccountsTemplates.configureRoute('signUp', {layoutTemplate: 'appLayout'});
