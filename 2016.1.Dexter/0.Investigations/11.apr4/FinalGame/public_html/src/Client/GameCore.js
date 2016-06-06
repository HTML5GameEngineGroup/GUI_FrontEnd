/*
 * File: GameCore.js 
 * This is created when the application starts.
 * It has all the game data and the starting code that makes the application run. 
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene */

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
}

GameCore.prototype.getObjectList = function () {
    return this.mObjectList;
};

GameCore.prototype.getTextureList = function () {
    return this.mTextureList;
};

GameCore.prototype.getCameraList = function () {
    return this.mCameraList;
};

GameCore.prototype.getSceneList = function () {
    return this.mSceneList;
};

GameCore.prototype.createDefaultObject = function (number) {
    // TODO: we want to subclass GameObject and make a totally new Object.  Doing that later, though.
    
    var go = new GameObject(new Renderable());
    var xf = go.getXform();
    xf.setXPos(20);
    xf.setYPos(20);
    xf.setWidth(5);
    xf.setHeight(5);
    go.mName = "GameObject" + number;
    go.mID = "objectListItem" + number;
    
    this.mObjectList[this.mObjectList.length] = go;
    this.mSelected = go; // Also change the selected object
};

GameCore.prototype.deleteObjectAt = function (index) {
    // Remove the object with the given HTML id
    if (index > -1) {
        this.mObjectList.splice(index, 1);
    }
};