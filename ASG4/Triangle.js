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
    var n = 3; // The number of vertices FIXME: set to vertices/3
  
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


  function drawTriangle3DUV(vertices, uv) {

    gl.disableVertexAttribArray(a_Normal);

    // set num vertices:
    var n = vertices.length/3; // FIXME: should be set to vertices/3

    // ---------- create buffer obj for positions ----------
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // bind buffer obj to traget
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // write data into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // assign buffer obj to a_Position var
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // enable assignment to a_Position var
    gl.enableVertexAttribArray(a_Position);

    // ----------- create buffer obj for UV ----------
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // bind buffer obj to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    // write data into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // assign buffer obj to a_Position var
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // enab assignment to a_Position var
    gl.enableVertexAttribArray(a_UV);

    // draw the triangle !!

    gl.drawArrays(gl.TRIANGLES, 0, n);
  }



  function drawTriangle3DUVNormal(vertices, uv, normals) {
    // set num vertices:
    var n = vertices.length/3; // the number of vertices
  
    // ---------- create buffer obj for positions ----------
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // bind buffer obj to traget
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // write data into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // assign buffer obj to a_Position var
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // enable assignment to a_Position var
    gl.enableVertexAttribArray(a_Position);

    // ----------- create buffer obj for UV ----------
    var uvBuffer = gl.createBuffer();
    if (!uvBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // bind buffer obj to target
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);

    // write data into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

    // assign buffer obj to a_Position var
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

    // enab assignment to a_Position var
    gl.enableVertexAttribArray(a_UV);

    // ----------- create buffer obj for Normals ---------
    var normalBuffer = gl.createBuffer();
    if (!normalBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // bind the buffer obj to target
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    // enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Normal);
  
    // write date into buffer obj
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);

    // assign the buffer obj to a_Position variable
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);




    // ------------- draw the triangle -----------------
    gl.drawArrays(gl.TRIANGLES, 0, n);

    gl.disableVertexAttribArray(a_Normal);
    g_vertexBuffer = null;
  }
