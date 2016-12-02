//mriddell
var VS_SRC =
'attribute vec4 a_Position;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  vec4 color = vec4(0.0, 1.0, 1.0, 1.0);\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  v_Color = vec4(color.rgb, color.a);\n' +
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
  image:0,
  loaded:false
}

var surface = {
  verticesTexCoords: new Float32Array([
  -100.0, -1.0, -100.0,   0.0, 1.0,
  -100.0, -1.0,  100.0,   0.0, 0.0,
   100.0, -1.0, -100.0,   1.0, 1.0,
   100.0, -1.0,  100.0,   1.0, 0.0,
  ]),
  modelMatrix: new Matrix4(),
  n: 4,
  buffer:0
};


var matrixes = {
  ModelMatrix: new Matrix4(),
  MvpMatrix: new Matrix4(),
  ViewProjMatrix: new Matrix4(),
};

var g_eyeX = 0, g_eyeY = 2, g_eyeZ = 5;
var theta = 0, AtX = 0, AtZ = -1;

function main() {
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {console.log('gl error');return;}

  var objectProgram = createProgram(gl, VS_SRC, FS_SRC);
  var surfaceProgram = createProgram(gl, SVS_SRC, SFS_SRC);
  initShaderVars(gl, surfaceProgram, objectProgram);
  initSurfaceBuffers(gl, surfaceProgram);
  var cube = initVertexBuffers(gl);

  matrixes.ViewProjMatrix.setPerspective(30.0, canvas.width/canvas.height, 1.0, 100.0);
  matrixes.ViewProjMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, surfaceProgram)) {console.log('texture error');return;}
  document.onkeydown = function(ev){ keydown(ev, gl, surfaceProgram); };
  var tick = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderSurface(gl, surfaceProgram);
    drawCube(gl, objectProgram, cube);
    window.requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
  ]);
  var indices = new Uint8Array([        // Indices of the vertices
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);
  var o = new Object(); // Utilize Object to to return multiple buffer objects together
  o.vertexBuffer = initArrayBufferForLaterUse(gl, vertices, 3, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  o.numIndices = indices.length;
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return o;
}
function drawCube(gl, program, o) {
  gl.useProgram(program);
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
  matrixes.MvpMatrix.set(matrixes.ViewProjMatrix);
  //Move modelMatrix in here.
  matrixes.ModelMatrix.setTranslate(0.0, 0.0, 0.0);
  matrixes.MvpMatrix.multiply(matrixes.ModelMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, matrixes.MvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);   // Draw
}

function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}
function initArrayBufferForLaterUse(gl, data, num, type) {
  var buffer = gl.createBuffer();
  if (!buffer) {console.log('Failed to create buffer');return null;}
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.num = num;
  buffer.type = type;
  return buffer;
}
function initElementArrayBufferForLaterUse(gl, data, type) {
  var buffer = gl.createBuffer();
  if (!buffer) {console.log('Failed to create buffer elem');return null;}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.type = type;
  return buffer;
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
  if (texture.loaded == true) {
  gl.useProgram(program);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, surface.modelMatrix.elements);
  gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
  var FSIZE = surface.verticesTexCoords.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(program.a_Position);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture.t);
  gl.vertexAttribPointer(program.a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(program.a_TexCoord);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, surface.n);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);}
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
  texture.loaded = true;
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

function initShaderVars(gl, surfaceProgram, objectProgram) {
  objectProgram.a_Position = gl.getAttribLocation(objectProgram, 'a_Position');
  objectProgram.a_Color = gl.getAttribLocation(objectProgram, 'a_Color');
  objectProgram.u_MvpMatrix = gl.getUniformLocation(objectProgram, 'u_MvpMatrix');

  surfaceProgram.a_Position = gl.getAttribLocation(surfaceProgram, 'a_Position');
  surfaceProgram.a_TexCoord = gl.getAttribLocation(surfaceProgram, 'a_TexCoord');
  surfaceProgram.u_MvpMatrix = gl.getUniformLocation(surfaceProgram, 'u_MvpMatrix');
  surfaceProgram.u_Sampler = gl.getUniformLocation(surfaceProgram, 'u_Sampler');
}
