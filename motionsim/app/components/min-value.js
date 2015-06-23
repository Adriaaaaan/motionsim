import Ember from 'ember';

export default Ember.Component.extend({
  minValue:0,
  updateValue: function(){
    "use strict";
    var value = this.get("value");
    var minValue = this.get("minValue");
    if(value<minValue) {
      this.set('minValue',value);
    }
  }.observes("value")
});
