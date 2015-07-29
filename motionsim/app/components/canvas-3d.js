import Ember from 'ember';

export default Ember.Component.extend({
  tagName:'canvas',
  attributeBindings:['width', 'height'],
  onRender: function() {
    this.sendAction('onReady', this.$().get(0));
  }.on('didInsertElement')
});
