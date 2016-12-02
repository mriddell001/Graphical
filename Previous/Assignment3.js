//Matthew Riddell
//Assignment 3

/**
Next time, begin to plot the background and the start screen text. Draw a line segment for the start screen and double lines for the borders.
**/

var gScale = 0.0625;
var last = Date.now();

var pm_loc = {
  x: 13,
  y: 17
};

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

  //Array for Map
  var map_array = {
    vertices: new Float32Array([
      0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
      0,  5,  3,  3,  3,  3,  7,  3,  3,  3,  3,  3,  6,  0,  0,  5,  3,  3,  3,  3,  3,  7,  3,  3,  3,  3,  6,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 13,  3,  3,  3,  3, 15,  3,  3,  7,  3,  3,  3,  3,  3, 11,  3,  3,  7,  3,  3,  3,  3,  3,  3,  3,  3,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0,  9,  3,  3,  3,  3, 14,  0,  0,  9,  3,  3,  6,  0,  0,  5,  3,  3, 10,  0,  0, 13,  3,  3,  3,  3, 10,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0,  5,  3,  3, 11,  3,  3, 11,  3,  3,  6,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  8,  8,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  8,  8,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      3,  3,  3,  3,  3,  3, 15,  3,  3, 14,  0,  0,  0,  8,  8,  0,  0,  0, 13,  3,  3, 15,  3,  3,  3,  3,  3,  3,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 13,  3,  3,  3,  3,  3,  3,  3,  3, 14,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,
      0,  5,  3,  3,  3,  3, 15,  3,  3, 11,  3,  3,  6,  0,  0,  5,  3,  3,  3,  3,  3, 15,  3,  3,  3,  3,  6,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0,  9,  3,  6,  0,  0, 13,  3,  3,  7,  3,  3, 11,  3,  3, 11,  3,  3,  7,  3,  3, 14,  0,  0,  5,  3, 10,  0,
      0,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0,  0,
      0,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0, 12,  0,  0,  0,
      0,  5,  3, 11,  3,  3, 10,  0,  0,  9,  3,  3,  6,  0,  0,  5,  3,  3, 10,  0,  0,  9,  3,  3, 11,  3,  6,  0,
      0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12,  0,
      0,  9,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3, 11,  3,  3, 11,  3,  3,  3,  3,  3,  3,  3,  3,  3,  3, 11,  0,
      0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]),

    dots: new Float32Array([
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0,
      0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  };//Size 28 x  31

  //Ghost design.
  var eye_BL = {
    vertices: new Float32Array([
      -0.25,  0.25,     -0.5,   0.25,     -0.43,  0.43,     -0.25,  0.5,     -0.07,  0.43,
       0.0,   0.25,     -0.07,  0.07,     -0.25,  0.0,      -0.43,  0.07,    -0.5,   0.25
    ]),
    n: 10
  };

  var eye_BR = {
    vertices: new Float32Array([
      0.25,  0.25,      0.5,   0.25,      0.43,  0.43,      0.25,  0.5,       0.07,  0.43,
      0.0,   0.25,      0.07,  0.07,      0.25,  0.0,       0.43,  0.07,      0.5,   0.25
    ]),
    n: 10
  };

  var bl = {modelMatrix: new Matrix4, buffer:0};
  var br = {modelMatrix: new Matrix4, buffer:0};
  var pl = {modelMatrix: new Matrix4, buffer:0};
  var pr = {modelMatrix: new Matrix4, buffer:0};
  var il = {modelMatrix: new Matrix4, buffer:0};
  var ir = {modelMatrix: new Matrix4, buffer:0};
  var cl = {modelMatrix: new Matrix4, buffer:0};
  var cr = {modelMatrix: new Matrix4, buffer:0};

  var ghost_base = {
    vertices: new Float32Array([
      0.0,     0.0,    -1.0,    -1.0,    -1.0,     0.0,    -0.98,    0.2,    -0.92,  0.38,
     -0.83,    0.55,   -0.71,    0.71,   -0.56,    0.83,   -0.38,    0.92,   -0.2,  0.98,
      0.0,     1.0,     0.2,     0.98,    0.38,    0.92,    0.56,    0.83,    0.71,  0.71,
      0.83,    0.55,    0.92,    0.38,    0.98,    0.2,     1.0,     0.0,     1.0,  -1.0,
      0.875,  -0.75,    0.75,   -1.0,     0.625,  -0.75,    0.5,    -1.0,     0.375,  -0.75,
      0.25,   -1.0,     0.125,  -0.75,    0.0,    -1.0,    -0.125,  -0.75,   -0.25,  -1.0,
     -0.375,  -0.75,   -0.5,    -1.0,    -0.625,  -0.75,   -0.75,   -1.0,    -0.875,  -0.75
    ]),
    n: 35
  };

  var blinky = {modelMatrix: new Matrix4, dLast: -1, x: 13, y: 13, buffer: 0};
  var pinky = {modelMatrix: new Matrix4, buffer: 0};
  var inky = {modelMatrix: new Matrix4, buffer: 0};
  var clyde = {modelMatrix: new Matrix4, buffer: 0};

  //Pac-Man
  var pacman_fan = {
    vertices: new Float32Array([
      0.0,   0.0,      0.71,  0.71,      0.38,  0.92,      0.0,   1.0,
     -0.38,  0.92,    -0.71,  0.71,     -1.0,   0.0,      -0.92, -0.38,
     -0.71, -0.71,    -0.38, -0.92,      0.0,  -1.0,       0.38, -0.92,
      0.71, -0.71
    ]),
    n: 13,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var pacman_mouth = {
    vertices: new Float32Array([
      0.0,   0.0,
      0.71,  0.71,
      0.92,  0.38,
      0.0,   0.0,
      0.71, -0.71,
      0.92, -0.38
    ]),
    n: 6,
    modelMatrix: new Matrix4,
    buffer: 0
  };
  //End Pacman Data

  //Begin Border Data
  var border_segment = {
    vertices: new Float32Array([
       0.8750,   0.0000,      0.8750,  -0.0625,      0.5000,  -0.0625,      0.5000,  -0.3750,      0.8125,  -0.3750,
       0.8125,  -0.6250,      0.6875,  -0.6250,      0.6875,  -0.7500,      0.8125,  -0.7500,      0.8125,  -1.0000,
      -0.8125,  -1.0000,     -0.8125,  -0.7500,     -0.6925,  -0.7500,     -0.6925,  -0.6250,     -0.6925,  -0.6250,
      -0.8125,  -0.6250,     -0.8125,  -0.3750,     -0.5000,  -0.3750,     -0.5000,  -0.0625,     -0.8750,  -0.0625,
      -0.8750,   0.0000,     -0.5000,   0.0000,     -0.5000,   0.3125,     -0.8125,   0.3125,     -0.8125,   0.8125,
      -0.0625,   0.8125,     -0.0625,   0.5625,      0.0625,   0.5625,      0.0625,   0.8125,      0.8125,   0.8125,
       0.8125,   0.3125,      0.5000,   0.3125,      0.5000,   0.0000,      0.8750,   0.0000
    ]),
    n: 34,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var ghost_box = {
    vertices: new Float32Array([
      -0.0625,   0.0625,     -0.0625,   0.1250,     -0.2500,   0.1250,     -0.2500,  -0.1875,
       0.2500,  -0.1875,      0.2500,   0.1250,      0.0625,   0.1250,      0.0625,   0.0625,
       0.1875,   0.0625,      0.1875,  -0.1250,     -0.1875,  -0.1250,     -0.1875,   0.0625,
      -0.0625,   0.0625
    ]),
    n: 13,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var box_lines = {
    vertices: new Float32Array([
      -0.7500,   0.3750,     -0.5000,   0.3750,     -0.5000,   0.3750,     -0.5000,   0.5000, //Box - Top Left
      -0.5000,   0.5000,     -0.7500,   0.5000,     -0.7500,   0.5000,     -0.7500,   0.3750,
      -0.7500,   0.5625,     -0.5000,   0.5625,     -0.5000,   0.5625,     -0.5000,   0.7500, //Box - Middle Left
      -0.5000,   0.7500,     -0.7500,   0.7500,     -0.7500,   0.7500,     -0.7500,   0.5625,
      -0.4375,   0.5625,     -0.1250,   0.5625,     -0.1250,   0.5625,     -0.1250,   0.7500, //Box - Left Middle
      -0.1250,   0.7500,     -0.4375,   0.7500,     -0.4375,   0.7500,     -0.4375,   0.5625,
       0.7500,   0.3750,      0.5000,   0.3750,      0.5000,   0.3750,      0.5000,   0.5000, //Box - Top Right
       0.5000,   0.5000,      0.7500,   0.5000,      0.7500,   0.5000,      0.7500,   0.3750,
       0.4375,   0.5625,      0.1250,   0.5625,      0.1250,   0.5625,      0.1250,   0.7500, //Box - Middle Right
       0.1250,   0.7500,      0.4375,   0.7500,      0.4375,   0.7500,      0.4375,   0.5625,
       0.7500,   0.5625,      0.5000,   0.5625,      0.5000,   0.5625,      0.5000,   0.7500, //Box - Right Middle
       0.5000,   0.7500,      0.7500,   0.7500,      0.7500,   0.7500,      0.7500,   0.5625,
      -0.2500,   0.5000,      0.2500,   0.5000,      0.2500,   0.5000,      0.2500,   0.3750, //Tshape - Top Middle
       0.2500,   0.3750,      0.0625,   0.3750,      0.0625,   0.3750,      0.0625,   0.1875,
       0.0625,   0.1875,     -0.0625,   0.1875,     -0.0625,   0.1875,     -0.0625,   0.3750,
      -0.0625,   0.3750,     -0.2500,   0.3750,     -0.2500,   0.3750,     -0.2500,   0.5000,
      -0.4375,   0.5000,     -0.3125,   0.5000,     -0.3125,   0.5000,     -0.3125,   0.3125, //Tshape - Top Left
      -0.3125,   0.3125,     -0.1250,   0.3125,     -0.1250,   0.3125,     -0.1250,   0.1875,
      -0.1250,   0.1875,     -0.3125,   0.1875,     -0.3125,   0.1875,     -0.3125,   0.0000,
      -0.3125,   0.0000,     -0.4375,   0.0000,     -0.4375,   0.0000,     -0.4375,   0.5000,
       0.4375,   0.5000,      0.3125,   0.5000,      0.3125,   0.5000,      0.3125,   0.3125, //Tshape - Top Right
       0.3125,   0.3125,      0.1250,   0.3125,      0.1250,   0.3125,      0.1250,   0.1875,
       0.1250,   0.1875,      0.3125,   0.1875,      0.3125,   0.1875,      0.3125,   0.0000,
       0.3125,   0.0000,      0.4375,   0.0000,      0.4375,   0.0000,      0.4375,   0.5000,
       0.4375,  -0.0625,      0.3125,  -0.0625,      0.3125,  -0.0625,      0.3125,  -0.3750, //Box - Middle Right
       0.3125,  -0.3750,      0.4375,  -0.3750,      0.4375,  -0.3750,      0.4375,  -0.0625,
      -0.4375,  -0.0625,     -0.3125,  -0.0625,     -0.3125,  -0.0625,     -0.3125,  -0.3750, //Box - Middle Right
      -0.3125,  -0.3750,     -0.4375,  -0.3750,     -0.4375,  -0.3750,     -0.4375,  -0.0625,
      -0.2500,  -0.2500,      0.2500,  -0.2500,      0.2500,  -0.2500,      0.2500,  -0.3750, //Tshape - Middle Middle
       0.2500,  -0.3750,      0.0625,  -0.3750,      0.0625,  -0.3750,      0.0625,  -0.5625,
       0.0625,  -0.5625,     -0.0625,  -0.5625,     -0.0625,  -0.5625,     -0.0625,  -0.3750,
      -0.0625,  -0.3750,     -0.2500,  -0.3750,     -0.2500,  -0.3750,     -0.2500,  -0.2500,
      -0.4375,  -0.4375,     -0.1250,  -0.4375,     -0.1250,  -0.4375,     -0.1250,  -0.5625, //Box - Bottom left
      -0.1250,  -0.5625,     -0.4375,  -0.5625,     -0.4375,  -0.5625,     -0.4375,  -0.4375,
       0.4375,  -0.4375,      0.1250,  -0.4375,      0.1250,  -0.4375,      0.1250,  -0.5625, //Box - Bottom Right
       0.1250,  -0.5625,      0.4375,  -0.5625,      0.4375,  -0.5625,      0.4375,  -0.4375,
      -0.2500,  -0.6250,      0.2500,  -0.6250,      0.2500,  -0.6250,      0.2500,  -0.7500, //tSHAPE - Bottom Middle
       0.2500,  -0.7500,      0.0625,  -0.7500,      0.0625,  -0.7500,      0.0625,  -0.9375,
       0.0625,  -0.9375,     -0.0625,  -0.9375,     -0.0625,  -0.9375,     -0.0625,  -0.7500,
      -0.0625,  -0.7500,     -0.2500,  -0.7500,     -0.2500,  -0.7500,     -0.2500,  -0.6250,
      -0.5000,  -0.4375,     -0.7500,  -0.4375,      -0.7500,  -0.4375,     -0.7500,  -0.5625, //Lshape - Bottom Left
      -0.7500,  -0.5625,     -0.6250,  -0.5625,      -0.6250,  -0.5625,     -0.6250,  -0.7500,
      -0.6250,  -0.7500,     -0.5000,  -0.7500,      -0.5000,  -0.7500,     -0.5000,  -0.4375,
       0.5000,  -0.4375,      0.7500,  -0.4375,       0.7500,  -0.4375,      0.7500,  -0.5625, //Lshape - Bottom Right
       0.7500,  -0.5625,      0.6250,  -0.5625,       0.6250,  -0.5625,      0.6250,  -0.7500,
       0.6250,  -0.7500,      0.5000,  -0.7500,       0.5000,  -0.7500,      0.5000,  -0.4375,
      -0.7500,  -0.8125,     -0.4375,  -0.8125,      -0.4375,  -0.8125,     -0.4375,  -0.6250,
      -0.4375,  -0.6250,     -0.3125,  -0.6250,      -0.3125,  -0.6250,     -0.3125,  -0.8125,
      -0.3125,  -0.8125,     -0.1250,  -0.8125,      -0.1250,  -0.8125,     -0.1250,  -0.9375,
      -0.1250,  -0.9375,     -0.7500,  -0.9375,      -0.7500,  -0.9375,     -0.7500,  -0.8125,
       0.7500,  -0.8125,      0.4375,  -0.8125,       0.4375,  -0.8125,      0.4375,  -0.6250,
       0.4375,  -0.6250,      0.3125,  -0.6250,       0.3125,  -0.6250,      0.3125,  -0.8125,
       0.3125,  -0.8125,      0.1250,  -0.8125,       0.1250,  -0.8125,      0.1250,  -0.9375,
       0.1250,  -0.9375,      0.7500,  -0.9375,       0.7500,  -0.9375,      0.7500,  -0.8125
    ]),
    n: 216,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  var total_time = {
    universal_time: 0,
    om: 0,
    total: 0,
    last: 0
  };

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

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

  var q = initObjects( gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines);

  var lButt = document.getElementById('lb');
  var lFun = function() {
    move_pacman(pacman_fan, pacman_mouth, 0, map_array);
    gl.clear(gl.COLOR_BUFFER_BIT);
    render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, total_time);
  }
  lButt.onclick = lFun;

  var rButt = document.getElementById('rb');
  var rFun = function() {
     move_pacman(pacman_fan, pacman_mouth, 1, map_array);
    gl.clear(gl.COLOR_BUFFER_BIT);
    render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, total_time);
  }
  rButt.onclick = rFun;

  var uButt = document.getElementById('ub');
  var uFun = function() {
    move_pacman(pacman_fan, pacman_mouth, 2, map_array);
    gl.clear(gl.COLOR_BUFFER_BIT);
    render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, total_time);
  }
  uButt.onclick = uFun;

  var dButt = document.getElementById('db');
  var dFun = function() {
    move_pacman(pacman_fan, pacman_mouth, 3, map_array);
    gl.clear(gl.COLOR_BUFFER_BIT);
    render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, total_time);
  }
  dButt.onclick = dFun;

  if (q < 0) {
    console.log('Failed to initialize objects');
    return;
  }
  else {
    // Draw all the things.
    total_time.total *= 0.001;
    var tick = function() {
      gl.clear(gl.COLOR_BUFFER_BIT);
         animate(pm_loc, map_array, blinky, total_time);
      render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, total_time);
      requestAnimationFrame(tick, canvas);
     };
    tick();
    //render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, om);
  }
}

/**
 * animate - draw WebGL buffers for basic screen
 * @param {Object} om - variable to calculate if pacman's mouth should be open or closed.
 * @param {Object} last - variable representing seconds since last call
 * @param {Object} total - variable representing seconds since last change
 * @returns {Boolean}
*/
function animate(pm_loc, map_array, blinky, total_time) {
    var now = Date.now();
    //Conversion of time into seconds.
    now *= 0.001;
    var deltaTime = now - total_time.last;
    total_time.last = now;
    if (total_time.total + deltaTime > 0.5)
    {
      total_time.universal_time += 1;
      document.getElementById("Score").innerHTML = "Score: " + total_time.universal_time;

      total_time.total = 0;
      if (total_time.om == 1) {
        total_time.om = 0;
      }
      else {
        total_time.om = 1;
      }
      move_ghost(total_time, map_array, pm_loc, blinky);
      if (blinky.x == pm_loc.x && blinky.y == pm_loc.y) {alert("You lose!");}
    }
    else {
      total_time.total += deltaTime;
    }
}

/**
 * direction_check - Check paramaters for travel.
 * @param {Object} a - The preferred direction.
 * @param {Object} n - access North
 * @param {Object} s - access South
 * @param {Object} w - access West
 * @param {Object} e - access East
 * @param {Object} last - direction of previous travel
 * @returns {Int}
*/
function direction_check(a, n, s, w, e, last) {
  if (a == last) {return 0;}
  switch (a) {
    case 0:
      if (w == 1) {return 1;}
      else {return 0;}
      break;
    case 1:
      if (e == 1) {return 1;}
      else {return 0;}
      break;
    case 2:
      if (n == 1) {return 1;}
      else {return 0;}
      break;
    case 3:
      if (s == 1) {return 1;}
      else {return 0;}
      break;
  }
}

/**
 * move_ghost - Function for moving blinky figure.
 * @param {Object} total_time - Time data.
 * @param {Object} map_array - Map data.
 * @param {Object} pm_loc - Player data.
 * @param {Object} blinky - Blinky data.
 * @returns {Boolean}
*/
function move_ghost(total_time, map_array, pm_loc, blinky) {
  if (blinky.dLast == -1) {
    if (total_time.universal_time > 3)
    {
      var b = 3*(32*gScale);
      var a = 0;
      blinky.modelMatrix.translate(a, b, 0);
      blinky.y = blinky.y - 2;
      blinky.dLast = 2;
    }
  }
  else {
    var a = 0;
    var b = 0;
    var x = pm_loc.x;
    var y = pm_loc.y;
    var gx = blinky.x;
    var gy = blinky.y;
    var last = blinky.dLast;
    var direction = 0;
    var ns = 0;
    var ss = 0;
    var ws = 0;
    var es = 0;

    var pref_array = [];

    var n_dx = x - gx;
    var n_dy = y - (gy-1);
    var nz = Math.sqrt(Math.pow(n_dx,2) + Math.pow(n_dy,2));
    pref_array.push(nz);

    var s_dx = x - gx;
    var s_dy = y - (gy+1);
    var sz = Math.sqrt(Math.pow(s_dx,2) + Math.pow(s_dy,2));
    pref_array.push(sz);

    var w_dx = x - (gx-1);
    var w_dy = y - gy;
    var wz = Math.sqrt(Math.pow(w_dx,2) + Math.pow(w_dy,2));
    pref_array.push(wz);

    var e_dx = x - (gx+1);
    var e_dy = y - gy;
    var ez = Math.sqrt(Math.pow(e_dx,2) + Math.pow(e_dy,2));
    pref_array.push(ez);

    pref_array = pref_array.sort();

    var first;
    var second;
    var third;
    var fourth;

    for (var i = 0; i < 4; i++) {
      switch (i) {
        case 0:
          if (pref_array[i] == nz && ns == 0) {first = 2; ns = 1;}
          else if (pref_array[i] == sz && ss == 0) {first = 3; ss = 1;}
          else if (pref_array[i] == wz && ws == 0) {first = 0; ws = 1;}
          else if (pref_array[i] == ez && es == 0){first = 1; es = 1;}
          break;
        case 1:
          if (pref_array[i] == nz && ns == 0) {second = 2; ns = 1;}
          else if (pref_array[i] == sz && ss == 0) {second = 3; ss = 1;}
          else if (pref_array[i] == wz && ws == 0) {second = 0; ws = 1;}
          else if (pref_array[i] == ez && es == 0){second = 1; es = 1;}
          break;
        case 2:
          if (pref_array[i] == nz && ns == 0) {third = 2; ns = 1;}
          else if (pref_array[i] == sz && ss == 0) {third = 3; ss = 1;}
          else if (pref_array[i] == wz && ws == 0) {third = 0; ws = 1;}
          else if (pref_array[i] == ez && es == 0){third = 1; es = 1;}
          break;
        case 3:
          if (pref_array[i] == nz && ns == 0) {fourth = 2; ns = 1;}
          else if (pref_array[i] == sz && ss == 0) {fourth = 3; ss = 1;}
          else if (pref_array[i] == wz && ws == 0) {fourth = 0; ws = 1;}
          else if (pref_array[i] == ez && es == 0){fourth = 1; es = 1;}
          break;
        default:
      }
    }
    //Check to see if the preferred direction is possible.
    var l = map_array.vertices[(28*gy+gx)];
    var n = 0;
    var s = 0;
    var w = 0;
    var e = 0;

    if (l == 3 || l == 6 || l == 7 || l == 10 || l == 11 || l == 14 || l == 15) {w = 1;}
    if (l == 3 || l == 5 || l == 7 || l == 9 || l == 11 || l == 13 || l == 15) {e = 1;}
    if (l == 8 || l == 9 || l == 10 || l == 11 || l == 12 || l == 13 || l == 14 || l == 15) {n = 1;}
    if (l == 5 || l == 6 || l == 7 || l == 12 || l == 13 || l == 14 || l == 15) {s = 1;}

    direction = first;
    if (direction_check(direction, n, s, w, e, last) == 0) {
      direction = second;
      if (direction_check(direction, n, s, w, e, last) == 0) {
        direction = third;
        if (direction_check(direction, n, s, w, e, last) == 0) {
          direction = fourth;
        }
      }
    }

    if (direction == 0 && w == 1) {
      blinky.dLast = 1;
      a = -32*gScale;
      blinky.x -= 1;
    }
    else if (direction == 1 && e == 1) {
      blinky.dLast = 0;
      a = 32*gScale;
      blinky.x += 1;
    }
    else if (direction == 2 && n == 1) {
      blinky.dLast = 3;
      b = 32*gScale;
      blinky.y -= 1;
    }
    else if (direction == 3 && s == 1){
      blinky.dLast = 2;
      b -=32*gScale;
      blinky.y += 1;
    }
    blinky.modelMatrix.translate(a, b, 0);
  }
}

/**
 * move_pacman - Function for moving player figure.
 * @param {Object} pacman_fan - Player avatar data.
 * @param {Object} pacman_mouth - Player avatar mouth data.
 * @param {Object} direction - Button pressed.
 * @param {Object} map_array - Map data.
 * @returns {Boolean}
*/
function move_pacman(pacman_fan, pacman_mouth, direction, map_array) {
  //Direction
  //0 = Left
  //1 = Right
  //2 = Up
  //3 = Down

  var vert = map_array.vertices;
  var a = 0;
  var b = 0;
  var lon = pm_loc.x;
  var lat = pm_loc.y;


  var i = 28*lat + lon;
  map_array.dots[i] = 0;
  var l = vert[i];
  var n = 0;
  var s = 0;
  var w = 0;
  var e = 0;

  if (l == 3 || l == 6 || l == 7 || l == 10 || l == 11 || l == 14 || l == 15) {w = 1;}
  if (l == 3 || l == 5 || l == 7 || l == 9 || l == 11 || l == 13 || l == 15) {e = 1;}
  if (l == 8 || l == 9 || l == 10 || l == 11 || l == 12 || l == 13 || l == 14 || l == 15) {n = 1;}
  if (l == 5 || l == 6 || l == 7 || l == 12 || l == 13 || l == 14 || l == 15) {s = 1;}

  if (direction == 0 && w == 1) {
    a = -32*gScale;
    pm_loc.x -= 1;
  }
  else if (direction == 1 && e == 1) {
    a = 32*gScale;
    pm_loc.x = lon + 1;
  }
  else if (direction == 2 && n == 1) {
    b = 32*gScale;
    pm_loc.y -= 1;
  }
  else if (direction == 3 && s == 1){
    b -=32*gScale;
    pm_loc.y += 1;
  }
  pacman_fan.modelMatrix.translate(a, b, 0);
  pacman_mouth.modelMatrix.translate(a, b, 0);

}

/**
 * render - draw WebGL buffers for basic screen
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} pacman_fan -
 * @param {Object} pacman_mouth -
 * @param {Object} ghost_base -
 * @param {Object} eye_BL -
 * @param {Object} eye_BR -
 * @param {Object} bl -
 * @param {Object} br -
 * @param {Object} pl -
 * @param {Object} pr -
 * @param {Object} il -
 * @param {Object} ir -
 * @param {Object} cl -
 * @param {Object} cr -
 * @param {Object} blinky - the triange_fan ghost blinky
 * @param {Object} pinky - the triange_fan ghost pinky
 * @param {Object} inky - the triangle_fan ghost inky
 * @param {Object} clyde - the triangle_fan ghost clyde
 * @param {Object} om
 * @returns {Boolean}
 */
function render(gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines, total_time) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, border_segment.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, border_segment.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_STRIP, 0, border_segment.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, ghost_box.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, ghost_box.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_STRIP, 0, ghost_box.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, box_lines.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, box_lines.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINES, 0, box_lines.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 0.3725, 0.3725, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, blinky.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, blinky.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost_base.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 0.7490, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, pinky.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, pinky.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost_base.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 0.7216, 0.3176, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, inky.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, inky.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost_base.n);

  gl.uniform4f(shaderVars.u_Color, 0.0039, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, clyde.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, clyde.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost_base.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, pacman_fan.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman_fan.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, pacman_fan.n);

  if (total_time.om == 1) {
   gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, 1);
   gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, pacman_mouth.modelMatrix.elements);
   gl.bindBuffer(gl.ARRAY_BUFFER, pacman_mouth.buffer);
   gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
   gl.drawArrays(gl.TRIANGLE_FAN, 0, pacman_mouth.n);
  }

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, bl.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, bl.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BL.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, br.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, br.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BR.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, pl.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, pl.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BL.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, pr.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, pr.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BR.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, il.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, il.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BL.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, ir.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, ir.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BR.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, cl.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, cr.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BL.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, cr.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, cr.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BR.n);
}

/**
 * initModels - initializes WebGL buffers for the the triangle & quad
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} pacman_fan - the triangle_fan to be rendered
 * @param {Object} pacman_mouth - the pacman_mouth to be rendered
 * @param {Object} blinky - the triange_fan ghost blinky
 * @param {Object} pinky - the triange_fan ghost pinky
 * @param {Object} inky - the triangle_fan ghost inky
 * @param {Object} clyde - the triangle_fan ghost clyde
 * @returns {Boolean}
 */
function initObjects( gl, shaderVars, pacman_fan, pacman_mouth, ghost_base, eye_BL, eye_BR, bl, br, pl, pr, il, ir, cl, cr, blinky, pinky, inky, clyde, border_segment, ghost_box, box_lines) {
  //Ghost Data
  bl.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bl.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  bl.modelMatrix.setTranslate(-gScale, 0.0, 0);
  bl.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  pl.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pl.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pl.modelMatrix.setTranslate(-gScale, -gScale, 0);
  pl.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  il.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, il.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  il.modelMatrix.setTranslate(gScale, 0, 0);
  il.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  cl.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cl.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  cl.modelMatrix.setTranslate(gScale, -gScale, 0);
  cl.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  br.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, br.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  br.modelMatrix.setTranslate(-gScale/1.5, 0, 0);
  br.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  pr.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pr.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pr.modelMatrix.setTranslate(-gScale/1.5, -gScale, 0);
  pr.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  ir.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, ir.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  ir.modelMatrix.setTranslate(2*(gScale/1.5), 0, 0);
  ir.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);

  cr.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cr.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  cr.modelMatrix.setTranslate(2*(gScale/1.5), -gScale, 0);
  cr.modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);


  if (!bl.buffer || !br.buffer || !pl.buffer || !pr.buffer || !il.buffer || !ir.buffer || !cl.buffer || !cr.buffer)
  {
    console.log('One or more eye buffer object failed to be created.');
    return false;
  }

  blinky.buffer = gl.createBuffer();
  if (!blinky.buffer) {
    console.log('blinky buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, blinky.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, ghost_base.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  blinky.modelMatrix.setTranslate(-gScale/2, -gScale/2, 0);
  blinky.modelMatrix.scale(gScale/2, gScale/2, 1.0);

  pinky.buffer = gl.createBuffer();
  if (!pinky.buffer) {
    console.log('pinky buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, pinky.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, ghost_base.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pinky.modelMatrix.setTranslate(gScale/2, -gScale/2, 0);
  pinky.modelMatrix.scale(gScale/2, gScale/2, 1.0);

  inky.buffer = gl.createBuffer();
  if (!inky.buffer) {
    console.log('inky buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, inky.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, ghost_base.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  inky.modelMatrix.setTranslate(-gScale/2, -gScale*1.5, 0);
  inky.modelMatrix.scale(gScale/2, gScale/2, 1.0);

  clyde.buffer = gl.createBuffer();
  if (!clyde.buffer) {
    console.log('clyde buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, clyde.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, ghost_base.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  clyde.modelMatrix.setTranslate(gScale/2, -gScale*1.5, 0);
  clyde.modelMatrix.scale(gScale/2, gScale/2, 1.0);

  //Pacman Data
  pacman_fan.buffer = gl.createBuffer();
  if (!pacman_fan.buffer) {
    console.log('Triangle_fan buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman_fan.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pacman_fan.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pacman_fan.modelMatrix.setTranslate(-gScale/2, -gScale*3.5, 0);
  pacman_fan.modelMatrix.scale(gScale/2, gScale/2, 1.0);

  pacman_mouth.buffer = gl.createBuffer();
  if (!pacman_mouth.buffer) {
    console.log('pacman_mouth buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman_mouth.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pacman_mouth.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pacman_mouth.modelMatrix.setTranslate(-gScale/2, -gScale*3.5, 0);
  pacman_mouth.modelMatrix.scale(gScale/2, gScale/2, 1.0);


  //Border Data
  border_segment.buffer = gl.createBuffer();
  if (!border_segment.buffer) {
    console.log('border_segment buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, border_segment.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, border_segment.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  border_segment.modelMatrix.setTranslate(0.0, 0.0, 0);

  ghost_box.buffer = gl.createBuffer();
  if (!ghost_box.buffer) {
    console.log('ghost_box buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, ghost_box.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, ghost_box.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  ghost_box.modelMatrix.setTranslate(0.0, 0.0, 0);

  box_lines.buffer = gl.createBuffer();
  if (!box_lines.buffer) {
    console.log('box_lines buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, box_lines.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, box_lines.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  box_lines.modelMatrix.setTranslate(0.0, 0.0, 0);

  return true;
}
