//mriddell
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  //'uniform mat4 u_viewMatrix;\n' +
  //'uniform mat4 u_modelMatrix;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  //'  gl_Position = u_viewMatrix * u_modelMatrix * a_Position;\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

var F_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

var F_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
  '  gl_FragColor = color;\n' +
  '}\n';

//Global Variables

//Arrays
var cubes = [];

//Cube Objects
var base_block = {
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

//Base program object
var shaderVars = {
  canvasSize:0,
  a_Position:0,
  a_Color:0,
  //u_viewMatrix: new Matrix4(),
  u_MvpMatrix: new Matrix4(),
  //u_modelMatrix: new Matrix4(),
  viewMatrix: new Matrix4(),
  modelMatrix: new Matrix4(),
  a_TexCoord:0,
  u_Sampler:0,
  t_load: false
};

//Camera
var camera = {
  viewMatrix: new Matrix4(),
  projMatrix: new Matrix4(),
  angle:0,
  g_eyeX:0,
  g_eyeY:0,
  g_eyeZ:0
};

//Texture Variable
var texture;

//Texture object.
var surface = {
  vertices: new Float32Array([
    -50.0, -0.6, -50.0,   0.0, 0.0, //Vertex A, B, C; Texture X, Y
     50.0, -0.6, -50.0,   1.0, 0.0,
     50.0, -0.6,  50.0,   1.0, 1.0,
    -50.0, -0.6,  50.0,   0.0, 0.0
  ]),
  n:4,
  modelMatrix: new Matrix4(),
  buffer:0
};


function main() {
  cubes[0] = {modelMatrix: new Matrix4, buffer:0};
  cubes[1] = {modelMatrix: new Matrix4, buffer:0};
  cubes[2] = {modelMatrix: new Matrix4, buffer:0};
  cubes[3] = {modelMatrix: new Matrix4, buffer:0};
  cubes[4] = {modelMatrix: new Matrix4, buffer:0};

  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  var objectProgram = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  if (!objectProgram) {
    console.log('Failed to intialize object program.');
    return;
  }
  //initShaderVars(gl, objectProgram);

  objectProgram.u_MvpMtx = gl.getUniformLocation(objectProgram, 'u_MvpMtx');
  objectProgram.a_Position = gl.getAttribLocation(objectProgram, 'a_Position');
  objectProgram.a_Color = gl.getAttribLocation(objectProgram, 'a_Color');

  var surfaceProgram = createProgram(gl, F_VSHADER_SOURCE, F_FSHADER_SOURCE);
  if (!surfaceProgram) {
    console.log('Failed to intialize surface program.');
    return;
  }
  //initTextVars(gl, surfaceProgram);

  surfaceProgram.u_MvpMtx = gl.getUniformLocation(surfaceProgram, 'u_MvpMatrix');
  surfaceProgram.u_Sampler = gl.getUniformLocation(surfaceProgram, 'u_Sampler');
  surfaceProgram.a_Position = gl.getAttribLocation(surfaceProgram, 'a_Position');
  surfaceProgram.a_TexCoord = gl.getAttribLocation(surfaceProgram, 'a_TexCoord');

  var n =  initVertexBuffers(gl, objectProgram, surfaceProgram);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  //initTexturesVertexBuffer(gl, surfaceProgram);

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);

  shaderVars.canvasSize = canvas.width/canvas.height;
  camera.projMatrix.setPerspective(30.0, shaderVars.canvasSize, 1.0, 100.0);
  camera.viewMatrix.lookAt(0.0, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  //var tick = function() {
    renderView(gl, n, objectProgram, surfaceProgram);   // Draw the triangles
    //requestAnimationFrame(tick, canvas);
  //};
  //tick();
}

function renderView(gl, n, program, sprogram) {
  camera.viewMatrix.setTranslate(0,0,0);
  camera.viewMatrix.rotate(camera.angle, 0, 1, 0);
  camera.viewMatrix.translate(camera.g_eyeX, 0, camera.g_eyeZ);

  gl.clear(gl.COLOR_BUFFER_BIT);

  /*gl.useProgram(sprogram);
  shaderVars.modelMatrix.setTranslate(0,0,0);
  shaderVars.u_MvpMatrix.set(camera.projMatrix).multiply(camera.viewMatrix).multiply(shaderVars.modelMatrix);
  gl.uniformMatrix4fv(sprogram.u_MvpMatrix, false, shaderVars.u_MvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  var FSIZE = surface.vertices.BYTES_PER_ELEMENT;



  if (shaderVars.t_load == true) {
    gl.uniformMatrix4fv(program.u_MvpMtx, false, surface.modelMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
    gl.drawArrays(gl.TRIANGLES, 0, surface.n);
  }*/
  gl.useProgram(program);
  for (var i = 0; i < cubes.length; i++) {
    gl.uniformMatrix4fv(program.u_MvpMtx, false, cubes[i].modelMatrix.elements);
    //gl.uniformMatrix4fv(program.u_viewMatrix, false, viewMatrix.elements);
    gl.bindBuffer(gl.ARRAY_BUFFER, cubes[i].buffer);
    gl.drawArrays(gl.TRIANGLES, 0, base_block.n);
  }
}

function initVertexBuffers(gl, program, sprogram) {
  /*surface.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, surface.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, surface.vertices, gl.STATIC_DRAW);
  var FSIZE = surface.vertices.BYTES_PER_ELEMENT;
  gl.useProgram(sprogram);
  gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, FSIZE*5, 0);
  gl.enableVertexAttribArray(program.a_Position);
  gl.vertexAttribPointer(program.a_TexCoord, 2, gl.FLOAT, false, FSIZE*5, FSIZE*2);
  gl.enableVertexAttribArray(program.a_TexCoord);
  surface.modelMatrix.setTranslate(0, 0, 0);*/

  gl.useProgram(program);
  for (var i = 0; i < cubes.length; i++) {
    cubes[i].buffer = gl.createBuffer();
    if (!cubes[i].buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, cubes[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, base_block.verticesColors, gl.STATIC_DRAW);

    var FSIZE = base_block.verticesColors.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(program.a_Position);
    gl.vertexAttribPointer(program.a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(program.a_Color);
    var a = 0, b = 0, c = 0, d = 1, e = 1, f = 1;
    switch (i) {
      case 0: a = -0.355; d = 0.5; e = 0.125; f = 0.125; break;
      case 1: a = 0.355; d = 0.5; e = 0.125; f = 0.125; break;
      case 2: b = -0.355; d = 0.125; e = 0.5; f = 0.125; break;
      case 3: b = 0.355; d = 0.125; e = 0.5; f = 0.125; break;
      case 4: b = -0.5; c = -0.2; d = 0.125; f = 0.125; break;
      default:return;
    }
    cubes[i].modelMatrix.setTranslate(a, b, c);
    cubes[i].modelMatrix.scale(d, e, f);
  }
  return cubes.length;
}

function initShaderVars(gl, program) {
  gl.useProgram(program);
  //program.u_viewMatrix = gl.getUniformLocation(program, 'u_viewMatrix');
  program.u_MvpMtx = gl.getUniformLocation(program, 'u_MvpMtx');
  /*if (!program.u_viewMatrix || !program.u_MvpMtx) {
  if (!program.u_MvpMtx) {console.log('Storage error(initShaderVars): err_1');return;}*/
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_Color = gl.getAttribLocation(program, 'a_Color');
  /*if((program.a_Position < 0) || (program.a_Color < 0)) {console.log('Attribute error(initShaderVars): err_2');return -1;}*/
}

function initTextVars(gl, program) {
  gl.useProgram(program);
  program.u_MvpMtx = gl.getUniformLocation(program, 'u_MvpMtx');
  program.u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
}

function initTexturesVertexBuffer(gl, program) {
  texture = gl.createTexture();
  if (!texture){console.log('Fail texture creation');}
  var image = new Image();
  if (!image) {console.log('Failed image creation');}
  image.onload = function(){loadTexture(gl, program, texture, image);};
  image.src = './T1.jpg';
}

function loadTexture(gl, program, texture, image) {
  gl.useProgram(program);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.useProgram(program);
  gl.uniform1i(program.u_Sampler, 0);
  gl.bindTexture(gl.TEXTURE_2D, null);
  shaderVars.t_load = true;
}
