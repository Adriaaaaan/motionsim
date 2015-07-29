import Ember from 'ember';
import WebGlApp from '../webgl/app';

export default Ember.Controller.extend({
  stats:{},
  setup: function () {
    var socket = io();
    socket.on('update', (data) => {
      this.set('model',data);
    });
  }.on('init'),
  actions: {
    webGlApp: function(canvas) {
      let webGlApp = new WebGlApp(canvas);
      webGlApp.start();
    }
  }
});
