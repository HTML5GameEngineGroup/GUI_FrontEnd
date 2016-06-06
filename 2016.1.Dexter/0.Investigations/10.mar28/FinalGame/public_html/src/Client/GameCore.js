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
    // Objects, textures, and cameras are shared among all scenes (scenes have some of their own lists)
    
    this.mObjectList = [];
    this.mTextureList = [];
    //this.mCameraList = [];
    this.mSceneList = []; // Each scene has its own instance list AND camera list
        
    // Add one scene for starters (and run it)
    var scene = new ClientScene();
    this.mSceneList.push(scene);
    gEngine.Core.initializeEngineCore('GLCanvas', scene);
    
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