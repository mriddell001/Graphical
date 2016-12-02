//Matthew Riddell
//Assignment 4

//Start Global Variables
var gScale = 0.0625;
var last = Date.now();
var gl;
var fTextures = [];
var ghosts = [];
var e_arr = [];
var pacman = [];
var points = [];
var map_array;
var texture0;
var texture1;
//End Global Variables

//Start Global Objects
var pm_loc = {
  x: 13,
  y: 17
};

var total_time = {
  universal_time: 0,
  om: 0,
  total: 0,
  last: 0,
  game_over: 0
};
//End Global Objects

function main() {
  // Vertex shader program
  var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'varying vec2 v_TexCoord;\n' +
    'attribute float a_PointSize;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_xformMatrix * a_Position;\n' +
    '  gl_PointSize = a_PointSize;\n' +
    '  v_TexCoord = a_TexCoord;\n' +
    '}\n';

  // Fragment shader program
  var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'uniform vec4 u_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = u_Color + texture2D(u_Sampler, v_TexCoord);\n' +
    '}\n';

  var shaderVars = {
    u_xformMatrix:0,
    a_Position:0,
    u_Color:0,
    a_PointSize:1,
    a_TexCoord:0,
    u_Sampler:0
  };

  //Array for Map
  map_array = {
    vertices: new Float32Array([
      0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
      0,  5,  3,  3,  3,  3,  7,  3,  3,  3,  3,  3,  6,  0,  0,  5,  3,  3,  3,  3,  3,  7,  3,  3,  3,  3,  6,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 12,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0, 12,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0, 12,  0,
      0, 13,  3,  3,  3,  3, 15,  3,  3,  7,  3,  3,  3,  3,  3, 11,  3,  3,  7,  3,  3, 15,  3,  3,  3,  3,  3,  0,
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
      0,  5,  3,  3,  3,  3, 15,  3,  3, 11,  3,  3,  6,  0,  0,  5,  3,  3, 11,  3,  3, 15,  3,  3,  3,  3,  6,  0,
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
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      n: 868,
      d: 306
  };//Size 28 x  31

  function point () {
    vertices = new Float32Array(2);
    modelMatrix = new Matrix4;
    buffer = 0;
    status = 1;
  }

  var index = 0;

  for (var gy = 0; gy < 31; gy++) {
    for (var gx = 0; gx < 28; gx++) {
      var current = map_array.dots[(28*gy+gx)];
      if (current == 1) {
        var tmp = new point();
        tmp.vertices.set([1,1], 0);
        points.push(new point());
        var x;
        var y;
        if (gx < 14) {x = (14-gx) * (-gScale);}
        else {x = (gx-14) * gScale;}
        if (gy < 16) {y = (15-gy) * gScale;}
        else {y = (gy - 16) * (-gScale);}
        points[index].vertices.set([x, y], 0);
        index++;
      }
    }
  }

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

  e_arr[0] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[1] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[2] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[3] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[4] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[5] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[6] = {modelMatrix: new Matrix4, buffer:0};
  e_arr[7] = {modelMatrix: new Matrix4, buffer:0};

  var ghost_base = {
    vertices: new Float32Array([
      0.0,     0.0,    -1.0,    -1.0,    -1.0,     0.0,    -0.98,    0.2,    -0.92,    0.38,
     -0.83,    0.55,   -0.71,    0.71,   -0.56,    0.83,   -0.38,    0.92,   -0.2,     0.98,
      0.0,     1.0,     0.2,     0.98,    0.38,    0.92,    0.56,    0.83,    0.71,    0.71,
      0.83,    0.55,    0.92,    0.38,    0.98,    0.2,     1.0,     0.0,     1.0,    -1.0,
      0.875,  -0.75,    0.75,   -1.0,     0.625,  -0.75,    0.5,    -1.0,     0.375,  -0.75,
      0.25,   -1.0,     0.125,  -0.75,    0.0,    -1.0,    -0.125,  -0.75,   -0.25,   -1.0,
     -0.375,  -0.75,   -0.5,    -1.0,    -0.625,  -0.75,   -0.75,   -1.0,    -0.875,  -0.75
    ]),
    n: 35
  };

  ghosts[0] = {modelMatrix: new Matrix4, dLast: -1, x: 13, y: 13, buffer: 0};   //Blinky
  ghosts[1] = {modelMatrix: new Matrix4, buffer: 0};                            //Pinky
  ghosts[2] = {modelMatrix: new Matrix4, buffer: 0};                            //Inky
  ghosts[3] = {modelMatrix: new Matrix4, buffer: 0};                            //Clyde

  //Pac-Man
  pacman[0] = {
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

  pacman[1] = {
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

  //Begin Texture Box Data
  fTextures[0] = {
    vertices: new Float32Array([
      1.0,       1.0,         1.0, 0.0,
      0.0,       1.0,         0.0, 0.0,
      1.0,       0.0,         1.0, 1.0,
      0.0,       0.0,         0.0, 1.0
    ]),
    n: 4,
    modelMatrix: new Matrix4,
    buffer: 0
  };
  fTextures[1] = {
    vertices: new Float32Array([
      1.0,       1.0,         1.0, 0.0,
      0.0,       1.0,         0.0, 0.0,
      1.0,       0.0,         1.0, 1.0,
      0.0,       0.0,         0.0, 1.0
    ]),
    n: 4,
    modelMatrix: new Matrix4,
    buffer: 0
  };

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
      -0.5000,  -0.4375,     -0.7500,  -0.4375,     -0.7500,  -0.4375,     -0.7500,  -0.5625, //Lshape - Bottom Left
      -0.7500,  -0.5625,     -0.6250,  -0.5625,     -0.6250,  -0.5625,     -0.6250,  -0.7500,
      -0.6250,  -0.7500,     -0.5000,  -0.7500,     -0.5000,  -0.7500,     -0.5000,  -0.4375,
       0.5000,  -0.4375,      0.7500,  -0.4375,      0.7500,  -0.4375,      0.7500,  -0.5625, //Lshape - Bottom Right
       0.7500,  -0.5625,      0.6250,  -0.5625,      0.6250,  -0.5625,      0.6250,  -0.7500,
       0.6250,  -0.7500,      0.5000,  -0.7500,      0.5000,  -0.7500,      0.5000,  -0.4375,
      -0.7500,  -0.8125,     -0.4375,  -0.8125,     -0.4375,  -0.8125,     -0.4375,  -0.6250,
      -0.4375,  -0.6250,     -0.3125,  -0.6250,     -0.3125,  -0.6250,     -0.3125,  -0.8125,
      -0.3125,  -0.8125,     -0.1250,  -0.8125,     -0.1250,  -0.8125,     -0.1250,  -0.9375,
      -0.1250,  -0.9375,     -0.7500,  -0.9375,     -0.7500,  -0.9375,     -0.7500,  -0.8125,
       0.7500,  -0.8125,      0.4375,  -0.8125,      0.4375,  -0.8125,      0.4375,  -0.6250,
       0.4375,  -0.6250,      0.3125,  -0.6250,      0.3125,  -0.6250,      0.3125,  -0.8125,
       0.3125,  -0.8125,      0.1250,  -0.8125,      0.1250,  -0.8125,      0.1250,  -0.9375,
       0.1250,  -0.9375,      0.7500,  -0.9375,      0.7500,  -0.9375,      0.7500,  -0.8125,

      -0.0625,   0.1250,      0.0625,   0.1250                                                 //Ghost box gate
    ]),
    n: 218,
    modelMatrix: new Matrix4,
    buffer: 0
  };

  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {console.log('Failed rendering context for WebGL');return;}

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {console.log('Failed to intialize shaders.');return;}

  shaderVars.a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

  shaderVars.u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!shaderVars.u_xformMatrix) {console.log('Failed u_xformMatrix');
    return;}

  shaderVars.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (shaderVars.a_Position < 0) {console.log('Failed a_Position');return -1;}

  shaderVars.u_Color = gl.getUniformLocation(gl.program, 'u_Color');
  if (shaderVars.u_Color < 0) {console.log('Failed u_Color');return -1;}

  shaderVars.a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
   if (shaderVars.a_TexCoord < 0) {console.log('Failed a_TexCoord');return -1;}

   shaderVars.u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
   if (!shaderVars.u_Sampler) {console.log('Failed u_Sampler');return false;}

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  var q = initObjects(shaderVars, ghost_base, eye_BL, eye_BR, border_segment, ghost_box, box_lines);

  if(!initTextures(shaderVars)){console.log('Failed texture');return;}

  document.onkeydown = handleKeyDown;

  if (q < 0) {
    console.log('Failed to initialize objects');
    return;
  }
  else {
    // Draw all the things.
    total_time.total *= 0.001;
    var tick = function() {
      if (total_time.game_over == 0) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        animate();
        render(shaderVars, ghost_base, eye_BL, eye_BR, border_segment, ghost_box, box_lines);
        requestAnimationFrame(tick, canvas);
      }
    };
    tick();
  }
}

function handleKeyDown(event)
{
  var direction = 4;
  var key = event.keyCode;
  switch (key) {
    case 65:
      direction = 0;
      break;
    case 68:
      direction = 1;
      break;
    case 87:
      direction = 2;
      break;
    case 83:
      direction = 3;
      break;
    default:
    //Do nothing.
  }
  console.log(key);
  if (direction != 4) {
    move_pacman(direction);
  }
}

/**
 * animate - draw WebGL buffers for basic screen
 * @returns {void}
*/
function animate() {
    var now = Date.now();
    //Conversion of time into seconds.
    now *= 0.001;
    var deltaTime = now - total_time.last;
    total_time.last = now;
    if (total_time.total + deltaTime > 0.5)
    {
      total_time.universal_time += 1;
      document.getElementById("Score").innerHTML = "Score: " + total_time.universal_time;
      if (pm_loc.x ==2 && pm_loc.y == 30) {document.getElementById("Score").innerHTML = "Score: " + (total_time.universal_time+100);}
      if (pm_loc.x ==27 && pm_loc.y == 30) {document.getElementById("Score").innerHTML = "Score: " + (total_time.universal_time+100);}

      total_time.total = 0;
      if (total_time.om == 1) {
        total_time.om = 0;
      }
      else {
        total_time.om = 1;
      }
      move_ghost();
      if (ghosts[0].x == pm_loc.x && ghosts[0].y == pm_loc.y) {alert("You lose!");total_time.game_over = 1;}
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
 * move_ghost - Function for moving ghosts[0] figure.
 * @returns {void}
*/
function move_ghost() {
  if (ghosts[0].dLast == -1) {
    if (total_time.universal_time > 3)
    {
      var b = 3*(32*gScale);
      var a = 0;
      ghosts[0].modelMatrix.translate(a, b, 0);
      ghosts[0].y = ghosts[0].y - 2;
      ghosts[0].dLast = 2;
    }
  }
  else {
    var a = 0;
    var b = 0;
    var x = pm_loc.x;
    var y = pm_loc.y;
    var gx = ghosts[0].x;
    var gy = ghosts[0].y;
    var last = ghosts[0].dLast;
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
      ghosts[0].dLast = 1;
      a = -32*gScale;
      ghosts[0].x -= 1;
    }
    else if (direction == 1 && e == 1) {
      ghosts[0].dLast = 0;
      a = 32*gScale;
      ghosts[0].x += 1;
    }
    else if (direction == 2 && n == 1) {
      ghosts[0].dLast = 3;
      b = 32*gScale;
      ghosts[0].y -= 1;
    }
    else if (direction == 3 && s == 1){
      ghosts[0].dLast = 2;
      b -=32*gScale;
      ghosts[0].y += 1;
    }
    ghosts[0].modelMatrix.translate(a, b, 0);
  }
}

/**
 * move_pacman - Function for moving player figure.
 * @param {Object} direction - Button pressed.
 * @returns {Boolean}
*/
function move_pacman(direction) {
  //Direction
  //0 = Left
  //1 = Right
  //2 = Up
  //3 = Down
  if (total_time.game_over == 0) {
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
  if (ghosts[0].x == pm_loc.x && ghosts[0].y == pm_loc.y) {alert("You lose!");total_time.game_over = 1;}
  pacman[0].modelMatrix.translate(a, b, 0);
  pacman[1].modelMatrix.translate(a, b, 0);
  }
}

/**
 * render - draw WebGL buffers for basic screen
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} ghost_base - the base information for ghosts
 * @param {Object} eye_BL - eye data left
 * @param {Object} eye_BR - eye data right
 * @param {Object} e_arr - all eye data
 * @param {Object} om
 * @returns {Boolean}
 */
function render(shaderVars, ghost_base, eye_BL,
                eye_BR, border_segment,
                ghost_box, box_lines) {
  gl.clear(gl.COLOR_BUFFER_BIT);

  /*for (var i = 0; i < map_array.n; i++) {
    gl.uniform4f(shaderVars.u_Color, 1.0, 0.0, 0.0, 1);
    gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, points.modelMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, points.buffer);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, points.n);
  }*/

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
    border_segment.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, border_segment.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, border_segment.buffer);
  gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_TexCoord);
  gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
  gl.bindBuffer(gl.ARRAY_BUFFER, border_segment.buffer);
  gl.drawArrays(gl.LINE_STRIP, 0, border_segment.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
    ghost_box.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, ghost_box.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, ghost_box.buffer);
  gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_TexCoord);
  gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
  gl.bindBuffer(gl.ARRAY_BUFFER, ghost_box.buffer);
  gl.drawArrays(gl.LINE_STRIP, 0, ghost_box.n);

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
    box_lines.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, box_lines.buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, box_lines.buffer);
  gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_TexCoord);
  gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
  gl.bindBuffer(gl.ARRAY_BUFFER, box_lines.buffer);
  gl.drawArrays(gl.LINES, 0, box_lines.n);

  for (var i = 0; i < 4; i++) {
    gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_TexCoord);
    switch (i) {
      case 0:
        gl.uniform4f(shaderVars.u_Color, 1.0, 0.3725, 0.3725, 1);
        break;
      case 1:
        gl.uniform4f(shaderVars.u_Color, 1.0, 0.7490, 1.0, 1);
        break;
      case 2:
        gl.uniform4f(shaderVars.u_Color, 1.0, 0.7216, 0.3176, 1);
        break;
      case 3:
        gl.uniform4f(shaderVars.u_Color, 0.0039, 1.0, 1.0, 1);
        break;
    }
    gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
      ghosts[i].modelMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, ghosts[i].buffer);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);
    gl.bindBuffer(gl.ARRAY_BUFFER, ghosts[i].buffer);
    gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
    gl.bindBuffer(gl.ARRAY_BUFFER, ghosts[i].buffer)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, ghost_base.n);
  }

  gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, 1);
  gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
    pacman[0].modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman[0].buffer);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman[0].buffer);
  gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_TexCoord);
  gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman[0].buffer)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, pacman[0].n);

  if (total_time.om == 1) {
   gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 0.0, 1);
   gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
     pacman[1].modelMatrix.elements);
   gl.bindBuffer(gl.ARRAY_BUFFER, pacman[1].buffer);
   gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(shaderVars.a_Position);
   gl.bindBuffer(gl.ARRAY_BUFFER, pacman[1].buffer);
   gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(shaderVars.a_TexCoord);
   gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
   gl.bindBuffer(gl.ARRAY_BUFFER, pacman[1].buffer)
   gl.drawArrays(gl.TRIANGLE_FAN, 0, pacman[1].n);
  }

  for (var i = 0; i < e_arr.length; i++) {
    gl.uniform4f(shaderVars.u_Color, 1.0, 1.0, 1.0, 1);
    gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
      e_arr[i].modelMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, e_arr[i].buffer);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, eye_BL.n);
  }

  for (var i = 0; i < 2; i++) {
    gl.uniform4f(shaderVars.u_Color, 0.0, 0.0, 0.0, 1);
    gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false,
      fTextures[i].modelMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, fTextures[i].buffer);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);
    gl.bindBuffer(gl.ARRAY_BUFFER, fTextures[i].buffer);
    gl.vertexAttribPointer(shaderVars.a_TexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_TexCoord);
    gl.vertexAttrib1f(shaderVars.a_PointSize, 10);
    gl.bindBuffer(gl.ARRAY_BUFFER, fTextures[i].buffer);
    gl.uniform1i(shaderVars.u_Sampler, i);
    if (g_texUnit0 == true && g_texUnit1 == true) {gl.drawArrays(gl.TRIANGLE_STRIP, 0, fTextures[i].n);}
  }

}

/**
 * initObjects - initializes WebGL buffers for the the objects
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVars - the locations of shader variables
 * @param {Object} e_arr - all eyes data
 * @param {Object} pinky - the triange_fan ghost pinky
 * @param {Object} inky - the triangle_fan ghost inky
 * @param {Object} clyde - the triangle_fan ghost clyde
 * @returns {Boolean}
 */
function initObjects(shaderVars, ghost_base, eye_BL, eye_BR, border_segment, ghost_box, box_lines) {
  //Points Data
  /*
  points.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, points.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, points.vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  points.modelMatrix.setTranslate(0.9, .6, 0);
  */

  //Ghost Data
  for (var i = 0; i < e_arr.length; i++) {
    e_arr[i].buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, e_arr[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, eye_BL.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);
    switch (i) {
      case 0:
        e_arr[i].modelMatrix.setTranslate(-gScale, 0.0, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 1:
        e_arr[i].modelMatrix.setTranslate(-gScale, -gScale, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 2:
        e_arr[i].modelMatrix.setTranslate(gScale, 0, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 3:
        e_arr[i].modelMatrix.setTranslate(gScale, -gScale, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 4:
        e_arr[i].modelMatrix.setTranslate(-gScale/1.5, 0, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 5:
        e_arr[i].modelMatrix.setTranslate(-gScale/1.5, -gScale, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 6:
        e_arr[i].modelMatrix.setTranslate(2*(gScale/1.5), 0, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      case 7:
        e_arr[i].modelMatrix.setTranslate(2*(gScale/1.5), -gScale, 0);
        e_arr[i].modelMatrix.scale(gScale/1.5, gScale/1.5, 1.0);
        break;
      default:
    }
  }

  for (var i = 0; i < 2; i++) {
    fTextures[i].buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, fTextures[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, fTextures[i].vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);
    if (i == 0) {fTextures[i].modelMatrix.setTranslate(-gScale*13+0.01, -gScale*16+0.01, 0);}
    else {fTextures[i].modelMatrix.setTranslate(gScale*12-0.01, -gScale*16+0.01, 0);}
    fTextures[i].modelMatrix.scale(gScale-0.01, gScale-0.01, 1.0);
  }

  for (var i = 0; i < 4; i++) {
    ghosts[i].buffer = gl.createBuffer();
    if (!ghosts[i].buffer) {
      console.log('ghosts[i] buffer objects failed to be created.');
      return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, ghosts[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ghost_base.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);
    switch (i) {
      case 0:
        ghosts[i].modelMatrix.setTranslate(-gScale/2, -gScale/2, 0);
        break;
      case 1:
        ghosts[i].modelMatrix.setTranslate(gScale/2, -gScale/2, 0);
        break;
      case 2:
        ghosts[i].modelMatrix.setTranslate(-gScale/2, -gScale*1.5, 0);
        break;
      case 3:
        ghosts[i].modelMatrix.setTranslate(gScale/2, -gScale*1.5, 0);
        break;
    }
    ghosts[i].modelMatrix.scale(gScale/2, gScale/2, 1.0);
  }

  //Pacman Data
  pacman[0].buffer = gl.createBuffer();
  if (!pacman[0].buffer) {
    console.log('Triangle_fan buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman[0].buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pacman[0].vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pacman[0].modelMatrix.setTranslate(-gScale/2, -gScale*3.5, 0);
  pacman[0].modelMatrix.scale(gScale/2, gScale/2, 1.0);

  pacman[1].buffer = gl.createBuffer();
  if (!pacman[1].buffer) {
    console.log('pacman[1] buffer objects failed to be created.');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, pacman[1].buffer);
  gl.bufferData(gl.ARRAY_BUFFER, pacman[1].vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(shaderVars.a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderVars.a_Position);
  pacman[1].modelMatrix.setTranslate(-gScale/2, -gScale*3.5, 0);
  pacman[1].modelMatrix.scale(gScale/2, gScale/2, 1.0);


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

/**
 * initTextures - loading textures for images.
 * @param {Object} gl - gl
 * @returns {Boolean}
*/
function initTextures(shaderVars) {
  var image0 = new Image();
  var image1 = new Image();
  for (var i = 0; i < 2; i++) {
    switch (i) {
      case 0:
        texture0 = gl.createTexture();
        if (!texture0) {console.log('Failed texture creation');return false;}
        break;
      case 1:
        texture1 = gl.createTexture();
        if (!texture1) {console.log('Failed texture creation');return false;}
        break;
      default:
        break;
    }
  }

  image0.onload = function() {loadTexture(texture0, image0, 0);};
  image1.onload = function() {loadTexture(texture1, image1, 1);};
  image0.src = './cherry.jpg';
  image1.src = './strawberry.jpg';
  return true;
}

var g_texUnit0 = false;
var g_texUnit1 = false;
/**
 * loadTexture - loading textures for images.
 * @param {Object} texture - created texture
 * @param {Object} u_Sampler - u_Sampler
 * @param {Object} image - image
 * @returns {Boolean}
*/
function loadTexture(texture, image, expr) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  if (expr == 0) {gl.activeTexture(gl.TEXTURE0);g_texUnit0 = true;}
  else {gl.activeTexture(gl.TEXTURE1);g_texUnit1 = true;}
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
}
