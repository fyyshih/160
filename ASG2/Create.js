function createDrawing() {
    // Specify the color for clearing <canvas>
   // gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // create drawing using triangles
    let test = new Triangle();
    test.color[0] = 0.0;
    test.render();
}