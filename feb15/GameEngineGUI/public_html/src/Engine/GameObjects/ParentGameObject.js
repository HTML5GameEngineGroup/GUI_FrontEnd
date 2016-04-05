/* File: ParentGameObject.js 
 *
 * Only has the parent data.  Used for creating instances, which have functionality.
 */

/*jslint node: true, vars: true */
/*global Content */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ParentGameObject(name) {
    this.mName = name;
    this.mXform = new Transform();
    this.mColor = [1,0,0,1];
    
    this.mScriptUpdate = "";
    this.mScriptUpdateSuccess = false;
    this.mCode = ""; // Code to be run by all the children, in addition to passed in and appended global function code
    this.mCodeSuccess = false;
    
    this.mContents = [];
};

ParentGameObject.prototype.getXform = function () {
    return this.mXform;
};

ParentGameObject.prototype.setScriptUpdateSuccess = function (value) { this.mScriptUpdateSuccess = value; };
ParentGameObject.prototype.getScriptUpdateSuccess = function () { return this.mScriptUpdateSuccess; };

ParentGameObject.prototype.setCodeSuccess = function (value) { this.mCodeSuccess = value; };
ParentGameObject.prototype.getCodeSuccess = function () { return this.mCodeSuccess; };

ParentGameObject.prototype.setScriptUpdate = function (script) {
    if (this.mScriptUpdate !== script) {    // In case it is the same script (e.g. the user clicked on a different text box, do not reset the script flag)
        this.mScriptUpdate = script;
        this.mScriptUpdateSuccess = true;   // It will let you try this script.  If it fails, it'll go false.
    }
};
ParentGameObject.prototype.getScriptUpdate = function () { return this.mScriptUpdate; };

ParentGameObject.prototype.setCode = function (script) {
    if (this.mCode !== script) {    // In case it is the same script (e.g. the user clicked on a different text box, do not reset the script flag)
        this.mCode = script;
        this.mCodeSuccess = true;   // It will let you try this script.  If it fails, it'll go false.
    }
};
ParentGameObject.prototype.getCode = function () { return this.mCode; };



ParentGameObject.prototype.setColor = function (color) { this.mColor = color; };
ParentGameObject.prototype.getColor = function () { return this.mColor; };

ParentGameObject.prototype.setName = function (name) { this.mName = name; };
ParentGameObject.prototype.getName = function () { return this.mName; };

ParentGameObject.prototype.setCode = function (script) {
    if (this.mCode !== script) {    // In case it is the same script (e.g. the user clicked on a different text box, do not reset the script flag)
        this.mCode = script;
        this.mCodeSuccess = true;   // It will let you try this script.  If it fails, it'll go false.
    }
};
ParentGameObject.prototype.getCode = function () { return this.mCode; };


ParentGameObject.prototype.getCode = function () { return this.mCode; };
ParentGameObject.prototype.getContents = function () { return this.mContents; };

// Returns a new list with the name, xform info, and all contents in that order
ParentGameObject.prototype.getAllContents = function() {
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