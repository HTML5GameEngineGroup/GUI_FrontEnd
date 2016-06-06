/* File: GameObject.js 
 *
 * Abstracts a game object's behavior and apparance
 */

/*jslint node: true, vars: true */
/*global vec2, vec3, BoundingBox */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameObject(pgo) {
    this.mRenderComponent = new Renderable();    
    this.mVisible = true;
    this.mCurrentFrontDir = vec2.fromValues(0, 1);  // this is the current front direction of the object
    this.mSpeed = 0;
    this.mPhysicsComponent = null;
    
    this.mParent = pgo;
    
    this.mXform = new Transform();
    
    // Initialize the color
    this.mRenderComponent.setColor(this.mParent.getColor());
};

GameObject.prototype.getXform = function () {
    //return this.mRenderComponent.getXform();
    return this.mXform;
};

GameObject.prototype.getBBox = function () {
    var xform = this.getCombinedXform();
    var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
    return b;
};
GameObject.prototype.setVisibility = function (f) { this.mVisible = f; };
GameObject.prototype.isVisible = function () { return this.mVisible; };

GameObject.prototype.setSpeed = function (s) { this.mSpeed = s; };
GameObject.prototype.getSpeed = function () { return this.mSpeed; };
GameObject.prototype.incSpeedBy = function (delta) { this.mSpeed += delta; };

GameObject.prototype.setCurrentFrontDir = function (f) { vec2.normalize(this.mCurrentFrontDir, f); };
GameObject.prototype.getCurrentFrontDir = function () { return this.mCurrentFrontDir; };

GameObject.prototype.getRenderable = function () { return this.mRenderComponent; };

GameObject.prototype.setPhysicsComponent = function (p) { this.mPhysicsComponent = p; };
GameObject.prototype.getPhysicsComponent = function () { return this.mPhysicsComponent; };

GameObject.prototype.setColor = function (color) { this.mRenderComponent.setColor(color); };
GameObject.prototype.getColor = function () { return this.mRenderComponent.getColor(); };

GameObject.prototype.setName = function (name) { this.mName = name; };
GameObject.prototype.getName = function () { return this.mName; };

GameObject.prototype.getParent = function () { return this.mParent; };

// Code-----------------

GameObject.prototype.setCode = function (script) {
    this.mParent.setCode(script);
};
GameObject.prototype.getCode = function () { return this.mParent.getCode(); };

GameObject.prototype.setScriptUpdate = function (script) {
    this.mParent.setScriptUpdate(script);
};
GameObject.prototype.getScriptUpdate = function () { return this.mScriptUpdate; };

GameObject.prototype.setScriptUpdateSuccess = function (value) {
    this.mParent.setScriptUpdateSuccess(value);
};
GameObject.prototype.getScriptUpdateSuccess = function () { return this.mParent.getScriptUpdateSuccess(); };

GameObject.prototype.setCodeSuccess = function (value) {
    this.mParent.setCodeSuccess(value);
};
GameObject.prototype.getCodeSuccess = function () { return this.mParent.getCodeSuccess(); };

// Code end-----------------

GameObject.prototype.getCombinedXform = function() {
    var combined = new Transform();
    var px = this.mParent.getXform();
    combined.setXPos(this.mXform.getXPos() + px.getXPos());
    combined.setYPos(this.mXform.getYPos() + px.getYPos());
    combined.setRotationInDegree(this.mXform.getRotationInDegree() + px.getRotationInDegree());
    combined.setWidth(this.mXform.getWidth() * px.getWidth());
    combined.setHeight(this.mXform.getHeight() * px.getHeight());
    return combined;
};

// Orientate the entire object to point towards point p
// will rotate Xform() accordingly
GameObject.prototype.rotateObjPointTo = function (p, rate) {
    // Step A: determine if reach the destination position p
    var dir = [];
    vec2.sub(dir, p, this.getXform().getPosition());
    var len = vec2.length(dir);
    if (len < Number.MIN_VALUE) {
        return; // we are there.
    }
    vec2.scale(dir, dir, 1 / len);

    // Step B: compute the angle to rotate
    var fdir = this.getCurrentFrontDir();
    var cosTheta = vec2.dot(dir, fdir);

    if (cosTheta > 0.999999) { // almost exactly the same direction
        return;
    }

    // Step C: clamp the cosTheda to -1 to 1 
    // in a perfect world, this would never happen! BUT ...
    if (cosTheta > 1) {
        cosTheta = 1;
    } else {
        if (cosTheta < -1) {
            cosTheta = -1;
        }
    }

    // Step D: compute whether to rotate clockwise, or counterclockwise
    var dir3d = vec3.fromValues(dir[0], dir[1], 0);
    var f3d = vec3.fromValues(fdir[0], fdir[1], 0);
    var r3d = [];
    vec3.cross(r3d, f3d, dir3d);

    var rad = Math.acos(cosTheta);  // radian to roate
    if (r3d[2] < 0) {
        rad = -rad;
    }

    // Step E: rotate the facing direction with the angle and rate
    rad *= rate;  // actual angle need to rotate from Obj's front
    vec2.rotate(this.getCurrentFrontDir(), this.getCurrentFrontDir(), rad);
    this.getXform().incRotationByRad(rad);
};

GameObject.prototype.update = function () {
    
    var pos = this.getCombinedXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());

    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.update();
    }
    
    // Pass it in so it knows which script to call
    if (this.mParent.getScriptUpdateSuccess()) {
        this.executeScript(this.mParent.getScriptUpdate());
    }
};

GameObject.prototype.draw = function (aCamera) {
    // Combine the 2 xforms and give to renderable component
    var combined = this.getCombinedXform();
    this.mRenderComponent.setColor(this.getColor());
    
    // Set new xform -- now it's ready to draw!
    this.mRenderComponent.setXform(combined);
    
    if (this.isVisible()) {
        this.mRenderComponent.draw(aCamera);
    }
    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.draw(aCamera);
    }
};

GameObject.prototype.executeScript = function(script) {
    var header = "var self = this;"
    
    // Check contents for initial issues
    var msg = "Error:";
    var secondary = "\n\nYour script will be disabled until the error is fixed.";
    if (script.includes("$")) {
        msg = msg + "\nThe symbol \"$\" is not allowed in the script.";
    }
    if (script.includes("document")) {
        msg = msg + "\nThe term \"document\" is not allowed in the script.";
    }
    if (script.includes("window")) {
        msg = msg + "\nThe term \"window\" is not allowed in the script.";
    }
    if (msg !== "Error:") {
        alert(msg + secondary);
        this.mParent.setScriptUpdateSuccess(false);
    } else {
        // It survived initial checks so try the script
        try {
            eval(header + script);
        } catch (error) {
            alert("Error:\n" + error + secondary);
            this.mParent.setScriptUpdateSuccess(false);
        }
    }
};

GameObject.prototype.runAll = function(functions) {
    // Concatenate code, with functions first so the other code can recognize it
    var header = "var self = this;"
    var script = functions + this.mParent.getCode();
    
    // Check contents for initial issues
    var msg = "Error:";
    var secondary = "\n\nYour script will be disabled until the error is fixed.";
    if (script.includes("$")) {
        msg = msg + "\nThe symbol \"$\" is not allowed in the script.";
    }
    if (script.includes("document")) {
        msg = msg + "\nThe term \"document\" is not allowed in the script.";
    }
    if (script.includes("window")) {
        msg = msg + "\nThe term \"window\" is not allowed in the script.";
    }
    if (msg !== "Error:") {
        alert(msg + secondary);
        this.mParent.setCodeSuccess(false);
    } else {
        // It survived initial checks so try the script
        try {
            eval(header + script);
        } catch (error) {
            alert("Error:\n" + error + secondary);
            this.mParent.setCodeSuccess(false);
        }
    }
};

// Returns a new list with the name, xform info, and all contents in that order
GameObject.prototype.getAllContents = function() {
    var list = [];
    list[0] = new Content("Name", this.mName);
    list[1] = new Content("XPos", this.mXform.getXPos());
    list[2] = new Content("YPos", this.mXform.getYPos());
    list[3] = new Content("Rotation", this.mXform.getRotationInDegree());
    list[4] = new Content("Width", this.mXform.getWidth());
    list[5] = new Content("Height", this.mXform.getHeight());
    list[6] = new Content("Color", this.mColor);
    // There are 2 places (besides fileLoad) in view.js that use a hard-coded value of 8 for the script.  Change them if needed.
    list[7] = new Content("Edit Script (Update)", this.mScriptUpdate);
    list[8] = new Content("Edit Code", this.mCode);
    var i;
    var contents = this.mParent.getContents();
    for (i = 0; i < contents.length; i++) {
        // Add each content to the end of the list
        list[i + 9] = contents[i];
    }
    return list;
};