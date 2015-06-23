import Ember from 'ember';

export default Ember.Component.extend({
  maxValue:0,
  updateValue: function(){
    "use strict";
    var value = this.get("value");
    var maxValue = this.get("maxValue");
    if(value>maxValue) {
      this.set('maxValue',value);
    }
  }.observes("value")
});
