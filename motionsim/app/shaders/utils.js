import Ember from 'ember';

class Util {
  loadShader(name) {
    return Ember.$.ajax({
      url:'shaders/'+name,
      type:'GET',
      contextType:'text/plain'
    });
  }
  //Load and Compile Shader
  compileShader(gl, source, type) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      var lastError = gl.getShaderInfoLog(shader);
      console.error(lastError);
      gl.deleteShader(shader);
      shader = null;
    }
    return shader;
  }
}

export default new Util();
