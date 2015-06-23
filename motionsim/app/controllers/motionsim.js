import Ember from 'ember';

export default Ember.Controller.extend({
  stats:{},
  setup: function () {
    var socket = io();
    socket.on('update', (data) => {
      this.set('model',data);
    });
  }.on('init')
});
