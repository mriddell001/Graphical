//Assignment_5_v6
var SOLID_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
　'  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

var SOLID_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

// Vertex shader for texture drawing
var TEXTURE_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader for texture drawing
var TEXTURE_FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
  '  gl_FragColor = vec4(color.rgb, color.a);\n' +
  '}\n';

var currentAngle = 0.0;
var viewAngle = 0;
var set = 1;
var rColors = new Float32Array([
  1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,
  1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0
]);
var bColors = new Float32Array([
  0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,
  0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1
]);
var gColors = new Float32Array([
  0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,
  0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0
]);
var yColors = new Float32Array([
  1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,
  1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0
]);
var pColors = new Float32Array([
  1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,
  1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1
]);

var axis = [];
var cubes = [];

var m = {
  modelMatrix: new Matrix4(),
  mvpMatrix: new Matrix4(),
  viewMatrix: new Matrix4(),
  projMatrix: new Matrix4()
};

var ang = 0;
var g_eyeX = 0, g_eyeY = 0, g_eyeZ = 5;
var a_eyeX = 0, a_eyeY = 0, a_eyeZ = 4;

function main() {
  cubes[0] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[1] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[2] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[3] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[4] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[5] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[6] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[7] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[8] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[9] = {x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};
  cubes[10] ={x:0, y:0, z:0, s:0, t:0, u:0, modelMatrix: new Matrix4()};

  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);
  if (!gl) {console.log('WebGL');return;}
  var solidProgram = createProgram(gl, SOLID_VSHADER_SOURCE, SOLID_FSHADER_SOURCE);
  var texProgram = createProgram(gl, TEXTURE_VSHADER_SOURCE, TEXTURE_FSHADER_SOURCE);
  if (!solidProgram || !texProgram) {console.log('shaders.');return;}
  solidProgram.a_Position = gl.getAttribLocation(solidProgram, 'a_Position');
  solidProgram.a_Color = gl.getAttribLocation(solidProgram, 'a_Color');
  solidProgram.u_MvpMatrix = gl.getUniformLocation(solidProgram, 'u_MvpMatrix');
  texProgram.a_Position = gl.getAttribLocation(texProgram, 'a_Position');
  texProgram.a_TexCoord = gl.getAttribLocation(texProgram, 'a_TexCoord');
  texProgram.u_MvpMatrix = gl.getUniformLocation(texProgram, 'u_MvpMatrix');
  texProgram.u_Sampler = gl.getUniformLocation(texProgram, 'u_Sampler');

  var cube = initVertexBuffers(gl);

  var texture = initTextures(gl, texProgram);
  if (!texture) {console.log('texture.');return;}
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.8, 0.8, 0.9, 1.0);

  document.onkeydown = function(ev){ keydown(ev, gl, canvas); };
  m.viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, a_eyeX, a_eyeY, a_eyeZ, 0.0, 1.0, 0.0);
  m.projMatrix.setPerspective(30.0, canvas.width/canvas.height, 0.1, 100.0);
  m.mvpMatrix.set(m.projMatrix).multiply(m.viewMatrix).multiply(m.modelMatrix);

  drawTexCube(gl, texProgram, cube, texture, 0);
  for (var i = 1; i < cubes.length; i++) {
    drawSolidCube(gl, solidProgram, cube, i);
  }
  set = 0;

  var tick = function() {
    currentAngle = animate(currentAngle);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear color and depth buffers
    drawTexCube(gl, texProgram, cube, texture, 0);
    for (var i = 1; i < cubes.length; i++) {
        drawSolidCube(gl, solidProgram, cube, i);
    }
    window.requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([   // Vertex coordinates
     1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,
     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,
     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,
    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,
     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0
  ]);
  var colors = new Float32Array([     // Colors
    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,
    0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,
    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,
    1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,
    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,
    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0
  ]);
  var texCoords = new Float32Array([   // Texture coordinates
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
     0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,
     1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,
     1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,
     0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0
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
  CSIZE = colors.BYTES_PER_ELEMENT;
  o.colors = colors;
  o.vertexBuffer = initLaterBuffer(gl, vertices, 3, gl.FLOAT);
  o.texCoordBuffer = initLaterBuffer(gl, texCoords, 2, gl.FLOAT);
  o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
  o.colorBuffer = initLaterBuffer(gl, colors, 3, gl.FLOAT);
  if (!o.vertexBuffer || !o.texCoordBuffer || !o.indexBuffer) return null;
  o.numIndices = indices.length;
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return o;
}

function keydown(ev, gl, canvas) {
  if (ev.keyCode == 39) {
    ang = (ang + 2)%360;
  }
  else {
    ang = (ang - 2)%360;
  }
  switch (ev.keyCode) {
    case 37:a_eyeX=g_eyeX-Math.cos(rads(ang));a_eyeZ=g_eyeZ-Math.sin(rads(ang));break;
    case 38:
      a_eyeZ-=1;
      g_eyeZ-=1;
      break;
    case 39:a_eyeX=g_eyeX-Math.cos(rads(ang));a_eyeZ=g_eyeZ-Math.sin(rads(ang));break;
    case 40:
      a_eyeZ+=1;
      g_eyeZ+=1;
      break;
    case 65:speed++;break;
    case 68:speed--;break;
    case 87:if (speed == -30) {speed = 0;}else {speed = -30;}break;
    default:return;
  }
  if (ev.keyCode > 41) {return;}
}

function rads (rads) {
    return rads * (Math.PI/180);
}

function initTextures(gl, program) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {console.log('texture object');return null;}
  var image = new Image();  // Create a image object
  if (!image) {console.log('image object');return null;}
  image.onload = function() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.useProgram(program);
    gl.uniform1i(program.u_Sampler, 0);
    gl.bindTexture(gl.TEXTURE_2D, null); // Unbind texture
  };
  image.src = './T1.jpg';
  return texture;
}

function drawSolidCube(gl, program, o, x) {
  gl.useProgram(program);
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  switch (x) {
    case 1:o.colorBuffer = initLaterBuffer(gl, rColors, 3, gl.FLOAT);break;
    case 2:o.colorBuffer = initLaterBuffer(gl, bColors, 3, gl.FLOAT);break;
    case 3:o.colorBuffer = initLaterBuffer(gl, gColors, 3, gl.FLOAT);break;
    case 4:o.colorBuffer = initLaterBuffer(gl, yColors, 3, gl.FLOAT);break;
    case 5:o.colorBuffer = initLaterBuffer(gl, pColors, 3, gl.FLOAT);break;
    default:o.colorBuffer = initLaterBuffer(gl, o.colors, 3, gl.FLOAT);break;
  }
  initAttributeVariable(gl, program.a_Color, o.colorBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);  // Bind indices
  drawCube(gl, program, o, x);   // Draw
}

function drawTexCube(gl, program, o, texture, x) {
  gl.useProgram(program);   // Tell that this program object is used
  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);  // Vertex coordinates
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);// Texture coordinates
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer); // Bind indices
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  drawCube(gl, program, o, x); // Draw
}

function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}

function drawCube(gl, program, o, x) {
  m.viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, a_eyeX, a_eyeY, a_eyeZ, 0.0, 1.0, 0.0);
  if (set > 0) {initSet(x);}
  else {
    var a=cubes[x].x,b=cubes[x].y,c=cubes[x].z;
    var d=cubes[x].s,e=cubes[x].t,f=cubes[x].u;
    cubes[x].modelMatrix.setTranslate(a, b, c);
    if ((x > 0) && (x < 5)) {cubes[x].modelMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);}
    cubes[x].modelMatrix.scale(d, e, f);
    m.mvpMatrix.set(m.projMatrix).multiply(m.viewMatrix).multiply(cubes[x].modelMatrix);
    gl.uniformMatrix4fv(program.u_MvpMatrix, false, m.mvpMatrix.elements);
    gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
  }
}

function initSet(x) {
  var a=0,b=0,c=0;
  var d=0,e=0,f=0;
  switch (x) {
    case 0:a=0;b=-2.0;c=0;d=128;e=0.5;f=128;break;
    case 1:a=0;b=1.75;c=-1.75;d=0.2;e=1;f=0.25;break;
    case 2:a=0;b=4.25;c=-1.75;d=0.2;e=1;f=0.25;break;
    case 3:a=-1.25;b=3.0;c=-1.75;d=1;e=0.2;f=0.25;break;
    case 4:a=1.25;b=3.0;c=-1.75;d=1;e=0.2;f=0.25;break;
    case 5:a=0;b=0.0;c=-2.25;d=0.25;e=3;f=0.25;break;
    default:a=15*Math.random()-7.5;b=0;c=10*Math.random()-20;d=Math.random()+0.1;
      e=Math.random()+1;f=Math.random()+0.1;break;
  }
  c-=10;
  cubes[x].modelMatrix.setTranslate(a, b, c);
  cubes[x].modelMatrix.scale(d, e, f);
  cubes[x].x=a; cubes[x].y=b; cubes[x].z=c;
  cubes[x].s=d; cubes[x].t=e; cubes[x].u=f;
}


function initLaterBuffer(gl, data, num, type) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {console.log('Failed buffer object');return null;}
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.num = num;
  buffer.type = type;
  return buffer;
}

function initElementArrayBufferForLaterUse(gl, data, type) {
  var buffer = gl.createBuffer();　  // Create a buffer object
  if (!buffer) {console.log('Failed buffer object');return null;}
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  buffer.type = type;
  return buffer;
}

var ANGLE_STEP = 30;   // The increments of rotation angle (degrees)
var speed = 0;
var last = Date.now(); // Last time that this function was called
function animate(angle) {
  var now = Date.now();   // Calculate the elapsed time
  var elapsed = now - last;
  last = now;
  var newAngle = angle + ((ANGLE_STEP + speed) * elapsed) / 1000.0;
  return newAngle % 360;
}
