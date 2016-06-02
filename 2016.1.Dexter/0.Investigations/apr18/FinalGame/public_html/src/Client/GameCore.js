/*
 * File: GameCore.js 
 * This is created when the application starts.
 * It has all the game data and the starting code that makes the application run. 
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, GameObject */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameCore() {
    // Objects and textures are shared among all scenes
    
    this.mObjectList = [];
    this.mTextureList = [];
    this.mSceneList = []; // Each scene has its own instance list AND camera list
            
    // Add one scene for starters (and run it)
    var scene = new ClientScene();
    this.mSceneList.push(scene);
    gEngine.Core.initializeEngineCore('GLCanvas', scene);
    
    this.mSelectedScene = scene;
    this.mSelected = null;
    // The system is designed so that after selected is changed (to a camera, object, etc.),
    // the details panel is completely modified to accomodate the changed type.
    // As a result, everything in the details panel can assume the correct type.
    
    this.mSelectedForCode = null;
    // Just like selected but only contains an object when the user wants to edit its code
    // This is in case the user wants to change the selected object while keeping the code window open
    // This only works if you have a max of 1 code editor or floating code editor.  For multiple floating code editors,
    // massive architectural changes are needed
}

GameCore.prototype.getObjectList = function() {
    return this.mObjectList;
};

GameCore.prototype.getTextureList = function() {
    return this.mTextureList;
};

GameCore.prototype.getCameraList = function() {
    return this.mCameraList;
};

GameCore.prototype.getSceneList = function() {
    return this.mSceneList;
};

GameCore.prototype.getSelected = function() {
    return this.mSelected;
};

GameCore.prototype.getSelectedForCode = function() {
    return this.mSelectedForCode;
};

GameCore.prototype.setSelectedForCode = function(obj) {
    this.mSelectedForCode = obj;
};

GameCore.prototype.createDefaultObject = function(number) {
    
    // TODO: Allow renaming
    // This means you need to add a param "name" into this function
    // You also need to change the "#" id of each HTML object to reflect the name -- refer to the right-click menu in view
    
    var go;
    
    // TODO: Make them give us a name later so we don't have to use a default name like GameObject + number
    
    // Define the new class
    window["GameObject" + number] = function(renderableObj) {
        GameObject.call(this, renderableObj);
    };
    
    // Inherit
    gEngine.Core.inheritPrototype(window["GameObject" + number], window["GameObject"]);  //TODO: Here too.  Also, how would renaming work?
    
    // Instantiate with eval to allow using a string name when creating a new class
    eval('go = new GameObject' + number + '(new Renderable());');
    
    // Make a default xform
    var xf = go.getXform();
    xf.setXPos(20);
    xf.setYPos(60);
    xf.setWidth(5);
    xf.setHeight(5);
    go.mName = "GameObject" + number;
    go.mID = "objectListItem" + number;
    
    // Add to the list and change the selected object to the new object
    this.mObjectList[this.mObjectList.length] = go;
    this.mSelected = go;
    cleanUpPanelRightBody();
    createDetailsObjects();
};

GameCore.prototype.deleteObjectAt = function(index) {
    // Remove the object at an index
    if (index > -1) {
        this.mObjectList.splice(index, 1);
    }
};

GameCore.prototype.getObjectAt = function(index) {
    // Returns the object at an index WITHOUT SELECTING IT
    return this.mObjectList[index];
};

GameCore.prototype.select = function(index) {
    // Select the object at the index
    this.mSelected = this.mObjectList[index];
    cleanUpPanelRightBody();
    createDetailsObjects();
};

GameCore.prototype.addInstance = function(inst) {
    // Add it to the selected scene
    this.mSelectedScene.addInstance(inst);
};