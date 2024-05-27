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


        // for reference, UV for a cube face:
        // // drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 0,1]);
        // // drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 1,0, 1,1]);

        // front face
        drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0], [0,0, 1,1, 0,1]);
        drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0], [0,0, 1,0, 1,1]);
        
        // back face
        drawTriangle3DUV([0.0,0.0,-1.0, 1.0,1.0,-1.0, 1.0,0.0,-1.0], [0,0, 1,1, 0,1]);
        drawTriangle3DUV([0.0,0.0,-1.0, 0.0,1.0,-1.0, 1.0,1.0,-1.0], [0,0, 1,0, 1,1]);
        
        // top face
        drawTriangle3DUV([0.0,1.0,0.0, 1.0,1.0,-1.0, 1.0,1.0,0.0], [0,0, 1,0.75, 0.25,0.75]);
        drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,-1.0, 1.0,1.0,-1.0], [0,0, 1,0, 1,0.75]);
        drawTriangle3DUV([0.0,1.0,0.0, -0.5,1,-0.5, 0.0,1.0,-1.0], [0,0, 0.5,0, 1,0]);
        drawTriangle3DUV([1.0,1.0,0.0, 1.0,1.0,-1.0, 1.5,1.0,-0.5], [0.25,0.75, 1,0.75, 1,1]);
        
        // bottom face
        drawTriangle3DUV([0.0,0.0,0.0, 1.0,0.0,-1.0, 1.0,0.0,0.0], [0,0, 1,0.75, 0.25,0.75]);
        drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,-1.0, 1.0,0.0,-1.0], [0,0, 1,0, 1,0.75]);
        drawTriangle3DUV([0.0,0.0,0.0, -0.5,0.0,-0.5, 0.0,0.0,-1.0], [0,0, 0.5,0, 1,0]);
        drawTriangle3DUV([1.0,0.0,0.0, 1.0,0.0,-1.0, 1.5,0.0,-0.5], [0.25,0.75, 1,0.75, 1,1]);
        
        // left front 
        drawTriangle3DUV([-0.5,0.0,-0.5, 0.0,1.0,0.0, 0.0,0.0,0.0], [0,0, 1,1, 1,0]);
        drawTriangle3DUV([-0.5,0.0,-0.5, -0.5,1.0,-0.5, 0.0,1.0,0.0], [0,0, 0,1, 1,1]);
        
        // left back
        drawTriangle3DUV([-0.5,0.0,-0.5, -0.5,1.0,-0.5, 0.0,1.0,-1.0], [0,0, 0,1, 1,1]);
        drawTriangle3DUV([-0.5,0.0,-0.5, 0.0,1.0,-1.0, 0.0,0.0,-1.0], [0,0, 1,1, 1,0]);
        
        // right front 
        drawTriangle3DUV([1.0,0.0,0.0, 1.5,1.0,-0.5, 1.5,0.0,-0.5], [0,0, 1,1, 0,1]);
        drawTriangle3DUV([1.0,0.0,0.0, 1.0,1.0,0.0, 1.5,1.0,-0.5], [0,0, 1,0, 1,1]);

        // right back
        drawTriangle3DUV([1.0,0.0,-1.0, 1.5,1.0,-0.5, 1.5,0.0,-0.5], [0,0, 1,1, 0,1]);
        drawTriangle3DUV([1.0,0.0,-1.0, 1.0,1.0,-1.0, 1.5,1.0,-0.5], [0,0, 1,0, 1,1]);
        


    }
}