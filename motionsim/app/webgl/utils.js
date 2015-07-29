export default function() {

  /**
   * Creates a webgl context.
   * @param {!Canvas} canvas The canvas tag to get context
   *     from. If one is not passed in one will be created.
   * @return {!WebGLContext} The created context.
   */
  var create3DContext = function(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch(e) {}
      if (context) {
        break;
      }
    }
    return context;
  };

  /**
   * Creates a program, attaches shaders, binds attrib locations, links the
   * program and calls useProgram.
   * @param {WebGLShader[]} shaders The shaders to attach
   * @param {string[]?} opt_attribs The attribs names.
   * @param {number[]?} opt_locations The locations for the
   *        attribs.
   * @param {function(string): void) opt_errorCallback callback for errors.
 */
  var loadProgram = function(
    gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
    var errFn = opt_errorCallback || error;
    var program = gl.createProgram();
    for (var i = 0; i < shaders.length; ++i) {
      gl.attachShader(program, shaders[i]);
    }
    if (opt_attribs) {
      for (var ii = 0; ii < opt_attribs.length; ++ii) {
        gl.bindAttribLocation(
          program,
          opt_locations ? opt_locations[ii] : ii,
          opt_attribs[ii]);
      }
    }
    gl.linkProgram(program);

    // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // something went wrong with the link
      var lastError = gl.getProgramInfoLog (program);
      errFn("Error in program linking:" + lastError);

      gl.deleteProgram(program);
      return null;
    }
    return program;
  };

  return {
    createProgram: loadProgram,
    create3DContext: create3DContext
  };
}()

/**
 * Wrapped logging function.
 * @param {string} msg The message to log.
 */
var error = function(msg) {
  if (window.console) {
    if (window.console.error) {
      window.console.error(msg);
    }
    else if (window.console.log) {
      window.console.log(msg);
    }
  }
};

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(/* function FrameRequestCallback */ callback) {
      return window.setTimeout(callback, 1000/60);
    };
})();

/**
 * Provides cancelAnimationFrame in a cross browser way.
 */
window.cancelAnimFrame = (function() {
  return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    window.clearTimeout;
})();

