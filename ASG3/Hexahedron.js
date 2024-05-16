class Hexahedron {
    constructor() {
        this.type = "hexahedron";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        var rgba = this.color;

        // pass color of point to u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // pass in matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // front face
        drawTriangle3D([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);

        // back face
        drawTriangle3D([0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0]);
        drawTriangle3D([0.0,0.0,-1.0, 0.0,1.0,-1.0, 1.0,1.0,-1.0]);

        // top face
        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0]);
        drawTriangle3D([0.0,1.0,0.0, 0.0,1.0,-1.0, 1.0,1.0,-1.0]);
        drawTriangle3D([0.0,1.0,0.0, -0.5,1,-0.5, 0.0,1.0,-1.0]);
        drawTriangle3D([1.0,1.0,0.0, 1.0,1.0,-1.0, 1.5,1.0,-0.5]);

        // bottom face
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-1.0, 1.0,0.0,-1.0]);
        drawTriangle3D([0.0,0.0,0.0, -0.5,0.0,-0.5, 0.0,0.0,-1.0]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,0.0,-1.0, 1.5,0.0,-0.5]);

        // left front 
        drawTriangle3D([-0.5,0.0,-0.5, 0.0,1.0,0.0, 0.0,0.0,0.0]);
        drawTriangle3D([-0.5,0.0,-0.5, -0.5,1.0,-0.5, 0.0,1.0,0.0]);

        // left back
        drawTriangle3D([-0.5,0.0,-0.5, -0.5,1.0,-0.5, 0.0,1.0,-1.0]);
        drawTriangle3D([-0.5,0.0,-0.5, 0.0,1.0,-1.0, 0.0,0.0,-1.0]);

        // right front 
        drawTriangle3D([1.0,0.0,0.0, 1.5,1.0,-0.5, 1.5,0.0,-0.5]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,0.0, 1.5,1.0,-0.5]);

        // right back
        drawTriangle3D([1.0,0.0,-1.0, 1.5,1.0,-0.5, 1.5,0.0,-0.5]);
        drawTriangle3D([1.0,0.0,-1.0, 1.0,1.0,-1.0, 1.5,1.0,-0.5]);



    }
}