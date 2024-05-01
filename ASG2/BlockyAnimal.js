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
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_globalAngle = 0;

function addActionsForHtmlUI() {
    // button events. change STATE, so use "onclick." env unchanged, so don't use event listener
    document.getElementById("green").onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById("red").onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById("clearButton").onclick = function() { g_shapesList = []; renderScene(); }; // call render fn whenever we want to clear
    document.getElementById("createButton").onclick = function() { createDrawing(); }; // pass REFERENCE to fn, not fn itself (which would be createDrawing())
    
    document.getElementById("pointButton").onclick = function() { g_selectedType=POINT };
    document.getElementById("triButton").onclick = function() { g_selectedType=TRIANGLE };
    document.getElementById("circleButton").onclick = function() { g_selectedType=CIRCLE };
    
    // color slider events
    document.getElementById("redSlide").addEventListener("mouseup", function () { g_selectedColor[0] = this.value/100; } );
    document.getElementById("greenSlide").addEventListener("mouseup", function() { g_selectedColor[1] = this.value/100; } );
    document.getElementById("blueSlide").addEventListener("mouseup", function() { g_selectedColor[2] = this.value/100; } );

    // size slider event
    document.getElementById("sizeSlide").addEventListener("mouseup", function() { g_selectedSize = this.value; } );

    // number of segments slider event
    document.getElementById("segSlide").addEventListener("mouseup", function() { g_selectedSegments = this.value; } );

    // camera angle slider event
    document.getElementById("angleSlide").addEventListener("mousemove", function() { g_globalAngle = this.value; renderScene(); } );    
}

function main() {
    // set up canvas and gl variables
    setupWebGL();
    // set up GLSL shader programs + connect GLSL variables
    connectVariablesToGLSL();

    // setting up actions for HTML UI (ex: buttons)
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    //canvas.onmousemove = click; // <-- this draws as long as your mouse is hovering over the canvas. 
    canvas.onmousemove = function(ev) { if(ev.buttons == 1) { click(ev) } }; // <-- this draws when your mouse is actually being held down

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    renderScene();
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of a point

function click(ev) {
    let [x, y] = handleClicks(ev);

    // create and store the new point (initialized w the Point class constructor):
    let point;
    if (g_selectedType==POINT) {
        point = new Point();
    } else if (g_selectedType==TRIANGLE) {
        point = new Triangle();
    } else { // circle
        point = new Circle();
    }
    point.position = [x, y];
    point.color = g_selectedColor.slice();
    point.size = g_selectedSize;
    g_shapesList.push(point);

    renderScene();
}

function handleClicks(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x, y]);
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

    // draw left leg (top joint)
    var leftLeg = new Cube();
    leftLeg.color = [1, 0, 1, 1];
    leftLeg.matrix.translate(.4, -.8, -.25);
    leftLeg.matrix.rotate(90, 1, 0, 0);
    leftLeg.matrix.scale(-.1, -.1, .3);
    leftLeg.render();

    // draw right leg (top joint)
    var rightLeg = new Cube();
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

    // draw base neck joint (joint 1)
    var baseNeck = new Cube();
    baseNeck.color = [0.5, 0.5, 0.5, 1];
    baseNeck.matrix.translate(0, -.15, -.16);
    baseNeck.matrix.rotate(50, 0, 0, 1);
    baseNeck.matrix.scale(.1, .3, .12);
    baseNeck.render();

    // draw upper neck joint (joint 2)
    var upperNeck = new Cube();
    upperNeck.color = [0.8, 0.5, 0.5, 1];
    upperNeck.matrix.translate(-.25, .08, -.16);
    upperNeck.matrix.rotate(350, 0, 0, 1);
    upperNeck.matrix.scale(.1, .5, .12);
    upperNeck.render();

    // draw head
    var head = new Cube();
    head.color = [0.5, 0.8, 0.5, 1];
    head.matrix.translate(-.28, .43, -.12);
    head.matrix.rotate(30, 0, 0, 1);
    head.matrix.scale(.25, .2, .2);
    head.render();

    // draw upper beak
    var upperBeak = new Cube();
    upperBeak.color = [0.5, 0.2, 0.5, 1];
    upperBeak.matrix.translate(-.73, .25, -.17);
    upperBeak.matrix.rotate(30, 0, 0, 1);
    upperBeak.matrix.scale(.5, .05, .1);
    upperBeak.render();

    // draw lower beak
    var lowerBeak = new Cube();
    lowerBeak.color = [0.5, 0.5, 0.8, 1];
    lowerBeak.matrix.translate(-.7, .2, -.17);
    lowerBeak.matrix.rotate(30, 0, 0, 1);
    lowerBeak.matrix.scale(.5, .05, .1);
    lowerBeak.render();

    // TODO:
    // (1) center beak(s)
    // (2) align top beak

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