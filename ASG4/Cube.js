class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -1; 
    }

    render() {
        var rgba = this.color;

        // pass in the texture number
        gl.uniform1i(u_whichTexture, this.textureNum);

        // pass color of point to u_FragColor
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //gl.uniform4f(u_FragColor, 1, 1, 1, 1); // should be white
        
        // pass in matrix to u_ModelMatrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //gl.uniform4f(u_FragColor, 1, 1, 1, 1); // should be white

        // front face
        drawTriangle3DUVNormal(
            [0, 0, 0, 1,1,0, 1,0,0],
            [0,0, 1,1, 1,0],
            [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 1,0, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

        // top face
        drawTriangle3DUVNormal([0,1,0, 1,1,-1, 1,1,0], [0,0, 1,1, 0,1], [0,1,0, 0,1,0, 0,1,0]);
        drawTriangle3DUVNormal([0,1,0, 0,1,-1, 1,1,-1], [0,0, 1,0, 1,1], [0,1,0, 0,1,0, 0,1,0]);

        // bottom face
        drawTriangle3DUVNormal([0,0,0, 1,0,-1, 1,0,0], [0,0, 1,1, 0,1], [0,-1,0, 0,-1,0, 0,-1,0]);
        drawTriangle3DUVNormal([0,0,0, 0,0,-1, 1,0,-1], [0,0, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);

        // back face
        drawTriangle3DUVNormal([0,0,-1, 1,1,-1, 1,0,-1], [0,0, 1,1, 0,1], [0,0,1, 0,0,1, 0,0,1]);
        drawTriangle3DUVNormal([0,0,-1, 0,1,-1, 1,1,-1], [0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);

        // left face
        drawTriangle3DUVNormal([0,0,0, 0,1,-1, 0,0,-1], [0,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,-1], [0,0, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0]);

        // right face
        drawTriangle3DUVNormal([1,0,0, 1,1,-1, 1,0,-1], [0,0, 1,1, 0,1], [1,0,0, 1,0,0, 1,0,0]);
        drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,-1], [0,0, 1,0, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    }
}