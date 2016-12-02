//Matthew Riddell
//Assignment 2

"use strict";

function main() {
  // Vertex shader program
  var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_xformMatrix * a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
    '}\n';

  // Fragment shader program
  var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_Color;\n' +
    '}\n';

  var shaderVars = {
    u_xformMatrix:0,
    a_Position:0,
    u_Color:0
  };

  var points = {
    vertices: new Float32Array([
      0.0,  0.0,
     -0.1, -0.1
    ]),
    n: 2,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var lines = {
    vertices: new Float32Array([
      -1.0, -0.9,
      -0.1, -0.85,
       0.1, -0.85,
       1.0, -0.9
    ]),
    n: 4,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var line_loop = {
    vertices: new Float32Array([
      -1.0,  -0.9,
      -0.75, -0.85,
      -0.5,  -0.95,
      -0.25, -0.85,
       0.0,  -0.95,
       0.25, -0.85,
       0.5,  -0.95,
       0.75, -0.85,
       1.0,  -0.9
    ]),
    n: 9,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var line_strip = {
    vertices: new Float32Array([
      -1.0,  0.9,
      -0.75, 0.85,
      -0.5,  0.95,
      -0.25, 0.85,
       0.0,  0.95,
       0.25, 0.85,
       0.5,  0.95,
       0.75, 0.85,
       1.0,  0.9
    ]),
    n: 9,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var triangle = {
    vertices: new Float32Array([
      -0.2,  0.0,
      -0.1,  0.2,
       0.0,  0.0
    ]),
    n: 3,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var triangle_strip = {
    vertices: new Float32Array([
      0.0,   0.1,
      0.2,   0.1,
      0.0,  -0.1,
      0.2,  -0.1
    ]),
    n: 4,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var triangle_fan = {
    vertices: new Float32Array([
      0.0,   0.0,
      0.426,  0.426,
      0.228,  0.552,
      0.0,   0.6,
     -0.228,  0.552,
     -0.426,  0.426,
     -0.6,   0.0,
     -0.552, -0.228,
     -0.426, -0.426,
     -0.228, -0.552,
      0.0,  -0.6,
      0.228, -0.552,
      0.426, -0.426,
      0,552, -0.228
    ]),
    n: 13,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var mouthA = {
    vertices: new Float32Array([
      0.0,   0.0,
      0.426, 0.426,
      0.552, 0.228
    ]),
    n: 3,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var mouthB = {
    vertices: new Float32Array([
      0.0,    0.0,
      0.426, -0.426,
      0.552, -0.228
    ]),
    n: 3,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  var nomButton = document.getElementById('nom');
  var om = 1;
  var nom = function() {
    if (om) {
      drawNom(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan, mouthA, mouthB, om);
      om = 0;
    }
    else {
      om = 1;
      gl.clear(gl.COLOR_BUFFER_BIT);
      drawScreen(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan);
    }
  }
  nomButton.onclick = nom;

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  shaderVars.u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!shaderVars.u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return;
  }

  shaderVars.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (shaderVars.a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  shaderVars.u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  if (shaderVars.u_Color < 0) {
    console.log('Failed to get the storage location of u_Color');
    return -1;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  var n = initObjects(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan, mouthA, mouthB);
  if (n < 0) {
    console.log('Failed to initialize objects');
    return;
  }
  else {
    // Draw all the things.
    drawScreen(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan);
  }
}

/**
 * drawnScreen - draw WebGL buffers for basic screen
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} points - the points to be drawn
 * @param {Object} lines- the lines to be drawn
 * @param {Object} line_loop - the line_loop to be drawn
 * @param {Object} line_strip - the line_strip to be drawn
 * @param {Object} triangle - the triangle to be drawn
 * @param {Object} triangle_strip - the triangle_strip to be drawn
 * @param {Object} triangle_fan - the triangle_fan to be drawn
 * @returns {Boolean}
 */
function drawScreen(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform4f(shaderVars.u_Color, 1.0, 0.0, 0.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, points.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, points.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.POINTS, 0, points.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, lines.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, lines.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINES, 0, lines.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, line_strip.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, line_strip.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_STRIP, 0, line_strip.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, line_loop.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, line_loop.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_LOOP, 0, line_loop.n);

  gl.uniform4f(shaderVars.u_Color, 0.1, 0.2, 0.3, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, triangle.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, triangle.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, triangle_fan.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle_fan.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, triangle_fan.n);

  gl.uniform4f(shaderVars.u_Color, 0.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, triangle_strip.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle_strip.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangle_strip.n);
}

/**
 * drawnNom - draw WebGL buffers for button
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} points - the points to be drawn
 * @param {Object} lines- the lines to be drawn
 * @param {Object} line_loop - the line_loop to be drawn
 * @param {Object} line_strip - the line_strip to be drawn
 * @param {Object} triangle - the triangle to be drawn
 * @param {Object} triangle_strip - the triangle_strip to be drawn
 * @param {Object} triangle_fan - the triangle_fan to be drawn
 * @param {Object} mouthA - the mouthA to be drawn
 * @param {Object} mouthB - the mouthB to be drawn
 * @returns {Boolean}
 */
function drawNom(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan, mouthA, mouthB, om) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform4f(shaderVars.u_Color, 1.0, 0.0, 0.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, points.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, points.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.POINTS, 0, points.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, lines.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, lines.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINES, 0, lines.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, line_strip.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, line_strip.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_STRIP, 0, line_strip.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, line_loop.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, line_loop.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_LOOP, 0, line_loop.n);

  gl.uniform4f(shaderVars.u_Color, 0.1, 0.2, 0.3, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, triangle.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, triangle.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, triangle_fan.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle_fan.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, triangle_fan.n);

  gl.uniform4f(shaderVars.u_Color, 0.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, triangle_strip.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle_strip.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, triangle_strip.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, om);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, mouthA.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, mouthA.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, mouthA.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, om);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, mouthB.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, mouthB.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, mouthB.n);
}

/**
 * initModels - initializes WebGL buffers for the the triangle & quad
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} points - the points to be rendered
 * @param {Object} lines- the lines to be rendered
 * @param {Object} line_loop - the line_loop to be rendered
 * @param {Object} line_strip - the line_strip to be rendered
 * @param {Object} triangle - the triangle to be rendered
 * @param {Object} triangle_strip - the triangle_strip to be rendered
 * @param {Object} triangle_fan - the triangle_fan to be rendered
 * @param {Object} mouthA - the mouthA to be rendered
 * @param {Object} mouthB - the mouthB to be rendered
 * @returns {Boolean}
 */
function initObjects(gl, shaderVars, points, lines, line_loop, line_strip, triangle, triangle_strip, triangle_fan, mouthA, mouthB) {

  points.buffer = gl.createBuffer();
  if (!points.buffer) {
    console.log('Points buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, points.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, points.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  points.modelMatrix.setTranslate(0.9, .6, 0);

  lines.buffer = gl.createBuffer();
  if (!lines.buffer) {
    console.log('Lines buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, lines.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, lines.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  lines.modelMatrix.setTranslate(0.0, -0.9, 0);

  line_loop.buffer = gl.createBuffer();
  if (!line_loop.buffer) {
    console.log('Lines_loop buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, line_loop.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, line_loop.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  line_loop.modelMatrix.setTranslate(0.0, 0.0, 0);

  line_strip.buffer = gl.createBuffer();
  if (!line_strip.buffer) {
    console.log('Line_strip buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, line_strip.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, line_strip.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  line_strip.modelMatrix.setTranslate(0.0, 0.0, 0);

  triangle.buffer = gl.createBuffer();
  if (!triangle.buffer) {
    console.log('Triangle buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangle.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  triangle.modelMatrix.setTranslate(-0.5, 0.5, 0);

  triangle_strip.buffer = gl.createBuffer();
  if (!triangle_strip.buffer) {
    console.log('Triangle_strip buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle_strip.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangle_strip.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  triangle_strip.modelMatrix.setTranslate(0.5, 0, 0);

  triangle_fan.buffer = gl.createBuffer();
  if (!triangle_fan.buffer) {
    console.log('Triangle_fan buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle_fan.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangle_fan.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  triangle_fan.modelMatrix.setTranslate(0.0, 0.0, 0);

  mouthA.buffer = gl.createBuffer();
  if (!mouthA.buffer) {
    console.log('mouthA buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, mouthA.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, mouthA.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  mouthA.modelMatrix.setTranslate(0.0, 0.0, 0);

  mouthB.buffer = gl.createBuffer();
  if (!mouthB.buffer) {
    console.log('mouthB buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, mouthB.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, mouthB.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  mouthB.modelMatrix.setTranslate(0.0, 0.0, 0);

  return true;
}
