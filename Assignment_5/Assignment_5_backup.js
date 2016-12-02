//mriddell

var base_block = [];

//POV
var pov = {
  viewMatrix: new Matrix4(),
  projMatrix: new Matrix4(),
  angle:0,
  g_eyeX:0,
  g_eyeY:0,
  g_eyeZ:0
};

//Single Cube Data
var base_data = {
  vertices: new Float32Array ([
    -0.5,  0.5,  0.5,     -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,     -0.5,  0.5,  0.5,
     0.5, -0.5,  0.5,      0.5,  0.5,  0.5,

     0.5,  0.5,  0.5,      0.5, -0.5,  0.5,
     0.5, -0.5, -0.5,      0.5,  0.5,  0.5,
     0.5, -0.5, -0.5,      0.5,  0.5, -0.5,

     0.5, -0.5,  0.5,     -0.5, -0.5,  0.5,
    -0.5, -0.5, -0.5,      0.5, -0.5,  0.5,
    -0.5, -0.5, -0.5,      0.5, -0.5, -0.5,

     0.5,  0.5, -0.5,     -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,      0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,      0.5,  0.5,  0.5,

    -0.5, -0.5, -0.5,     -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,     -0.5, -0.5, -0.5,
     0.5,  0.5, -0.5,      0.5, -0.5, -0.5,

    -0.5,  0.5, -0.5,     -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,     -0.5,  0.5, -0.5,
    -0.5, -0.5,  0.5,     -0.5,  0.5,  0.5
  ]),
  n: 36
};

//Ground Plane
var base_plane = {
  vertices: new Float32Array([
    -100.0,  -0.5, -100.0,   0.0, 0.0,
     100.0,  -0.5, -100.0,   1.0, 0.0,
     100.0,  -0.5,  100.0,   1.0, 1.0,
    -100.0,  -0.5,  100.0,   0.0, 1.0,
  ]),
  n:4,
  buffer:0
};

var shaderVars = {
  a_Position:0,
  u_Color:0,
  //u_ModelMatrix:0
  a_TexCoord:0,
  u_MvpMatrix: new Matrix4(),
  viewMatrix: new Matrix4(),
  canvasSize:0,
  t_load:false
};

// Vertex shader program
var CUBE_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var CUBE_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// Vertex & Fragment Shader Programs for Base Plane
var PLANE_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
    'gl_Position = u_MvpMatrix * a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n' +
  '}\n';
var PLANE_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
    'vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
    'gl_FragColor = color;\n' +
  '}\n';

function main() {

  //Section for main variables.
  base_block[0] = {modelMatrix: new Matrix4, buffer:0, colorBuffer:0}; //Blade 0
  base_block[1] = {modelMatrix: new Matrix4, buffer:0, colorBuffer:0}; //Blade 1
  base_block[2] = {modelMatrix: new Matrix4, buffer:0, colorBuffer:0}; //Blade 2
  base_block[3] = {modelMatrix: new Matrix4, buffer:0, colorBuffer:0}; //Blade 3

  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  var cubeProgram = createProgram(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE);
  if (!cubeProgram) {
    console.log('Fail to initialize cube shaders');
    return;
  }
  initCubeVars(gl, cubeProgram);

  var planeProgram = createProgram(gl, PLANE_VSHADER_SOURCE, PLANE_FSHADER_SOURCE);
  if (!planeProgram) {
    console.log('Fail to initialize plane shaders');
    return;
  }
  initPlaneVars(gl, planeProgram);

  var n = initObjects(gl, cubeProgram, planeProgram);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var tick = function() {
    //render(gl, cubeProgram, planeProgram);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

function initObjects(gl, cubeProgram, planeProgram) {
  //Init Plane
  base_plane.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, base_plane.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, base_plane.vertices, gl.STATIC_DRAW);
  var PSIZE = base_plane.vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(planeProgram.a_Position, 3, gl.FLOAT, false, PSIZE*5, 0);
  gl.enableVertexAttribArray(planeProgram.a_Position);
  gl.vertexAttribPointer(planeProgram.a_TexCoord, 2, gl.FLOAT, false, PSIZE * 5 , PSIZE * 2);
  gl.enableVertexAttribArray(planeProgram.a_TexCoord);

  //Init Cubes
  for (var i = 0; i < base_block.length; i++) {
    base_block[i].buffer = gl.createBuffer();
    if (!base_block[i].buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, base_block[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, base_data.vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(cubeProgram.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(cubeProgram.a_Position);

    var a = 0, b = 0, c = 0;
    var x = 0.25, y = 0.25, z = 0.25;
    switch (i) {
      case 0: a = 0.4; x = 0.5; break;
      case 1: a = -0.4;x = 0.5; break;
      case 2: b = 0.4; y = 0.5; break;
      case 3: b = -0.4;y = 0.5; break;
      default: return;
    }
    base_block[i].modelMatrix.setTranslate(a, b, c, 1);
    base_block[i].modelMatrix.scale(x, y, z, 1);
  }
  return true;
}

function render(gl, cubeProgram, planeProgram) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (var i = 0; i < base_block.length; i++) {
    switch (i) {
      case 0:
        gl.uniform4f(cubeProgram.u_Color, 1.0, 0.0, 0.0, 1);
        break;
      case 1:
        gl.uniform4f(cubeProgram.u_Color, 1.0, 0.65, 0.0, 1);
        break;
      case 2:
        gl.uniform4f(cubeProgram.u_Color, 1.0, 1.0, 0.0, 1);
        break;
      case 3:
        gl.uniform4f(cubeProgram.u_Color, 0.0, 0.0, 1.0, 1);
        break;
      default: return;
    }
    gl.uniformMatrix4fv(cubeProgram.u_ModelMatrix, false, base_block[i].modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, base_data.n);
  }
}

function initPlaneVars(gl, planeProgram) {
  planeProgram.a_Position = gl.getAttribLocation(planeProgram, 'a_Position');
  planeProgram.a_TexCoord = gl.getAttribLocation(planeProgram, 'a_TexCoord');
  planeProgram.u_MvpMatrix = gl.getUniformLocation(planeProgram, 'u_MvpMatrix');
  planeProgram.u_Sampler = gl.getUniformLocation(planeProgram, 'u_Sampler');
}

function initCubeVars(gl, cubeProgram) {
  cubeProgram.a_Position = gl.getAttribLocation(cubeProgram, 'a_Position');
  cubeProgram.a_Color = gl.getAttribLocation(cubeProgram, 'a_Color');
  cubeProgram.u_MvpMatrix = gl.getUniformLocation(cubeProgram, 'u_MvpMatrix');
}
