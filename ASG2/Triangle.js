class Triangle {
    constructor() {
      this.type="triangle";
      this.position = [[0.0, 0.0],  [0.0, 0.0], [0.0, 0.0]];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;

      this.buffer = null;
    }
  
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
          
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], 1.0);
      gl.uniform1f(u_Size, size);
  
      var d = this.size/200.0;
      drawTriangle([xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d]);
    }
  }
  
  
  // HelloTriangle.js (c) 2012 matsuda
  function drawTriangle(vertices) {
    var n = 3; // The number of vertices
  
    // buffer
    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    // bind buffer obj to target
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // write data into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // enable assignment to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function drawTriangle3D(vertices) {
    var n = 3; // The number of vertices
  
    // buffer
    this.buffer = gl.createBuffer();
    if (!this.buffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    // bind buffer obj to target
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // write data into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // enable assignment to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0); // change second param to 3 for 3D
    gl.enableVertexAttribArray(a_Position);
  
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }