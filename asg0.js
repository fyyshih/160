// DrawRectangle.js
var canvas; 
var ctx;

function drawVector(v, color) {
    if (!ctx) {
        console.log("ctx not defined");
        return;
    }

    ctx.save(); // save context
    var x0 = canvas.width/2; // Half of the canvas width
    var y0 = canvas.height/2; // Half of the canvas height
    //alternative: ctx.translate(canvas.width/2, canvas.height/2); // get origin (0,0,0)

    
    // scaling by 20
    var x1 = x0 + v.elements[0] * 20;
    var y1 = y0 - v.elements[1] * 20;

    // drawing vector
    ctx.beginPath(); // start at origin
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function handleDrawEvent() {
    // 1. clears canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. reads values of text boxes to create v1
    var x1 = document.getElementById("inputX").value;
    var y1 = document.getElementById("inputY").value;
    x1 = parseFloat(x1); // to num
    y1 = parseFloat(y1);
    var v1 = new Vector3([x1, y1, 0.0]);

    var x2 = document.getElementById("inputX2").value;
    var y2 = document.getElementById("inputY2").value;
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);
    var v2 = new Vector3([x2, y2, 0.0]);

    //3. calls drawVector() with red
    drawVector(v1, "red"); 
    drawVector(v2, "blue");
    return false;
}

function handleDrawOperationEvent() {
    // 1. clear the canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. read v1, draw in red
    var x1 = document.getElementById("inputX").value;
    var y1 = document.getElementById("inputY").value;
    x1 = parseFloat(x1); // to num
    y1 = parseFloat(y1);
    var v1 = new Vector3([x1, y1, 0.0]);
    drawVector(v1, "red");

    // 3. read v2, draw in blue
    var x2 = document.getElementById("inputX2").value;
    var y2 = document.getElementById("inputY2").value;
    x2 = parseFloat(x2);
    y2 = parseFloat(y2);
    var v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v2, "blue");

    // 4. perform operation
    var operator = document.getElementById("operator").value;
    var scalar = document.getElementById("scalar").value;
    if (operator == "add") {
        v1.add(v2);
        drawVector(v1, "green");
    } else if (operator == "sub") {
        v1.sub(v2);
        drawVector(v1, "green");
    } else if (operator == "mult") {
        v1.mul(scalar);
        v2.mul(scalar);
        drawVector(v1, "green");
        drawVector(v2, "green");
    } else if (operator == "div") {
        v1.div(scalar);
        v2.div(scalar);
        drawVector(v1, "green");
        drawVector(v2, "green");
    } else if (operator == "magnitude") {
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
    } else if (operator == "normalize") {
        v1.normalize();
        v2.normalize();
        drawVector(v1, "green");
        drawVector(v2, "green");
    } else if (operator == "anglebetween") { // angle between
        let theta = angleBetween(v1, v2);
        console.log("Angle: " + theta);
    } else { // area
        let cp = areaTriangle(v1, v2);
        console.log("Area: " + cp);
    }
    return false;
}

function angleBetween(v1, v2) { // find theta using dot product and magnitude
    num = Vector3.dot(v1, v2);
    denom = v1.magnitude() * v2.magnitude();
    return ((Math.acos(num / denom)) * (180 / Math.PI));
}

function areaTriangle(v1, v2) {
    v3 = Vector3.cross(v1, v2);
    console.log("before calling magnitude: " + v3.elements[2]);
    v3 = v3.magnitude()
    console.log("magnitude: " + v3);
    return (v3 / 2);
}

function main() {
    // Retrieve <canvas> element <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }
    // Get the rendering context for 2DCG <- (2)
    ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    // 2. instantiate new vector (red) and call drawVector();
    var v1 = new Vector3([0.0, 0.0, 0.0]);
    drawVector(v1, "red"); 
} 