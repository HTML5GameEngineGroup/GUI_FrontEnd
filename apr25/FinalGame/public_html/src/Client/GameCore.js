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
    
    this.mObjectList = [];  // Each entry is: [object representing a class, code as a string, 0/1/2/3 for class/GO/Class inst/GO inst]
    this.mTextureList = [];
    this.mSceneList = [];   // Each scene has its own instance list AND camera list
            
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

GameCore.prototype.createDefaultObject = function(name, number, type) {    
    var obj;
       
    if (type === 1) {
        window[name] = function(renderableObj) {
            GameObject.call(this, renderableObj);
        };
            
        gEngine.Core.inheritPrototype(window[name], window["GameObject"]);
        
        var code = getDefaultCodeGO(name);
        
        // Add code to system
        eval(code);
        eval('obj = new ' + name + '(new Renderable());');
            
        // Make a default xform
        var xf = obj.getXform();
        xf.setXPos(20);
        xf.setYPos(60);
        xf.setWidth(5);
        xf.setHeight(5);
        obj.mName = name;
        obj.mID = "objectListItem" + number;
        
        var entry = [obj, code, type]; // type = 1
        this.mObjectList[this.mObjectList.length] = entry;
        this.mSelected = entry;
        cleanUpPanelRightBody();
        createDetailsObjects(type);
        
    } else {
        // Reset class
        window[name] = function() {
            
        };
        
        var code = getDefaultCodeClass(name, "objectListItem" + number);
        
        // Instantiate with eval to allow using a string name when creating a new class
        eval('obj = new ' + name + '();');
        
        this.mObjectList[this.mObjectList.length] = [obj, code, type]; // type = 0
        this.mSelected = this.mObjectList[this.mObjectList.length];
        cleanUpPanelRightBody();
        createDetailsObjects(type);
    }
};

GameCore.prototype.deleteObjectAt = function(index) {
    // Remove the object at an index
    if (index > -1) {
        // Empty the code, then delete the object
        window[this.mObjectList[index][0].mName] = function() {
            
        };
        this.mObjectList.splice(index, 1);
    }
};

GameCore.prototype.getObjectAt = function(index) {
    // Returns the object at an index WITHOUT SELECTING IT
    return this.mObjectList[index];
};

/*
GameCore.prototype.getTypeAt = function(index) {
    // Returns true/false for whether or not it is a GO at an index WITHOUT SELECTING IT
    return this.mObjectList[index][2];
};*/

GameCore.prototype.select = function(index) {
    // Select the object at the index
    this.mSelected = this.mObjectList[index];
    cleanUpPanelRightBody();
    createDetailsObjects(this.mSelected[2]);
    return this.mSelected;
};

GameCore.prototype.selectInstance = function(index) {
    // Select the object at the index
    console.log(index);
    this.mSelected = this.getInstanceList()[index];
    cleanUpPanelRightBody();
    var type = 2;
    if (this.mSelected instanceof GameObject) {
        type = 3;
    }
    createDetailsObjects(type); // 2 = instance
    return this.mSelected;
};

GameCore.prototype.addInstance = function(inst) {
    // Add it to the selected scene (note: inst is just the object to add -- it is not in an array or anything)
    // Also selects it
    this.mSelectedScene.addInstance(inst);
    this.mSelected = inst;
    cleanUpPanelRightBody();
    var type = 2;
    if (this.mSelected instanceof GameObject) {
        type = 3;
    }
    createDetailsObjects(type); // 2 = instance
};

GameCore.prototype.getCameraList = function() {
    // Add it to the selected scene
    return this.mSelectedScene.getCameraList();
};

GameCore.prototype.getInstanceList = function() {
    // Add it to the selected scene
    return this.mSelectedScene.getInstanceList();
};

var getDefaultCodeGO = function(name) {
    return 'function ' + name + '(renderableObj) {\n\
    GameObject.call(this, renderableObj);\n\
}\n\
\n\
' + name + '.prototype.update = function() {\n\
    GameObject.prototype.update.call(this);\n\
};\n\
\n\
' + name + '.prototype.draw = function(aCamera) {\n\
    GameObject.prototype.draw.call(this, aCamera);\n\
};';
};

GameCore.prototype.checkForNameConflict = function(name) {
    // Returns true if the name appears more than once
    var result = false;
    var i;
    for (i = 0; i < this.mObjectList.length; i++) {
        if (this.mObjectList[i][0].mName === name) {
            result = true;
            i = this.mObjectList.length; // Break
        }
    }
    return result;
};

var getDefaultCodeClass = function(name, id) {
    return 'function ' + name +
'() {\n\
    this.mName = "' + name + '";\n\
    this.mID = "' + id + '";\n\
}';
};