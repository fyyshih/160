// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform float u_Size;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = u_Size;\n' +
    //'  gl_PointSize = 10.0;\n' +
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
let u_Size; 

function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    
    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    } 

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get storage location of u_Size');
        return;
    }
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

function addActionsForHtmlUI() {
    // button events. change STATE, so use "onclick." env unchanged, so don't use event listener
    document.getElementById("green").onclick = function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
    document.getElementById("red").onclick = function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
    document.getElementById("clearButton").onclick = function() { g_shapesList = []; renderAllShapes(); }; // call render fn whenever we want to clear
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

    renderAllShapes();
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

    renderAllShapes();
}

function handleClicks(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x, y]);
}

function renderAllShapes() {

    var startTime = performance.now();

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // var len = g_shapesList.length;
    // for(var i = 0; i < len; i++) {
    //     g_shapesList[i].render();
    //     // for if you want to keep track of size: console.log("current size: " + g_shapesList[i].size);
    // }

    // test triangle:
    drawTriangle3D([-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);
    // test cube:
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.render();

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