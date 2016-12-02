//mriddell

function main() {

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

  var FLOOR_VSHADER_SOURCE=
    'attribute vec4 a_Position;\n' +
    'attribute vec2 a_TexCoord;\n' +
    'uniform mat4 u_MvpMatrix;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main() {\n' +
      'gl_Position = u_MvpMatrix * a_Position;\n' +
        'v_TexCoord = a_TexCoord;\n' +
        '}\n';

  var FLOOR_FSHADER_SOURCE=
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' + 'void main() {\n' +
      'vec4 color = texture2D(u_Sampler, v_TexCoord);\n' +
        'gl_FragColor = color;\n' +
        '}\n';

  //variables for shaders
  var shaderVariables = {
    a_Position:0,
    a_Color:0,
    a_PointSize:0,
    a_TexCoord:0,
    u_MvpMatrix: new Matrix4(),
    viewMatrix: new Matrix4(),
    modelMatrix: new Matrix4(),
    canvasSize:0,
    loaded:false
  };

  var cube= {
    vertices : new Float32Array ([
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
        n:36,
        buffer:0,
        vertBuffer:0,
        indBuffer:0,
        colorBuffer:0
  };

  var floor = {
    vertices: new Float32Array([
                  -100.0,  -0.7, -100.0, 0.0, 0.0,
                  100.0,  -0.7, -100.0, 1.0, 0.0,
                  100.0,  -0.7,  100.0, 1.0, 1.0,
                  -100.0,  -0.7,  100.0, 0.0, 1.0,
                  ]),
    n:4,
    buffer:0
  };

  var camera = {
    viewMatrix: new Matrix4(),
    projMatrix: new Matrix4(),
    angle:0,
    g_eyeX:0,
    g_eyeY:0,
    g_eyeZ:0
  };


  //object to hold various object models
  var models = {
    cube,
    floor,
    camera
  };



  //retrieves canvas
  var canvas = document.getElementById('webgl');

  // Gets rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  //Initialize shaders
  var cubeProgram = createProgram(gl, CUBE_VSHADER_SOURCE, CUBE_FSHADER_SOURCE);
  var floorProgram = createProgram(gl, FLOOR_VSHADER_SOURCE, FLOOR_FSHADER_SOURCE);
  if (!cubeProgram || !floorProgram) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //set up shaders and locations of shader variables
  cubeProgram.a_Position = gl.getAttribLocation(cubeProgram, 'a_Position');
  cubeProgram.a_Color = gl.getAttribLocation(cubeProgram, 'a_Color');
  cubeProgram.u_MvpMatrix = gl.getUniformLocation(cubeProgram, 'u_MvpMatrix');

  floorProgram.a_Position = gl.getAttribLocation(floorProgram, 'a_Position');
  floorProgram.a_TexCoord = gl.getAttribLocation(floorProgram, 'a_TexCoord');
  floorProgram.u_MvpMatrix = gl.getUniformLocation(floorProgram, 'u_MvpMatrix');
  floorProgram.u_Sampler = gl.getUniformLocation(floorProgram, 'u_Sampler');
  if(cubeProgram.a_Position < 0 || !cubeProgram.a_Color || !cubeProgram.u_MvpMatrix){
    console.log('Failed to get cube shader variables');
  }
  if(floorProgram.a_Position < 0 || !floorProgram.u_Sampler || !floorProgram.u_MvpMatrix || !floorProgram.a_TexCoord){
    console.log('Failed to get floor shader variables');
  }

  //set up buffers for models
  var n = initVertexBuffers(gl, shaderVariables, models, cubeProgram, floorProgram);
  if(!n){
    console.log('Failed to set the positions of the vertices');
    return;
  }

  var texture = initTextures(gl, floorProgram,shaderVariables);
  if(!texture){
    console.log('Failed to init textures.');
  }

  //Registers the event handler to be called when a key is pressed
  document.onkeydown = function(ev){
    keydown(ev, gl, shaderVariables, models, texture, cubeProgram, floorProgram); };

  //sets background color
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0.5, 0.5, 1.0);

  shaderVariables.canvasSize = canvas.width/canvas.height;
  models.camera.projMatrix.setPerspective(40.0, shaderVariables.canvasSize, 1, 100);
  models.camera.viewMatrix.setLookAt(0, 0.2, 5, 0, 0, 1, 0, 1, 0);
  console.log('rendering');

  renderScene(gl, shaderVariables, models, texture, cubeProgram, floorProgram);
}

/**
 * initVertexBuffers - initializes all Webgl buffers for models
 * @param {object} gl - WebGL rendering context
 * @param {object} shaderVars - locations of shader variables
 * @params {models} - all model objects to be initilized
 * @returns {Boolean}
 */
function initVertexBuffers(gl, shaderVariables, models, cube, floor){

  //init terrain
  models.floor.buffer = gl.createBuffer();
  if(!models.floor.buffer){
    console.log('Failed to create cube buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, models.floor.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, models.floor.vertices, gl.STATIC_DRAW);

  var FSIZE = models.floor.vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(floor.a_Position, 3, gl.FLOAT, false, FSIZE * 5 ,0);
  gl.enableVertexAttribArray(floor.a_Position);

  gl.vertexAttribPointer(floor.a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5 , FSIZE * 2);
  gl.enableVertexAttribArray(floor.a_TexCoord);

  //init cube
  models.cube.buffer = gl.createBuffer();
  if(!models.cube.buffer){
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, models.cube.buffer);
  gl.bufferData(gl.ARRAY_BUFFER, models.cube.vertices, gl.STATIC_DRAW);

  var FSIZE = models.cube.vertices.BYTES_PER_ELEMENT;

  gl.vertexAttribPointer(cube.a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(cube.a_Position);

  gl.vertexAttribPointer(cube.a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(cube.a_Color);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return true;
}

function initTextures(gl, program,shaderVariables){
  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create texture')
      return null;
  }

  var image = new Image();
  if(!image) {
    console.log('Failed to create image');
  }

  image.onload = function(){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.useProgram(program);
    gl.uniform1i(program.u_Sampler, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    shaderVariables.loaded=true;

  };

  image.src = './T1.jpg';

  return texture;
}


/**
 * keydown - event handler for keyboard presses
 * @param {Object} ev - the event handler
 * @param {Object} gl - the WebGL rendering context
 * @param {Object} shaderVariables- the locations of the shader variables
 * @param {Object} translationVariables- the locations of the variables handling
 * translation
 * @param {Object} models- holds models that are being rendered
 */
var g_eyeX = 0, g_eyeY = 0, g_eyeZ = 5;

function keydown(ev,gl, shaderVariables, models, texture, cube, floor){
  if(ev.keyCode == 39) {
    models.camera.angle += 5;
    models.camera.angle = models.camera.angle % 360;
  }
  else if(ev.keyCode == 37){
    models.camera.angle -= 5;
    models.camera.angle = models.camera.angle % 360;
  }
  else if(ev.keyCode == 38) {
    g_eyeZ += 0.5;
  }
  else if(ev.keyCode == 40){
    g_eyeZ -= 0.5;
  }
  else{
    return;
  }
  renderScene(gl, shaderVariables, models, texture, cube, floor);
}

/**
 *renderScene - renders the scene using WebGL
 *@param {object} gl - the WebGL rendering context
 *@param {object} shaderVariables - the locations of the shader variables
 *@param {object} translationVariables - the locations of translation Variables
 *@param {object} models - models of objects to be rendered
 */
function renderScene(gl, shaderVariables, models, texture, cube, floor){

  models.camera.viewMatrix.setTranslate(0,0,0);
  models.camera.viewMatrix.rotate(models.camera.angle,0,1,0);
  models.camera.viewMatrix.translate(g_eyeX,0,g_eyeZ);

  //draw terrain
  gl.useProgram(floor);

  shaderVariables.modelMatrix.setTranslate(0,0,0);
  shaderVariables.u_MvpMatrix.set(models.camera.projMatrix).multiply(models.camera.viewMatrix).multiply(shaderVariables.modelMatrix);
  gl.uniformMatrix4fv(floor.u_MvpMatrix, false, shaderVariables.u_MvpMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bindBuffer(gl.ARRAY_BUFFER, models.floor.buffer);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  var FSIZE = models.floor.vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(floor.a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.vertexAttribPointer(floor.a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);

  gl.drawArrays(gl.TRIANGLES, 0, models.floor.n);

  //draw cubes
  gl.useProgram(cube);

  shaderVariables.modelMatrix.setTranslate(20, 0, -10);
  shaderVariables.u_MvpMatrix.set(models.camera.projMatrix).multiply(models.camera.viewMatrix).multiply(shaderVariables.modelMatrix);
  gl.uniformMatrix4fv(cube.u_MvpMatrix, false, shaderVariables.u_MvpMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, models.cube.buffer);
  FSIZE = models.cube.vertices.BYTES_PER_ELEMENT;
  gl.vertexAttribPointer(cube.a_Position, 3, gl.FLOAT, false, FSIZE * 6 , 0);
  gl.vertexAttribPointer(cube.a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.drawArrays(gl.TRIANGLES, 0, models.cube.n);

  shaderVariables.modelMatrix.translate(0, 0.5, 0);
  shaderVariables.modelMatrix.scale(0.5, 1, 1);

  shaderVariables.u_MvpMatrix.set(models.camera.projMatrix).multiply(models.camera.viewMatrix).multiply(shaderVariables.modelMatrix);
  gl.uniformMatrix4fv(cube.u_MvpMatrix, false, shaderVariables.u_MvpMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, models.cube.buffer);
  gl.vertexAttribPointer(cube.a_Position, 3, gl.FLOAT, false, FSIZE * 6 ,0);
  gl.vertexAttribPointer(cube.a_Color, 3, gl.FLOAT, false, FSIZE * 6 , FSIZE * 3);
  gl.drawArrays(gl.TRIANGLES, 0, models.cube.n);

  shaderVariables.modelMatrix.translate(0, 0.5, 0);
  shaderVariables.modelMatrix.scale(0.5, 1, 1);

  shaderVariables.u_MvpMatrix.set(models.camera.projMatrix).multiply(models.camera.viewMatrix).multiply(shaderVariables.modelMatrix);
  gl.uniformMatrix4fv(cube.u_MvpMatrix, false, shaderVariables.u_MvpMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, models.cube.buffer);
  gl.vertexAttribPointer(cube.a_Position, 3, gl.FLOAT, false, FSIZE * 6 ,0);
  gl.vertexAttribPointer(cube.a_Color, 3, gl.FLOAT, false, FSIZE * 6 , FSIZE * 3);
  gl.drawArrays(gl.TRIANGLES, 0, models.cube.n);

  shaderVariables.modelMatrix.setTranslate(0,0,0);

  shaderVariables.modelMatrix.translate(10, 4, 0);
  shaderVariables.modelMatrix.scale(0.5, 10, 0.5);
  shaderVariables.u_MvpMatrix.set(models.camera.projMatrix).multiply(models.camera.viewMatrix).multiply(shaderVariables.modelMatrix);
  gl.uniformMatrix4fv(cube.u_MvpMatrix, false, shaderVariables.u_MvpMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, models.cube.buffer);
  gl.vertexAttribPointer(cube.a_Position, 3, gl.FLOAT, false, FSIZE * 6 ,0);
  gl.vertexAttribPointer(cube.a_Color, 3, gl.FLOAT, false, FSIZE * 6 , FSIZE * 3);
  gl.drawArrays(gl.TRIANGLES, 0, models.cube.n);

  shaderVariables.modelMatrix.translate(0, 1, 0);

  shaderVariables.modelMatrix.setTranslate(50,4,-30);
  shaderVariables.modelMatrix.scale(10, 10, 10);
  shaderVariables.u_MvpMatrix.set(models.camera.projMatrix).multiply(models.camera.viewMatrix).multiply(shaderVariables.modelMatrix);
  gl.uniformMatrix4fv(cube.u_MvpMatrix, false, shaderVariables.u_MvpMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, models.cube.buffer);
  gl.vertexAttribPointer(cube.a_Position, 3, gl.FLOAT, false, FSIZE * 6 ,0);
  gl.vertexAttribPointer(cube.a_Color, 3, gl.FLOAT, false, FSIZE * 6 , FSIZE * 3);
  gl.drawArrays(gl.TRIANGLES, 0, models.cube.n);

  shaderVariables.modelMatrix.setTranslate(0, 0, 0);
}
