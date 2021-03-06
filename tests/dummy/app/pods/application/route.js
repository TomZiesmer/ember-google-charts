import Ember from 'ember';

export default Ember.Route.extend({

  actions: {

    linkTo(url) {
      window.open(url);
    },

    transitionTo(routeName) {
      const name = Ember.String.capitalize(routeName.split('.')[1]);

      this.transitionTo(routeName);
      this.controller.set('pageTitle', `${name} Charts`);
    },
  },

});
