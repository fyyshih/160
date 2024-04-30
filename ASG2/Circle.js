class Circle {
    constructor() {
      this.type="circle";
      this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.segments = g_selectedSegments; // need to define # of segments for circle class
    }
    
    render() {
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
            
      // pass color of point to u_FragColor var
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    
      // scale size
      var d = this.size/200.0;
      let step = 360/this.segments;
  
      for (var angle = 0; angle < 360; angle += step) {
          let center = [xy[0], xy[1]];
          let angle1 = angle;
          let angle2 = angle + step;
          let vec1 = [Math.cos(angle1*(Math.PI)/180)*d, Math.sin(angle1*(Math.PI)/180)*d];
          let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
          let pt1 = [center[0]+vec1[0], center[1]+vec1[1]];
          let pt2 = [center[0]+vec2[0], center[1]+vec2[1]];
  
          drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
      }
    }
  }
  
  
  // 1. Have a slider to determine the number of segments in the circle
  // Add a slider and connections and variables
  // Add a field to your Circle class to store the number of segments