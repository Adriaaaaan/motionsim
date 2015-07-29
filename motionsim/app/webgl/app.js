import Ember from 'ember';
import utils from './utils';
import shaderUtils from '../shaders/utils';

class WebbGlApp {
  constructor(canvas) {
    this.gl = utils.create3DContext(canvas);
    this.width = canvas.width;
    this.height = canvas.height;
  }

  start() {
    var _this = this;
    Ember.RSVP.all([
        shaderUtils.loadShader("basicVertex.glsl"),
        shaderUtils.loadShader("basicFragment.glsl"),
        shaderUtils.loadShader("circle.vert.glsl"),
        shaderUtils.loadShader("circle.frag.glsl")
      ]
    ).then(function (shaders) {
        _this.drawTriangles([shaders[0],shaders[1]]);
        _this.drawCircles([shaders[2],shaders[3]]);
      });
  }

  createProgram(shaders) {
    var vertexShader = shaderUtils.compileShader(this.gl, shaders[0], this.gl.VERTEX_SHADER);
    var fragmentShader = shaderUtils.compileShader(this.gl, shaders[1], this.gl.FRAGMENT_SHADER);
    return utils.createProgram(this.gl, [vertexShader, fragmentShader]);
  }

  drawTriangles(shaders) {
    let program = this.createProgram(shaders);
    let gl = this.gl;
    gl.useProgram(program);
    this.colorLocation = gl.getUniformLocation(program, "u_color");

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // set the resolution
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    gl.uniform2f(resolutionLocation, this.width, this.height);

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let colour = [Math.random(), Math.random(), Math.random(), 1];
    this.createRectangle(200,200,40,40,colour);
    this.createRectangle(0,0,100,100, colour);
    this.createTriangle([400,300],[400,250],[350,350], colour);
  }

  drawCircles(shaders) {
    let program = this.createProgram(shaders);
    let gl = this.gl;
    gl.useProgram(program);

    // set the resolution
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, this.width, this.height);

    // look up where the vertex data needs to go.
    this.positionLocation = gl.getAttribLocation(program, "a_position");
    //circle centre and radius
    var centerLocation = gl.getAttribLocation(program, "a_center");
    var radiusLocation = gl.getAttribLocation(program, "a_radius");

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);

    let colour = [Math.random(), Math.random(), Math.random(), 1];
   // this.createCircle(program, 100,100,25, colour);
   // this.createCircle(program, 200,400,125, colour);
    this.createCircle(program, 300,100,225, colour);
    this.createCircle(program, 100,100,5, colour);
    this.createCircle(program, 200,200,10, colour);
    this.createCircle(program, 400,400,20, colour);
  }

  createCircle(program, x, y, r, colour) {
    let gl = this.gl;
    var ATTRIBUTES = 5;
    var j = 0;
    var data = [];
    // add 1 to the radius for antialiasing
    r++;

    // bottom left point of triangle
    data[j++] = (x - r);
    data[j++] = (y - r);
    data[j++] = x;
    data[j++] = y;
    data[j++] = r;

    // bottom right point of triangle
    data[j++] = (x + (1 + Math.sqrt(2)) * r);
    data[j++] = y - r;
    data[j++] = x;
    data[j++] = y;
    data[j++] = r;

    // top left point of triangle
    data[j++] = (x - r);
    data[j++] = (y + (1 + Math.sqrt(2)) * r);
    data[j++] = x;
    data[j++] = y;
    data[j++] = r;

    var dataBuffer = new Float32Array(data);

    gl.bufferData(
      gl.ARRAY_BUFFER,
      dataBuffer,
      gl.STATIC_DRAW);

    var centerLocation = gl.getAttribLocation(program, "a_center");
    var radiusLocation = gl.getAttribLocation(program, "a_radius");

    gl.enableVertexAttribArray(this.positionLocation);
    gl.enableVertexAttribArray(centerLocation);
    gl.enableVertexAttribArray(radiusLocation);

    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(centerLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
    gl.vertexAttribPointer(radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);

    gl.drawArrays(gl.TRIANGLES, 0, data.length/ATTRIBUTES);
  }

  createTriangle(startPoint, secondPoint, thirdPoint, rgbColour) {
    let gl = this.gl;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      startPoint[0], startPoint[1],
      secondPoint[0], secondPoint[1],
      thirdPoint[0], thirdPoint[1]]), gl.STATIC_DRAW);
    // Set a random color.
    gl.uniform4f(this.colorLocation, rgbColour[0], rgbColour[1], rgbColour[2], rgbColour[3]);
    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // Fills the buffer with the values that define a rectangle.
  createRectangle(x, y, width, height, rgbColour) {
    let gl = this.gl;
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2]), gl.STATIC_DRAW);
    // Set a random color.
    gl.uniform4f(this.colorLocation, rgbColour[0], rgbColour[1], rgbColour[2], rgbColour[3]);
    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}



export default WebbGlApp;
