class Cube {
    constructor() {
        this.type = "cube";
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

        // top face
        drawTriangle3D([0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0]);

        // bottom face
        drawTriangle3D([0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,0.0,-1.0, 1.0,0.0,-1.0]);

        // back face
        drawTriangle3D([0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0]);
        drawTriangle3D([0.0,0.0,-1.0, 0.0,1.0,-1.0, 1.0,1.0,-1.0]);

        // left face
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,-1.0, 0.0,0.0,-1.0]);
        drawTriangle3D([0.0,0.0,0.0, 0.0,1.0,0.0, 0.0,1.0,-1.0]);

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // right face
        drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0]);
        drawTriangle3D([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,-1.0]);

    }
}