class Camera {
    constructor() {
        this.fov = 60;
        this.eye = Vector(0, 0, 0);
        this.at = Vector(0, 0, -1);
        this.up = Vector(0, 1, 0);

        this.viewMat = newMatrix4();
        this.viewMat.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
                                this.at.elements[0], this.at.elements[1], this.at.elements[2],
                                this.up.elements[0], this.up.elements[1], this.up.elements[2]);

        this.projMat = newMatrix4();
        this.projMat.setLookAt(this.fov, canvas.width/canvas.height, 0.1, 100)
    }
    /*
    In your camera class, create a function called "moveForward":
    Compute forward vector f = at - eye. 
    Create a new vector f: let f = new Vector3();
    Set f to be equal to at: f.set(at);
    Subtract eye from f: f.sub(eye);
    Normalize f using f.normalize(); 
    Scale f by a desired "speed" value: f.mul(speed)
    Add forward vector to both eye and center: eye += f; at += f; 

      moveForward() {
    let f = new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    f.normalize();
    f.mul(this.speed);

    this.eye.add(f);
    this.at.add(f);

    this.viewMat.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],
                           this.at.elements[0],this.at.elements[1],this.at.elements[2],
                           this.up.elements[0],this.up.elements[1],this.up.elements[2]);
  }

    */
    moveForward() {
        console.log("in moveForward()");
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.1); // FIXME: change speed
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
    }

    moveBack() {
        console.log("in moveBack()");
        let b = new Vector3();
        b.set(this.at);
        (this.eye).sub(b);
        b.normalize();
        b.mul(0.1);
        this.eye = this.eye.add(b);
        this.at = this.at.add(b);
    }

    moveLeft() {
        // compute forward vector
        console.log("in moveLeft()");
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(0.1);

        // compute side vector
        let s = Vector3.cross(this.up, f);
        s = f.cross(this.up);
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
        f.mul(0.1);

        // compute side vector
        let s = Vector3.cross(this.up, f);
        this.up = f.cross(s);
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