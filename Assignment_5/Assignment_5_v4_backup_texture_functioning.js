//mriddell
var VS_SRC =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  v_Color = a_Color;\n' +
'}\n';

var FS_SRC =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';


var SVS_SRC =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

var SFS_SRC =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

var texture = {
  t:0,
  buffer:0,
  image:0
}

var shaderVars = {
   u_xformMatrix:0,
   a_Position:0,
   a_TexCoord:0,
   u_Sampler:0,
   u_MvpMatrix:0
};

var surface = {
  verticesTexCoords: new Float32Array([
  -100.0, -1.0, -100.0,   0.0, 1.0,
  -100.0, -1.0,  100.0,   0.0, 0.0,
   100.0, -1.0, -100.0,   1.0, 1.0,
   100.0, -1.0,  100.0,   1.0, 0.0,
  ]),
  n: 4,
  buffer:0
};

//Cube with different collored sides.
var cube = {
  verticesColors : new Float32Array ([
    -0.5,  0.5,  0.5,  1.0, 1.0, 0.4,
    -0.5, -0.5,  0.5,  1.0, 1.0, 0.4,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.4,
    -0.5,  0.5,  0.5,  1.0, 1.0, 0.4,
     0.5, -0.5,  0.5,  1.0, 1.0, 0.4,
     0.5,  0.5,  0.5,  1.0, 1.0, 0.4,

     0.5,  0.5,  0.5,  1.0, 0.4, 0.1,
     0.5, -0.5,  0.5,  1.0, 0.4, 0.1,
     0.5, -0.5, -0.5,  1.0, 0.4, 0.1,
     0.5,  0.5,  0.5,  1.0, 0.4, 0.1,
     0.5, -0.5, -0.5,  1.0, 0.4, 0.1,
     0.5,  0.5, -0.5,  1.0, 0.4, 0.1,

     0.5, -0.5,  0.5,  0.4, 1.0, 1.0,
    -0.5, -0.5,  0.5,  0.4, 1.0, 1.0,
    -0.5, -0.5, -0.5,  0.4, 1.0, 1.0,
     0.5, -0.5,  0.5,  0.4, 1.0, 1.0,
    -0.5, -0.5, -0.5,  0.4, 1.0, 1.0,
     0.5, -0.5, -0.5,  0.4, 1.0, 1.0,

     0.5,  0.5, -0.5,  0.4, 0.4, 0.1,
    -0.5,  0.5, -0.5,  0.4, 0.4, 0.1,
    -0.5,  0.5,  0.5,  0.4, 0.4, 0.1,
     0.5,  0.5, -0.5,  0.4, 0.4, 0.1,
    -0.5,  0.5,  0.5,  0.4, 0.4, 0.1,
     0.5,  0.5,  0.5,  0.4, 0.4, 0.1,

    -0.5, -0.5, -0.5,  0.4, 0.1, 0.4,
    -0.5,  0.5, -0.5,  0.4, 0.1, 0.4,
     0.5,  0.5, -0.5,  0.4, 0.1, 0.4,
    -0.5, -0.5, -0.5,  0.4, 0.1, 0.4,
     0.5,  0.5, -0.5,  0.4, 0.1, 0.4,
     0.5, -0.5, -0.5,  0.4, 0.1, 0.4,

    -0.5,  0.5, -0.5,  1.0, 0.4, 0.4,
    -0.5, -0.5, -0.5,  1.0, 0.4, 0.4,
    -0.5, -0.5,  0.5,  1.0, 0.4, 0.4,
    -0.5,  0.5, -0.5,  1.0, 0.4, 0.4,
    -0.5, -0.5,  0.5,  1.0, 0.4, 0.4,
    -0.5,  0.5,  0.5,  1.0, 0.4, 0.4
  ]),
  n:36
};

//Array of Cubes
var cubes = [];

var matrixes = {
  ModelMatrix: new Matrix4(),
  MvpMatrix: new Matrix4(),
  ProjMatrix: new Matrix4(),
  ViewMatrix: new Matrix4()
};

var g_eyeX = 0, g_eyeY = 0, g_eyeZ = 5;
var theta = 0, AtX = 0, AtZ = -1;

function main() {
  cubes[0] = {modelMatrix: new Matrix4, buffer:0};
  cubes[1] = {modelMatrix: new Matrix4, buffer:0};
  cubes[2] = {modelMatrix: new Matrix4, buffer:0};
  cubes[3] = {modelMatrix: new Matrix4, buffer:0};
  cubes[4] = {modelMatrix: new Matrix4, buffer:0};

  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {console.log('gl error');return;}

  var objectProgram = createProgram(gl, VS_SRC, FS_SRC);
  var surfaceProgram = createProgram(gl, SVS_SRC, SFS_SRC);
  //if (!objectProgram) {console.log('objectProgram');}
  //if (!surfaceProgram || !objectProgram) {console.log('program error');return;}
  //if (!initShaders(gl, SVS_SRC, SFS_SRC)) {console.log('shader error');return;}

  initShaderVars(gl, surfaceProgram, objectProgram);
  //initCubeBuffers(gl, objectProgram);
  initSurfaceBuffers(gl, surfaceProgram);

  //ModelMatrix.setTranslate(0.75, 0, 0);
  //matrixes.ViewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, AtX, 0, AtZ, 0, 1, 0);
  matrixes.ProjMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);
  //matrixes.MvpMatrix.set(matrixes.ProjMatrix).multiply(matrixes.ViewMatrix).multiply(matrixes.ModelMatrix);
  matrixes.ViewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, AtX, 0, AtZ, 0, 1, 0);
  matrixes.MvpMatrix.set(matrixes.ProjMatrix).multiply(matrixes.ViewMatrix).multiply(matrixes.ModelMatrix);
  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, surfaceProgram)) {console.log('texture error');return;}
  document.onkeydown = function(ev){ keydown(ev, gl, surfaceProgram); };
  renderSurface(gl, surfaceProgram);
  //renderCubes(gl, objectProgram);
}

function keydown(ev, gl, program) {
  var ret = 1;
  switch (ev.keyCode) {
    case 39:g_eyeX += 0.05;break;
    case 38:g_eyeZ -= 0.05;break;
    case 40:g_eyeZ += 0.05;break;
    case 37:g_eyeX -= 0.05;break;
    default:ret=0;return;
  }
  if (ret) {renderSurface(gl, program);}
}

function renderSurface(gl, program) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  matrixes.ViewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, AtX, 0, AtZ, 0, 1, 0);
  matrixes.MvpMatrix.set(matrixes.ProjMatrix).multiply(matrixes.ViewMatrix).multiply(matrixes.ModelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, matrixes.MvpMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture.t);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, surface.n);
}

function renderCubes(gl, program) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  matrixes.ViewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, AtX, 0, AtZ, 0, 1, 0);
  matrixes.MvpMatrix.set(matrixes.ProjMatrix).multiply(matrixes.ViewMatrix).multiply(matrixes.ModelMatrix);
  for (var i = 0; i < cubes.length; i++) {
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, cubes[i].modelMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubes[i].buffer);
    var FSIZE = cube.verticesColors.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(program.a_Position);
    gl.vertexAttribPointer(program.a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(program.a_Color);
    gl.drawArrays(gl.TRIANGLES, 0, cube.n);
  }
}

function initTextures(gl, program) {
  texture.t = gl.createTexture();
  if (!texture.t) {console.log('texture object');return false;}
  texture.image = new Image();
  if (!texture.image) {console.log('image object');return false;}
  texture.image.onload = function(){ loadTexture(gl, program); };
  texture.image.src = './T1.jpg';
  return true;
}

function loadTexture(gl, program) {
  gl.useProgram(program);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture.t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image);
  gl.uniform1i(program.u_Sampler, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);
  renderSurface(gl, program);
}

function initSurfaceBuffers(gl, program) {
  gl.useProgram(program);
  surface.buffer = gl.createBuffer();
  if (!surface.buffer) {console.log('buffer object');return -1;}
  gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, surface.verticesTexCoords, gl.STATIC_DRAW);
  var FSIZE = surface.verticesTexCoords.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(program.a_Position);
  gl.vertexAttribPointer(program.a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(program.a_TexCoord);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function initCubeBuffers(gl, program) {
  gl.useProgram(program);
  for (var i = 0; i < cubes.length; i++) {
    cubes[i].buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubes[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, cube.verticesColors, gl.STATIC_DRAW);
    var FSIZE = cube.verticesColors.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(program.a_Position);
    var a = 0, b = 0, c = -1.0, d = 1, e = 1, f = 1;
    switch (i) {
      case 0: a = -0.355; d = 0.5; e = 0.125; f = 0.125; break;
      case 1: a = 0.355; d = 0.5; e = 0.125; f = 0.125; break;
      case 2: b = -0.355; d = 0.125; e = 0.5; f = 0.125; break;
      case 3: b = 0.355; d = 0.125; e = 0.5; f = 0.125; break;
      case 4: b = -0.5; c = -1.2; d = 0.125; f = 0.125; break;
      default:return;
    }
    cubes[i].modelMatrix.setTranslate(a, b, c);
    cubes[i].modelMatrix.scale(d, e, f);
  }
}

function initShaderVars(gl, surfaceProgram, objectProgram) {
  objectProgram.a_Position = gl.getAttribLocation(objectProgram, 'a_Position');
  //objectProgram.a_Color = gl.getAttribLocation(objectProgram, 'a_Color');
  objectProgram.u_MvpMatrix = gl.getUniformLocation(objectProgram, 'u_MvpMatrix');
  //Missing a_Normal, u_NormalMatrix ---Usage?

  surfaceProgram.a_Position = gl.getAttribLocation(surfaceProgram, 'a_Position');
  surfaceProgram.a_TexCoord = gl.getAttribLocation(surfaceProgram, 'a_TexCoord');
  surfaceProgram.u_MvpMatrix = gl.getUniformLocation(surfaceProgram, 'u_MvpMatrix');
  surfaceProgram.u_Sampler = gl.getUniformLocation(surfaceProgram, 'u_Sampler');
  //Missing a_Normal, u_NormalMatrix

  /** INSERT ERROR CHECKING FOR STORAGE LOCATION OF ATTRIBUTES AND VARIABLES **/
}
