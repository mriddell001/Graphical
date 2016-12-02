//WORKING ON ALTERNATE COLOR SYSTEM.

var S_VSHD_SRC =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
'attribute vec4 a_Normal;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'uniform mat4 u_NormalMatrix;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  vec3 lightDirection = vec3(0.5, 1.0, 1.0);\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
'  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
//'  float nDotL = max(dot(normal, 1.0), 0.0);\n' +
//'  v_Color = a_Color;\n' +
'  v_Color = vec4(a_Color.rgb * nDotL, a_Color.a);\n' +
'}\n';

var S_FSHD_SRC =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'  gl_FragColor = v_Color;\n' +
'}\n';

var T_VSHD_SRC =
'attribute vec4 a_Position;\n' +
'attribute vec2 a_TexCoord;\n' +
'uniform mat4 u_MvpMatrix;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'  gl_Position = u_MvpMatrix * a_Position;\n' +
'  v_TexCoord = a_TexCoord;\n' +
'}\n';

var T_FSHD_SRC =
'#ifdef GL_ES\n' +
'precision mediump float;\n' +
'#endif\n' +
'uniform sampler2D u_Sampler;\n' +
'varying vec2 v_TexCoord;\n' +
'void main() {\n' +
'  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
'}\n';

var gX = 0, gY = 0, gZ = 5;
var ang = 0, aX = 0, aY = 0, aZ = 4;
var g_last = Date.now();

var cubes = [];
var texture_loaded = [];
var texture = [];

var m = {
    mMatrix: new Matrix4(),    //modelMatrix
    nMatrix: new Matrix4(),    //normalMatrix
    vMatrix: new Matrix4(),    //viewMatrix
    pMatrix: new Matrix4(),    //projMatrix
    mvpMatrix: new Matrix4(),  //mvpMatrix
};

var stageColor = new Float32Array([
  0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,
  0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,
  0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,
  0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,
  0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,
  0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13,0.39,0.26,0.13
]);

var rC = new Float32Array([
  1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,
  0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,
  0,1,0,0,1,0,0]);
var bC = new Float32Array([
  0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,
  1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,
  1,0,0,1,0,0,1]);
var gC = new Float32Array([
  0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,
  0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,
  0,0,1,0,0,1,0]);
var yC = new Float32Array([
  1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,
  0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,
  0,1,1,0,1,1,0]);
var pC = new Float32Array([
  1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,
  1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,
  1,1,0,1,1,0,1]);
var qC = new Float32Array([
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5]);
var xC = new Float32Array([
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

function main() {
    texture_loaded[0] = false;
    cubes[0] = {mMatrix:new Matrix4()};
    cubes[1] = {mMatrix:new Matrix4()};
    cubes[2] = {mMatrix:new Matrix4()};
    cubes[3] = {mMatrix:new Matrix4()};
    cubes[4] = {mMatrix:new Matrix4()};
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    if (!gl) {console.log('Failed WebGL');return;}


    var tProg = createProgram(gl, T_VSHD_SRC, T_FSHD_SRC);
    var sProg = createProgram(gl, S_VSHD_SRC, S_FSHD_SRC);
    initProgram(gl, tProg, 1);
    initProgram(gl, sProg, 0);

    texture[0] = gl.createTexture();

    var Cube = initCube(gl);

    setStage(gl, sProg, Cube);
    m.vMatrix.setLookAt(gX, gY, gZ, aX, aY, aZ, 0, 1, 0);
    m.pMatrix.setPerspective(90, canvas.width/canvas.height, 0.1, 100);
    m.mvpMatrix.set(m.pMatrix).multiply(m.vMatrix).multiply(m.mMatrix);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (!initTextures(gl, tProg, Cube)) {console.log('Failed texture.');return;}

    document.onkeydown = function(ev){
      keydown(ev);};

    var tick = function() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        drawTextureCube(gl, Cube, tProg);
        drawCube(gl, Cube, sProg);
        requestAnimationFrame(tick);
    };
    tick();
}

function dTr (rads) {return rads * (Math.PI/180);}
function mC (ang) {return Math.cos(ang);}
function mS (ang) {return Math.sin(ang);}

function drawTextureCube(gl, o, program) {
  gl.useProgram(program);

  initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
  initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
  initAttributeVariable(gl, program.a_TexCoord, o.texCoordBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture[0]);

  m.vMatrix.setLookAt(gX, gY, gZ, aX, aY, aZ, 0, 1, 0);
  m.mvpMatrix.set(m.pMatrix).multiply(m.vMatrix).multiply(m.mMatrix);
  m.nMatrix.setInverseOf(cubes[0].mMatrix);
  m.nMatrix.transpose();
  gl.uniformMatrix4fv(program.u_NormalMatrix, false, m.nMatrix.elements);
  m.mvpMatrix.set(m.pMatrix).multiply(m.vMatrix).multiply(cubes[0].mMatrix);
  gl.uniformMatrix4fv(program.u_MvpMatrix, false, m.mvpMatrix.elements);
  gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function drawCube(gl, o, program) {
    gl.useProgram(program);
    initAttributeVariable(gl, program.a_Position, o.vertexBuffer);
    initAttributeVariable(gl, program.a_Normal, o.normalBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
    m.vMatrix.setLookAt(gX, gY, gZ, aX, aY, aZ, 0, 1, 0);
    m.mvpMatrix.set(m.pMatrix).multiply(m.vMatrix).multiply(m.mMatrix);
    for (var i = 1; i < cubes.length; i++) {
      primeColorBuffer(gl, program, o, i);
      m.nMatrix.setInverseOf(cubes[i].mMatrix);
      m.nMatrix.transpose();
      gl.uniformMatrix4fv(program.u_NormalMatrix, false, m.nMatrix.elements);
      m.mvpMatrix.set(m.pMatrix).multiply(m.vMatrix).multiply(cubes[i].mMatrix);
      gl.uniformMatrix4fv(program.u_MvpMatrix, false, m.mvpMatrix.elements);
      gl.drawElements(gl.TRIANGLES, o.numIndices, o.indexBuffer.type, 0);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function initTextures(gl, program, o) {
    if (!texture[0]) {console.log('Failed texture object');return false;}
    var image = new Image();
    if (!image) {console.log('Failed image object');return false;}
    image.onload = function(){ loadTexture(gl, program, o, image); };
    image.src = './floor.jpg';
    return true;
}
function loadTexture(gl, program, o, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.useProgram(program);
    gl.uniform1i(program.u_Sampler, 0);
    drawTextureCube(gl, o, program);
}

function initCube(gl) {
    var o = new Object();
    var vertices = new Float32Array([   // Vertex coordinates
       1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,
       1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,
       1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,
      -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,
       1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0
    ]);
    var normals = new Float32Array([   // Normal
       0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
       1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
       0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
       0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
       0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0
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
       1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v0-v1-v2-v3 front
       0.0, 1.0,   0.0, 0.0,   1.0, 0.0,   1.0, 1.0,    // v0-v3-v4-v5 right
       1.0, 0.0,   1.0, 1.0,   0.0, 1.0,   0.0, 0.0,    // v0-v5-v6-v1 up
       1.0, 1.0,   0.0, 1.0,   0.0, 0.0,   1.0, 0.0,    // v1-v6-v7-v2 left
       0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0,    // v7-v4-v3-v2 down
       0.0, 0.0,   1.0, 0.0,   1.0, 1.0,   0.0, 1.0     // v4-v7-v6-v5 back
    ]);
    var indices = new Uint8Array([        // Indices of the vertices
       0, 1, 2,   0, 2, 3,    // front
       4, 5, 6,   4, 6, 7,    // right
       8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,    // left
      16,17,18,  16,18,19,    // down
      20,21,22,  20,22,23     // back
    ]);

    o.colors = colors;
    o.vertexBuffer = initLaterBuffer(gl, vertices, 3, gl.FLOAT);
    o.normalBuffer = initArrayBufferForLaterUse(gl, normals, 3, gl.FLOAT);
    o.texCoordBuffer = initArrayBufferForLaterUse(gl, texCoords, 2, gl.FLOAT);
    o.indexBuffer = initElementArrayBufferForLaterUse(gl, indices, gl.UNSIGNED_BYTE);
    o.colorBuffer = initLaterBuffer(gl, colors, 3, gl.FLOAT);
    o.numIndices = indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return o;
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
function initAttributeVariable(gl, a_attribute, buffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(a_attribute, buffer.num, buffer.type, false, 0, 0);
  gl.enableVertexAttribArray(a_attribute);
}
function initArrayBufferForLaterUse(gl, data, num, type) {
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
function primeColorBuffer(gl, program, o, index) {
  switch (index) {
    case 0:o.colorBuffer = initLaterBuffer(gl, gC, 3, gl.FLOAT);break;
    case 1:o.colorBuffer = initLaterBuffer(gl, stageColor, 3, gl.FLOAT);break;
    case 2:o.colorBuffer = initLaterBuffer(gl, stageColor, 3, gl.FLOAT);break;
    case 3:o.colorBuffer = initLaterBuffer(gl, xC, 3, gl.FLOAT);break;
    case 4:o.colorBuffer = initLaterBuffer(gl, o.colors, 3, gl.FLOAT);break;
    default:break;
  }
  initAttributeVariable(gl, program.a_Color, o.colorBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.indexBuffer);
}
function setStage(gl, program, Cube) {
    cubes[0].mMatrix.translate(0, -0.5, 0);
    cubes[0].mMatrix.scale(100, 0.1, 100);

    cubes[1].mMatrix.translate(0,4.5,-7);
    cubes[1].mMatrix.scale(10, 5, 0.1);

    cubes[2].mMatrix.translate(0,-0.5,-6);
    cubes[2].mMatrix.scale(10, 0.5, 1);

    cubes[3].mMatrix.translate(0, 0, 5);
    cubes[3].mMatrix.scale(15, 20, 15);

    cubes[4].mMatrix.translate(0, -1.2, 0);
    cubes[4].mMatrix.scale(1, 1, 1);
}
function initProgram(gl, program, i) {
  program.a_Position = gl.getAttribLocation(program, 'a_Position');
  program.u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
  if (i) {
    program.a_TexCoord = gl.getAttribLocation(program, 'a_TexCoord');
    program.u_Sampler = gl.getUniformLocation(program, 'u_Sampler');
  }
  else {
    program.u_NormalMatrix = gl.getUniformLocation(program, 'u_NormalMatrix');
    program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
    program.a_Color = gl.getAttribLocation(program, 'a_Color');}
}
function keydown(ev) {
  switch (ev.keyCode) {
    case 37:turnLeft();break;
    case 38:gZ = aZ;gX = aX;aZ = gZ - mC(dTr(ang));aX = gX + mS(dTr(ang));break;
    case 39:ang = (ang + 2)%360;aZ=(gZ-mC(dTr(ang)));aX=(gX+mS(dTr(ang)));break;
    case 40:reverse();break;
    case 87:aX=9.588586356746424;aZ=-6.831593677398255;gX=10.587977183765519;gZ=-6.866493174100755;break;
    default:break;
  }
  //console.log("aX: " + aX + " aZ: " + aZ + " gX: " + gX + " gZ: " + gZ);
}
function turnLeft() {
    if (ang == 0) {ang = 358;}
    else {ang = (ang -2);}
    if(aZ < gZ && aX > gX) {aZ=(gZ-mC(dTr(ang)));aX=(gX+mS(dTr(ang)));}
    else if (aZ < gZ && aX <= gX) {aZ=(gZ-mC(dTr(ang)));aX=(gX+mS(dTr(ang)));}
    else if (aZ >= gZ && aX > gX) {aZ=(gZ-mC(dTr(ang)));aX=(gX+mS(dTr(ang)));}
    else if (aZ >= gZ && aX <= gX) {aZ=(gZ-mC(dTr(ang)));aX=(gX+mS(dTr(ang)));}
    else {return;}
}
function reverse() {
    rZ = gZ - mC(dTr((ang+180)%360));rX = gX + mS(dTr((ang+180)%360));
    gZ = rZ;gX = rX;aZ = gZ - mC(dTr(ang));aX = gX + mS(dTr(ang));
}
