/* File: Prefab.js 
 *
 * Only has the parent data.  Used for creating instances, which have functionality.
 */

/*jslint node: true, vars: true */
/*global Content */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Prefab(name) {
    this.mName = name;
    this.mXform = new Transform();
    this.mColor = [1,0,0,1];
    
    this.mScriptUpdate = "";
    this.mScriptUpdateSuccess = false;
    this.mCode = ""; // Code to be run by all the children, in addition to passed in and appended global function code
    this.mCodeSuccess = false;
    
    this.mContents = [];
    
    this.mInstances = [];
    this.mFunctionNames = ["update"];
};

Prefab.prototype.createNewInstance = function () {
    var instance = new GameObject(this);
    this.mInstances.push(instance);

    return instance;
};

Prefab.prototype.getInstances = function () {
    return this.mInstances;
};

Prefab.prototype.setScriptUpdateSuccess = function (value) { this.mScriptUpdateSuccess = value; };
Prefab.prototype.getScriptUpdateSuccess = function () { return this.mScriptUpdateSuccess; };

Prefab.prototype.setCodeSuccess = function (value) { this.mCodeSuccess = value; };
Prefab.prototype.getCodeSuccess = function () { return this.mCodeSuccess; };

Prefab.prototype.setScriptUpdate = function (script) {
    if (this.mScriptUpdate !== script) {    // In case it is the same script (e.g. the user clicked on a different text box, do not reset the script flag)
        this.mScriptUpdate = script;
        this.mScriptUpdateSuccess = true;   // It will let you try this script.  If it fails, it'll go false.
    }
};

Prefab.prototype.getScriptUpdate = function () { return this.mScriptUpdate; };

Prefab.prototype.setCode = function (script) {
    if (this.mCode !== script) {    // In case it is the same script (e.g. the user clicked on a different text box, do not reset the script flag)
        this.mCode = script;
        this.mCodeSuccess = true;   // It will let you try this script.  If it fails, it'll go false.
    }
};
Prefab.prototype.getCode = function () { return this.mCode; };

Prefab.prototype.setColor = function (color) { this.mColor = color; };
Prefab.prototype.getColor = function () { return this.mColor; };

Prefab.prototype.setName = function (name) { this.mName = name; };
Prefab.prototype.getName = function () { return this.mName; };
Prefab.prototype.getXform = function () { return this.mXform; };

Prefab.prototype.getFunctionNames = function () { return this.mFunctionNames; };

Prefab.prototype.getContents = function () { return this.mContents; };

// Note: the Prefab's update is NEVER CALLED!  It's given to the instances, which call it.
// Write it as if you were running it from an instance (GameObject).  If for some reason, you decide to run it from Prefab, it will crash and burn.
Prefab.prototype.update = function () {
    
    //var pos = this.getCombinedXform().getPosition();
    var pos = this.getXform().getPosition();
    vec2.scaleAndAdd(pos, pos, this.getCurrentFrontDir(), this.getSpeed());

    // Physics
    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.update();
    }
    
    // Pass it in so it knows which script to call
    if (this.mPrefab.getScriptUpdateSuccess()) {
        this.executeScript(this.getScriptUpdate());
    }
};

// Returns a new list with the name, xform info, and all contents in that order
Prefab.prototype.getAllContents = function() {
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
    for (i = 0; i < this.mContents.length; i++) {
        // Add each content to the end of the list
        list[i + 9] = this.mContents[i];
    }
    return list;
};