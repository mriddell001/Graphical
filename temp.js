//mriddell

// Rotation angle (degrees/second)

var g_near = 0.0;
var g_far = 0.5;
var projMatrix;

//Single Cube Data
var base_data = {
  vertices: new Float32Array ([
    -0.5,  0.5,  0.5,   0.4,  1.0,  0.4,     -0.5, -0.5,  0.5,   0.4,  1.0,  0.4,
     0.5, -0.5,  0.5,   0.4,  1.0,  0.4,     -0.5,  0.5,  0.5,   0.4,  1.0,  0.4,
     0.5, -0.5,  0.5,   0.4,  1.0,  0.4,      0.5,  0.5,  0.5,   0.4,  1.0,  0.4,

     0.5,  0.5,  0.5,   0.4,  1.0,  0.4,      0.5, -0.5,  0.5,   0.4,  1.0,  0.4,
     0.5, -0.5, -0.5,   0.4,  1.0,  0.4,      0.5,  0.5,  0.5,   0.4,  1.0,  0.4,
     0.5, -0.5, -0.5,   0.4,  1.0,  0.4,      0.5,  0.5, -0.5,   0.4,  1.0,  0.4,

     0.5, -0.5,  0.5,   0.4,  1.0,  0.4,     -0.5, -0.5,  0.5,   0.4,  1.0,  0.4,
    -0.5, -0.5, -0.5,   0.4,  1.0,  0.4,      0.5, -0.5,  0.5,   0.4,  1.0,  0.4,
    -0.5, -0.5, -0.5,   0.4,  1.0,  0.4,      0.5, -0.5, -0.5,   0.4,  1.0,  0.4,

     0.5,  0.5, -0.5,   0.4,  1.0,  0.4,     -0.5,  0.5, -0.5,   0.4,  1.0,  0.4,
    -0.5,  0.5,  0.5,   0.4,  1.0,  0.4,      0.5,  0.5, -0.5,   0.4,  1.0,  0.4,
    -0.5,  0.5,  0.5,   0.4,  1.0,  0.4,      0.5,  0.5,  0.5,   0.4,  1.0,  0.4,

    -0.5, -0.5, -0.5,   0.4,  1.0,  0.4,     -0.5,  0.5, -0.5,   0.4,  1.0,  0.4,
     0.5,  0.5, -0.5,   0.4,  1.0,  0.4,     -0.5, -0.5, -0.5,   0.4,  1.0,  0.4,
     0.5,  0.5, -0.5,   0.4,  1.0,  0.4,      0.5, -0.5, -0.5,   0.4,  1.0,  0.4,

    -0.5,  0.5, -0.5,   0.4,  1.0,  0.4,     -0.5, -0.5, -0.5,   0.4,  1.0,  0.4,
    -0.5, -0.5,  0.5,   0.4,  1.0,  0.4,     -0.5,  0.5, -0.5,   0.4,  1.0,  0.4,
    -0.5, -0.5,  0.5,   0.4,  1.0,  0.4,     -0.5,  0.5,  0.5,   0.4,  1.0,  0.4
  ]),
  n: 36
};

var shaderVars = {
  //u_xformMatrix:0,
  a_Position:0,
  a_Color:0,
  u_ProjMatrix:0
};

var projMatrix;

function main() {
  // Vertex shader program
  var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_xformMatrix;\n' +
    'uniform mat4 u_ProjMatrix;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_Position = u_ProjMatrix * a_Position;\n' +
    //'  gl_Position = u_xformMatrix * a_Position * u_ProjMatrix;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

  // Fragment shader program
  var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n';

  projMatrix = new Matrix4();

  array_objects[0] = {modelMatrix: new Matrix4, buffer:0};
  array_objects[1] = {modelMatrix: new Matrix4, buffer:0};
  array_objects[2] = {modelMatrix: new Matrix4, buffer:0};
  array_objects[3] = {modelMatrix: new Matrix4, buffer:0};

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

  //Init all the shader variables.
  initShaderVars(gl);


  var n = initObjects(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  gl.clearColor(0, 0, 0, 1);

  render(gl);

  document.onkeydown = handleKeyDown;

  // Start drawing
  var tick = function() {
    //render(gl);
    //animate();  // Update the rotation angle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

function render(gl) {

  console.log('render');
  projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, g_near, g_far);
  gl.uniformMatrix4fv(shaderVars.u_ProjMatrix, false, projMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT);
  // Set the rotation matrix
  for (var i = 0; i < array_objects.length; i++) {
    console.log('rend');
    //gl.uniform4f(shaderVars.a_Color, 0.0, 1.0, 0.0, 1);
    //gl.uniformMatrix4fv(shaderVars.u_xformMatrix, false, array_objects[i].modelMatrix.elements);
    //gl.bindBuffer(gl.ARRAY_BUFFER, array_objects[i].buffer);
    //gl.vertexAttribPointer(shaderVars.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, base_data.n);
  }
}

function initObjects(gl) {
  console.log('init');
  var FSIZE = base_data.vertices.BYTES_PER_ELEMENT;
  for (var i = 0; i < array_objects.length; i++) {
    array_objects[i].buffer = gl.createBuffer();
    if (!array_objects[i].buffer) {
      console.log('array_objects buffer failed to be created.');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, array_objects[i].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, base_data.vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(shaderVars.a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(shaderVars.a_Position);

    gl.vertexAttribPointer(shaderVars.a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(shaderVars.a_Color);
    console.log('loop');
  }
  array_objects[0].modelMatrix.setTranslate(0.5, 0, 0, 1);
  array_objects[1].modelMatrix.setTranslate(-0.5, 0, 0, 1);
  array_objects[2].modelMatrix.setTranslate(0, 0.5, 0, 1);
  array_objects[3].modelMatrix.setTranslate(0, -0.5, 0, 1);
}

function initShaderVars(gl) {
  /*shaderVars.u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  if (!shaderVars.u_xformMatrix) {
    console.log('Failed to get the storage location of u_xformMatrix');
    return -1;
  }*/
  shaderVars.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (shaderVars.a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  shaderVars.a_Color = gl.getUniformLocation(gl.program, 'a_Color');
  if (shaderVars.a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  shaderVars.u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  if (!shaderVars.u_ProjMatrix) {
    console.log('Failed to get the storage location of u_ProjMatrix');
    return -1;
  }

}

function handleKeyDown(event) {
  var direction = 4;
  var key = event.keyCode;
  switch (key) {
    case 65: direction = 0;  break;
    case 68: direction = 1;  break;
    case 87: direction = 2;  break;
    case 83: direction = 3;  break;
    default: return;//Do nothing.
  }
  switch (direction) {
    case 0:
      if (directionX == -1) {directionX = 0;}
      else {directionX = 1;}
      break;
    case 1:
      if (directionX == 1) {directionX = 0;}
      else {directionX = -1;}
      break;
    case 2:
      if (directionY == -1) {directionY = 0;}
      else {directionY = 1;}
      break;
    case 3:
      if (directionY == 1) {directionY = 0;}
      else {directionY = -1;}
      break;
    default:
  }
}
