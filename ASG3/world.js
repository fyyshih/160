// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform int u_whichTexture;
    void main() {
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;                         // Use color
        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0);                // Use UV debug
        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);         // Use texture0
        } else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);         // Use texture1
        // } else  if (u_whichTexture == 2) {
        //     gl_FragColor = texture2D(u_Sampler2, v_UV);
        } else {
            gl_FragColor = vec4(0.0, 0.6, 1, 1);                // Error
        }
    }`


let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;
let u_Sampler0;
let u_Sampler1;
// let u_Sampler2;
// camera = new Camera();

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    
    // get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    
    // get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    } 

    // get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    } 

    // get the storage location of u_ModelMatrix (prev u_Size)
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get storage location of u_ModelMatrix');
        return;
    }

    // get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get storage location of u_GlobalRotateMatrix');
        return;
    }    
    
    // get the storage location of u_ViewMatrix
    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get storage location of u_ViewMatrix');
        return;
    } 

    // get the storage location of u_ProjectionMatrix
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get storage location of u_ProjectionMatrix');
        return;
    }    

    // // Get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }

    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }

    // u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    // if (!u_Sampler2) {
    //     console.log('Failed to get the storage location of u_Sampler2');
    //     return;
    // }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    // set initial vlue of matrix to identity matrix
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ViewMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, identityM.elements);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, identityM.elements);
}

// UI global elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_baseNeckAnimation = false;
let g_upperNeckAnimation = false;
let g_headAnimation = false;
let g_globalAngle = 0;
let g_baseNeckAngle = 0;
let g_upperNeckAngle = 0;
let g_headAngle = 45;
let g_beakAngle = 0;
let g_wallAnimation = false;

// variables for mouseDrag rotation + animation (shift+click)
let g_prevX = 0;
let g_prevY = 0;
let g_nX = 0;
let g_nY = 0;
let g_beakAnimation = false;


let startX = 0; // prev
let startY = 0;
let endX; 
let endY;
let mouseDrag = false;

function addActionsForHtmlUI() {
    // button events: animation on/off (both neck joints + head)
    document.getElementById('animationWallOnButton').onclick = function() {g_wallAnimation = true;};
    document.getElementById('animationWallOffButton').onclick = function() {g_wallAnimation = false;};
    document.getElementById('animationBaseNeckOnButton').onclick = function() {g_baseNeckAnimation = true;};
    document.getElementById('animationBaseNeckOffButton').onclick = function() {g_baseNeckAnimation = false;};
    document.getElementById('animationUpperNeckOnButton').onclick = function() {g_upperNeckAnimation = true;};
    document.getElementById('animationUpperNeckOffButton').onclick = function() {g_upperNeckAnimation = false;};
    document.getElementById('animationHeadOnButton').onclick = function() {g_headAnimation = true;};
    document.getElementById('animationHeadOffButton').onclick = function() {g_headAnimation = false;};


    // slider events: head + neck angle (both joints). "input" instead of "mousemove".
    document.getElementById('baseNeckSlide').addEventListener('input', function() { g_baseNeckAngle = this.value; renderScene(); });
    document.getElementById('upperNeckSlide').addEventListener('input', function() { g_upperNeckAngle = this.value; renderScene(); });
    document.getElementById('headSlide').addEventListener('input', function() {g_headAngle = this.value; renderScene(); });
    // slider event: camera angle
    document.getElementById("angleSlide").addEventListener("input", function() { g_globalAngle = this.value; renderScene(); } );    
    // check if shift is also being held down (if true, then animate):
   
    // register function (event handler) to be called on a mouse press (from asg1)
    canvas.onmousedown = function(e) { 
        // console.log('in onmousedown in main()');
        mouseDrag = true;
        [startX, startY] = convertCoordinatesEventToGL(e);
    };

    // canvas.onmousemove = function(ev) { if(ev.buttons == 1) {click(ev)} }; // will rotat
    // // console.log('just after onmousemove');  
    
    canvas.onmouseup = function(ev) {
        mouseDrag = false;
        // // Reset dragging state
        // startX = 0;
        // startY = 0;
    };

    canvas.onmousemove = function(ev) {
        if (!mouseDrag) {
            return;
        }
        let [currX, currY] = convertCoordinatesEventToGL(ev);
        cameraPan(startX, startY, currX, currY);
    
        // Update the previous coordinates for the next movement
        startX = currX;
        startY = currY;
    };
}

// from Matsuda -- TexturedQuad.js (initTextures() and loadTexture())
function initTextures() { // loads, sends to texture
    var image0 = new Image();  // Create the image object
    var image1 = new Image();
    var image2 = new Image();
    if (!image0 || !image1 || !image2) {
        console.log('Failed to create the image object');
        return false;
    } else {
        console.log("created the image object");
    }

    // Register the event handler to be called on loading an image
    image0.onload = function(){ sendImageToTexture(u_Sampler0, image0, 0); };
    image1.onload = function(){ sendImageToTexture(u_Sampler1, image1, 1); };
    // image2.onload = function(){ sendImageToTexture(u_Sampler2, image2, 2); };
    image0.src = "burp.jpg";
    image1.src = "squiggle.png";
   //  image2.src = "/libs/cobblestone.png";
  
    return true;
}
  
function sendImageToTexture(sampler, image, num) {
    console.log('sending image to texture0');
    // create a texture object
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    if (num == 0) {
        gl.activeTexture(gl.TEXTURE0);
    } else if (num == 1) {
        gl.activeTexture(gl.TEXTURE1);
    }
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters - "how are we going to use these textures?"
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // send image so that it lives on the cpu
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    
    // Set the texture unit 0 to the sampler
    gl.uniform1i(sampler, num);
    
    // gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
    console.log("Finished loadTexture");
}

function main() {
    // set up canvas and gl variables
    setupWebGL();
    // set up GLSL shader programs + connect GLSL variables
    connectVariablesToGLSL();

    // setting up actions for HTML UI (ex: buttons)
    addActionsForHtmlUI();

    // keyboard fn - WASD
    document.onkeydown = keydown;

    camera = new Camera();
    // initialize texture
    initTextures();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.4, 0.73, 0.89, 1.0); // from Google color picker
    renderScene();
    console.log("updated");
    // automatically calls tick
    requestAnimationFrame(tick);
}

function cameraPan(startX, startY, endX, endY) {
    var currX = 360 * (endX - startX) * -1; // (* -1) to prevent mirroring
    var currY = 360 * (endY - startY);

    // Get Difference (drag length)
    let xDiff = (currX - startX) * 0.1;
    let panX = xDiff * 0.1;

    let yDiff = (currY - startY) * 0.1;
    let panY = yDiff * 0.1;

    if (xDiff < 0) {
        camera.panLeft(panX);
    } else if (xDiff > 0) {
        camera.panRight(panX);
    }
    if (yDiff < 0) {
        camera.panUp(panY);
    } else if (yDiff > 0) {
        camera.panDown(panY);
    }
}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer

    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return [x, y];
}
var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now / 1000.0 - g_startTime;

function tick() {
    // debug/track
    g_seconds = performance.now() / 1000.0 - g_startTime;
    
    // update animation angles
    updateAnimationAngles();

    // draw everything
    renderScene();

    // tell browser to upate again when it has time
    requestAnimationFrame(tick);
}

// update angles of everything if currently animated
function updateAnimationAngles() {
    if (g_baseNeckAnimation) {
        g_baseNeckAngle = 45*Math.sin(g_seconds);
        g_baseNeckAngle = Math.max(-45, Math.min(45, g_baseNeckAngle)); // from chatGPT - limiting movement of the neck
    }
    if (g_upperNeckAnimation) {
        g_upperNeckAngle = 30*Math.sin(g_seconds);
    }
    if (g_headAnimation) {
        g_headAngle = 30*Math.sin(g_seconds);
    }
    if (g_beakAnimation) {
        g_beakAngle = (5*Math.sin(3*g_seconds));
    }
}

// WASD/keyboard controls for camera:
function keydown(ev) {
    if (ev.keyCode == 87) { // W
        camera.moveForward();
    } else if (ev.keyCode == 65) { // A
        camera.moveLeft();
    } else if (ev.keyCode == 68) { // S
        camera.moveRight();
    } else if (ev.keyCode == 83) { // D
        camera.moveBack();
    } else if (ev.keyCode == 81) { // Q - pan left
        camera.panLeft();
    } else if (ev.keyCode == 69) { // E - pan right
        camera.panRight();
    }
    renderScene();
    console.log(ev.keyCode);
}


// set up variables to control the camera
var g_eye = [0,0,3];
var g_at = [0,3,-100];
var g_up = [0,1,0];

// let mapChanged = true;

var g_map = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
console.log(g_map);

function drawMap() {
    console.log("in drawMap()");
    for (x = 0; x < 32; x++) {
        for (y = 0; y < 32; y++) {
            if (g_map[x][y] == 1) {
                var body = new Cube();
                body.color = [1.0, 1.0, 1.0, 1.0];
                body.matrix.translate(x, -0.8, -y);
                body.matrix.scale(1, 1, 1);
                body.render();
                console.log("jsut rendered wall");
            }
        }
    }
    // mapChanged = false;
}
function renderScene() {

    var startTime = performance.now();

    // pass the projection matrix
    var projMat = new Matrix4();
    projMat.setPerspective(50, canvas.width/canvas.height, 1, 100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

    // pass the view matrix
    var viewMat = new Matrix4();
    viewMat.setLookAt(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2], 
        camera.at.elements[0],camera.at.elements[1],camera.at.elements[2], 
        camera.up.elements[0],camera.up.elements[1],camera.up.elements[2]); // (eye, at, up)
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

    // pass the matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    globalRotMat.rotate(g_nX, 1, 0, 0);
    globalRotMat.rotate(g_nY, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // draw FLOOR
    var floor = new Cube();
    floor.color = [1.0,0.0,0.0,1.0];
    floor.textureNum = 0;
    floor.matrix.translate(-1, -0.8, 1);
    floor.matrix.scale(3, 0, 3);
    floor.render();

    // draw SKY
    var sky = new Cube();
    sky.color = [1.0, 0.0, 0.0, 1.0];
    sky.textureNum = 1;
    sky.matrix.translate(-5.0, -0.88, 5.0); // (1, -0.5, 2);
    sky.matrix.scale(32, 32, 32);
    sky.render();
    
    // draw body
    var body = new Cube();
    body.color = [0.8196, 0.4980, 0.1725, 1.0];
    body.textureNum = 0;
    body.matrix.translate(0, -.5, 0.0);
    body.matrix.scale(0.6, 0.45, 0.45);
    body.render();
    
    
    // draw left wing
    var leftWing = new Cube();
    leftWing.color = [0.7076, 0.4482, 0.1553, 1];
    leftWing.matrix.translate(.9, 0.15, -.35);
    leftWing.matrix.rotate(125, 0, 0, 1);
    leftWing.matrix.scale(.4, .7, .2);
    leftWing.render();
    
    // draw right wing
    var rightWing = new Cube();
    rightWing.color = [0.7076, 0.4482, 0.1553, 1];
    rightWing.matrix.translate(.9, 0.15, .1);
    rightWing.matrix.rotate(125, 0, 0, 1);
    rightWing.matrix.scale(.4, .7, .2);
    rightWing.render();
    
    
    // draw left leg 2
    var leftLeg = new Hexahedron();
    leftLeg.color = [0.4196, 0.2431, 0.0863, 1];
    leftLeg.matrix.translate(.4, -.8, -.25);
    leftLeg.matrix.rotate(90, 1, 0, 0);
    leftLeg.matrix.scale(-.1, -.1, .3);
    leftLeg.render();
    

    // draw right leg 
    var rightLeg = new Hexahedron();
    rightLeg.color = [0.4196, 0.2431, 0.0863, 1];
    rightLeg.matrix.translate(.4, -.8, -.1);
    rightLeg.matrix.rotate(90, 1, 0, 0);
    rightLeg.matrix.scale(-.1, -.1, .3);
    rightLeg.render();
    
    // draw left foot 
    var leftFoot = new Cube();
    leftFoot.color = [0.9294, 0.4588, 0.0471, 1];
    leftFoot.matrix.translate(.4, -.8, -.25);
    leftFoot.matrix.rotate(0, 1, 0, 0);
    leftFoot.matrix.scale(-.25, -.05, .1);
    leftFoot.render();

    // draw right foot 
    var rightFoot = new Cube();
    rightFoot.color = [0.9294, 0.4588, 0.0471, 1]; // periwinkle: [0.5, 0.5, 1, 1];
    rightFoot.matrix.translate(.4, -.8, -.1);
    rightFoot.matrix.rotate(0, 1, 0, 0);
    rightFoot.matrix.scale(-.25, -.05, .1);
    rightFoot.render();

    // draw base/lower neck joint (joint 1)
    var baseNeck = new Cube();
    baseNeck.color = [0.5, 0.5, 0.5, 1];
    baseNeck.matrix.translate(.1, -.15, -.16);
    baseNeck.matrix.rotate(50, 0, 0, 1);
    baseNeck.matrix.rotate(g_baseNeckAngle, 0, 0, 1);
    var baseNeckCoordinatesMat = new Matrix4(baseNeck.matrix); // forces it to make a copy instead of passing in same ptr
    baseNeck.matrix.scale(.1, .4, .12);
    baseNeck.render();

    // draw upper neck joint (joint 2)
    var upperNeck = new Cube();
    upperNeck.color = [0.6, 0.6, 0.6, 1];
    upperNeck.matrix = baseNeckCoordinatesMat;
    upperNeck.matrix.translate(0, .35, 0);
    upperNeck.matrix.rotate(315, 0, 0, 1);
    upperNeck.matrix.rotate(g_upperNeckAngle, 0, 0, 1);
    var upperNeckCoordinatesMat = new Matrix4(upperNeck.matrix);
    upperNeck.matrix.scale(.1, .5, .12);
    upperNeck.matrix.translate(-.1, .05, -0.001);
    upperNeck.render();

    // draw head
    var head = new Cube();
    head.color = [0.8196, 0.4980, 0.1725, 1.0]; // pastel-ish green: [0.5, 0.8, 0.5, 1];
    head.textureNum = 0;
    head.matrix = upperNeckCoordinatesMat;
    head.matrix.scale(-1, 1, 1); // reflect across y axis
    head.matrix.translate(-.08, .4, .03);
    head.matrix.rotate(g_headAngle, 0, 1, -1);
    head.matrix.rotate(30, 0, -1, 1);
    var headCoordinatesMat = new Matrix4(head.matrix);
    head.matrix.scale(.25, .2, .2);
    head.render();

    // draw upper beak
    var upperBeak = new Cube();
    upperBeak.color = [0.7592, 0.5896, 0.1912, 1];
    upperBeak.textureNum = 0;
    upperBeak.matrix = headCoordinatesMat;
    upperBeak.matrix.scale(1, -1, 1);
    upperBeak.matrix.translate(.2, -.1, -.05);
    upperBeak.matrix.rotate(g_beakAngle, 0, 0, 1);
    upperBeak.matrix.scale(.5, .05, .1);
    upperBeak.render();

    // draw lower beak
    var lowerBeak = new Cube();
    lowerBeak.color = [0.949, 0.737, 0.239, 1];
    lowerBeak.textureNum = 0;
    lowerBeak.matrix = headCoordinatesMat;
    lowerBeak.matrix.scale(1, -1, 1);
    lowerBeak.matrix.translate(0, -1.9, 0);
    lowerBeak.matrix.rotate(0, 0, 0, 1);
    lowerBeak.render();


    if (g_wallAnimation) {
        drawMap();
    }
    
    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration)/10, "numdot");
}

// sets the text of an HTML element
function sendTextToHTML(text, htmlID) {
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}