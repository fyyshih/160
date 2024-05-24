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
        // console.log("in moveForward()");
        var f = new Vector3();
        console.log("after initializing f");
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        console.log(f.elements);
        // f.mul(0.1); // FIXME: change speed
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
        console.log("printing eye and at 2");
        console.log(this.eye.elements);
        console.log(this.at.elements);
    }

    moveBack() {
         //console.log("in moveBack()");
        var b = new Vector3();
        b.set(this.at);
        b.sub(this.eye);
        b.normalize();
        // b.mul(2000);
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
        // f.mul(2);

        // compute side vector
        let s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(0.1);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
        /*
        f = f.divide(f.length());
        s = f.cross(this.up);
        s = s.divide(s.length());
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
        */
    }

    moveRight() {
        console.log("in moveRight");
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        // f.mul(0.1);

        // compute side vector
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(0.1);
        this.eye = this.eye.add(s);
        this.at = this.at.add(s);
    }

    panLeft() {
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // rotate the vector f by alpha degrees around the up vector
        let rotMat = new Matrix4().rotate(alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // TODO: change alpha              ^^

        // multiply rotation matrix rotMat by forward vector f:
        let f_prime = rotMat.multiplyVector3(f);

        // update "at" vector to be : at = eye + f_prime
        this.at.set(this.eye);
        this.at.add(f_prime);
    }

    panRight() {
        // compute forward vector
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        // rotate the vector f by alpha degrees around the up vector
        let rotMat = new Matrix4().rotate(-alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // TODO: change alpha               ^^

        // multiply rotation matrix rotMat by forward vector f:
        let f_prime = rotMat.multiplyVector3(f);

        // update "at" vector to be : at = eye + f_prime
        this.at.set(this.eye);
        this.at.add(f_prime);
    }
}