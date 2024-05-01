// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'uniform mat4 u_GlobalRotateMatrix;\n' +
    'void main() {\n' +
    '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 u_FragColor;\n' +  // uniformå¤‰æ•°
    'void main() {\n' +
    '  gl_FragColor = u_FragColor;\n' +
    '}\n';


let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix

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

    // set initial vlue of matrix to identity matrix
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI global elements
let g_baseNeckAnimation = false;
let g_upperNeckAnimation = false;
let g_headAnimation = false;
let g_globalAngle = 0;
let g_baseNeckAngle = 0;
let g_upperNeckAngle = 0;
let g_headAngle = 45;

function addActionsForHtmlUI() {
    // button events: animation on/off (both neck joints + head)
    document.getElementById('animationBaseNeckOnButton').onclick = function() {g_baseNeckAnimation = true;};
    document.getElementById('animationBaseNeckOffButton').onclick = function() {g_baseNeckAnimation = false;};
    document.getElementById('animationUpperNeckOnButton').onclick = function() {g_upperNeckAnimation = true;};
    document.getElementById('animationUpperNeckOffButton').onclick = function() {g_upperNeckAnimation = false;};
    document.getElementById('animationHeadOnButton').onclick = function() {g_headAnimation = true;};
    document.getElementById('animationHeadOffButton').onclick = function() {g_headAnimation = false;};

    // slider events: head + neck angle (both joints) 
    document.getElementById('baseNeckSlide').addEventListener('mousemove', function() { g_baseNeckAngle = this.value; renderScene(); });
    document.getElementById('upperNeckSlide').addEventListener('mousemove', function() { g_upperNeckAngle = this.value; renderScene(); });
    document.getElementById('headSlide').addEventListener('mousemove', function() {g_headAngle = this.value; renderScene(); });
    // slider event: camera angle
    document.getElementById("angleSlide").addEventListener("mousemove", function() { g_globalAngle = this.value; renderScene(); } );    
}

function main() {
    // set up canvas and gl variables
    setupWebGL();
    // set up GLSL shader programs + connect GLSL variables
    connectVariablesToGLSL();

    // setting up actions for HTML UI (ex: buttons)
    addActionsForHtmlUI();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // automatically calls tick
    requestAnimationFrame(tick);
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
}

function renderScene() {

    var startTime = performance.now();

    // pass the matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.clear(gl.COLOR_BUFFER_BIT);


    // draw body
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.matrix.translate(0, -.5, 0.0);
    body.matrix.scale(0.6, 0.45, 0.45);
    body.render();

    // draw left wing
    var leftWing = new Cube();
    leftWing.color = [1, 1, 0, 1];
    leftWing.matrix.translate(.9, 0.15, -.35);
    leftWing.matrix.rotate(125, 0, 0, 1);
    leftWing.matrix.scale(.4, .7, .2);
    leftWing.render();

    // draw right wing
    var rightWing = new Cube();
    rightWing.color = [1, 0.5, 1, 1];
    rightWing.matrix.translate(.9, 0.15, .1);
    rightWing.matrix.rotate(125, 0, 0, 1);
    rightWing.matrix.scale(.4, .7, .2);
    rightWing.render();

    // draw left leg 
    var leftLeg = new Hexahedron();
    leftLeg.color = [1, 0, 1, 1];
    leftLeg.matrix.translate(.4, -.8, -.25);
    leftLeg.matrix.rotate(90, 1, 0, 0);
    leftLeg.matrix.scale(-.1, -.1, .3);
    leftLeg.render();

    // draw right leg 
    var rightLeg = new Hexahedron();
    rightLeg.color = [1, 0.5, 0.5, 1];
    rightLeg.matrix.translate(.4, -.8, -.1);
    rightLeg.matrix.rotate(90, 1, 0, 0);
    rightLeg.matrix.scale(-.1, -.1, .3);
    rightLeg.render();

    // draw left foot 
    var leftFoot = new Cube();
    leftFoot.color = [0.5, 0, 1, 1];
    leftFoot.matrix.translate(.4, -.8, -.25);
    leftFoot.matrix.rotate(0, 1, 0, 0);
    leftFoot.matrix.scale(-.25, -.05, .1);
    leftFoot.render();

    // draw right foot 
    var rightFoot = new Cube();
    rightFoot.color = [0.5, 0.5, 1, 1];
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
    upperNeck.color = [0.8, 0.5, 0.5, 1];
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
    head.color = [0.5, 0.8, 0.5, 1];
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
    upperBeak.color = [0.5, 0.2, 0.5, 1];
    upperBeak.matrix = headCoordinatesMat;
    upperBeak.matrix.scale(1, -1, 1);
    upperBeak.matrix.translate(.2, -.1, -.05);
    upperBeak.matrix.rotate(0, 0, 0, 1);
    upperBeak.matrix.scale(.5, .05, .1);
    upperBeak.render();

    // draw lower beak
    var lowerBeak = new Cube();
    lowerBeak.color = [0.5, 0.5, 0.8, 1];
    lowerBeak.matrix = headCoordinatesMat;
    lowerBeak.matrix.scale(1, -1, 1);
    lowerBeak.matrix.translate(0, -1.9, 0);
    lowerBeak.matrix.rotate(0, 0, 0, 1);
    lowerBeak.render();

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