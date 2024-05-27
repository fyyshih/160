class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([0, 0, 3]);
        this.at = new Vector3([0, 3, -100]);
        this.up = new Vector3([0, 1, 0]);

        this.viewMat = new Matrix4();
        this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
                                this.at.elements[0], this.at.elements[1], this.at.elements[2],
                                this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        this.projMat = new Matrix4();
        // this.projMat.setLookAt(this.fov, canvas.width/canvas.height, 0.1, 100)
    }

    moveForward() {
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.1);
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
    }

    moveBack() {
        var b = new Vector3();
        b.set(this.at);
        b.sub(this.eye);
        b.normalize();
        b.mul(0.1);
        this.eye = this.eye.sub(b);
        this.at = this.at.sub(b);
    }

    moveLeft() {
        // compute forward vector
        console.log("in moveLeft()");
        var f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // compute side vector
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(0.1);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }

    moveRight() {
        console.log("in moveRight");
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // compute side vector
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(0.1);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }

    panLeft() {
        console.log("in panLeft");
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // rotate the vector f by alpha degrees around the up vector
        let rotMat = new Matrix4().rotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // TODO: change alpha              ^^

        // multiply rotation matrix rotMat by forward vector f:
        let f_prime = rotMat.multiplyVector3(f);

        // update "at" vector to be : at = eye + f_prime
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panRight() {
        console.log("in panRight");
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // rotate the vector f by alpha degrees around the up vector
        let rotMat = new Matrix4().rotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // TODO: change alpha               ^^

        // multiply rotation matrix rotMat by forward vector f:
        let f_prime = rotMat.multiplyVector3(f);

        // update "at" vector to be : at = eye + f_prime
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panUp() {
        console.log("in panUp");
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // cross prod for vertical pan
        let y = Vector3.cross(f, this.up);
        y.normalize();

        // rotate the vector f by 1 degree
        let rotMat = new Matrix4().rotate(0.5, y.elements[0], y.elements[1], y.elements[2]);
        let f_prime = rotMat.multiplyVector3(f);

        // update vectors
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panDown() {
        console.log("in panDown");
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // cross prod for vertical pan
        let y = Vector3.cross(f, this.up);
        y.normalize();

        // rotate vector f by 1 degree
        let rotMat = new Matrix4().rotate(-0.5, y.elements[0], y.elements[1], y.elements[2]);
        let f_prime = rotMat.multiplyVector3(f);

        // update vectors
        this.at.set(this.eye);
        this.at.add(f_prime);
    }
}