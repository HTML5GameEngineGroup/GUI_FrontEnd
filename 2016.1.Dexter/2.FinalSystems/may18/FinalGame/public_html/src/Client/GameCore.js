/*
 * File: GameCore.js 
 * This is created when the application starts.
 * It has all the game data and the starting code that makes the application run. 
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, GameObject, Scene, Camera, vec2, gNextObjectID, gCurrentScene */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function GameCore() {
    gCurrentScene = new ClientScene(0);
    
    // Objects and textures are shared among all scenes
    
    this.mObjectList = [];  // Each entry is: [object representing a class, code as a string, 0/1/2/3 for class/GO/Class inst/GO inst]
    this.mTextureList = [];
    this.mSceneList = [];   // Each scene has its own instance list AND camera list
    
    // Add one scene for starters (and run it)
    this.mSceneList.push(gCurrentScene);
    gEngine.Core.initializeEngineCore('GLCanvas', gCurrentScene);

    this.mSelectedCamera = null;    // Cam
    this.mSelected = null;          // GO, Class, or instance of GO or Class
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

GameCore.prototype.setSelected = function(obj) {
    this.mSelected = obj;
};

GameCore.prototype.createDefaultObject = function(number, type) {    
    var obj;
    var name = "GameObj" + number;
    
    while (this.checkForNameConflict(name)) {
        gNextObjectID++; // This has not been incremented yet so do it here.  After this method is over, + Object will increment it to a unique value.
        name = "GameObj" + gNextObjectID;
    }
    
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
        if (!gRunning) {
            // Updated current list item in View after this is called
            createDetailsObjects(type);
        }
        
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
        if (!gRunning) {
            // Updated current list item in View after this is called
            createDetailsObjects(type);
        }
    }
    // Now update the drop down to default to this option
    if ($('#panelBottomInstances').hasClass('current-tab')) {
        createPanelBottomInstancesSelect(this.mObjectList[this.mObjectList.length - 1][0].mName);
    }
};

GameCore.prototype.deleteObjectAt = function(index) {
    // Remove the object at an index
    if (index > -1) {
        // Remove all instances of this object
        var id = this.mObjectList[index][0].mID;    // Raw ID (with "objectListItem" attached)
        id = id.substring(14, id.length);           //Just the suffix of the raw ID
        var i;
        var list = this.getInstanceList();
        
        // Loop and remove the instances
        for (i = 0; i < list.length; i++) {
            var id2 = list[i].mID;                 // Same deal here.  Cut off "instanceListItem"
            if (id2.substring(16, id2.length) === id) {
                list.splice(i, 1);
                i--;    // Spliced one.  Now we have to decrement i so when it does i++, we don't advance
            }
        }
        
        // Now refresh the bottom panel
        createPanelBottomInstances();
        
        // Empty the code, then delete the object
        window[this.mObjectList[index][0].mName] = function() {
        
        };
        // Finally, splice it.  View handles updating the side panel, since it has the relevant info.
        this.mObjectList.splice(index, 1);
        
        this.mSelected = null;
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
    if (!gRunning) {
        changeCurrentListItem(this.mSelected[0].mID);
        createDetailsObjects(this.mSelected[2]);
    }
    if ($('#panelBottomInstances').hasClass('current-tab')) {
        createPanelBottomInstancesSelect(this.mSelected[0].mName);
    }
    return this.mSelected;
};

GameCore.prototype.selectInstance = function(index) {
    // Select the object at the index
    this.mSelected = this.getInstanceList()[index];
    cleanUpPanelRightBody();
    var type = 2;
    if (this.mSelected instanceof GameObject) {
        type = 3;
    }
    if (!gRunning) {
        changeCurrentListItem(this.mSelected.mID);
        createDetailsObjects(type); // 2 = instance
    }
    // No need to check if the instance tab is open.  It MUST be open if you're selecting an instance.
    createPanelBottomInstancesSelect(this.mSelected.mName);
    return this.mSelected;
};

GameCore.prototype.selectCamera = function(index) {
    // Select the camera at the index
    var list = gCurrentScene.getCameraList();
    this.mSelectedCamera = list[index];
    createPanelBottomCameras();
    cleanUpPanelRightBody();
    if (!gRunning) {
        changeCurrentListItem(this.mSelectedCamera.mID);
        createDetailsCameras();
    }
    return this.mSelectedCamera;
};

GameCore.prototype.deleteInstance = function(index) {
    // Delete the instance.  If the instance is also the selected, then clean up the panel
    var list = this.getInstanceList();
    var instance = list[index];
    if (this.mSelected === instance) {
        cleanUpPanelRightBody();
        this.mSelected = null;
    }
    this.getInstanceList().splice(index, 1);
    
    // No need to check if the instance tab is open.  It MUST be open if you're deleting an instance.
    createPanelBottomInstances();
};

GameCore.prototype.deleteScene = function(index) {
    var newID = gCurrentScene.mID;
    if (gCurrentScene === this.mSceneList[index]) {
        cleanUpPanelRightBody();
        // Select the scene before as a replacement -- be careful about negative indices
        if (index === 0) {
            if (this.mSceneList.length <= 1) {
                // We are splicing the only scene in the list
                this.selectScene(null);
            } else {
                // We have other scenes, so pick scene 1
                this.selectScene(1);
                if (!gRunning) {
                    newID = this.mSceneList[1].mID;
                    createDetailsScenes();
                }
            }
        } else {
            // Simply pick the scene before
            this.selectScene(index - 1);
            if (!gRunning) {
                newID = this.mSceneList[index - 1].mID;
                createDetailsScenes();
            }
        }
    }
    this.mSceneList.splice(index, 1);
    createPanelBottomScenes();
    changeCurrentListItem(newID);
};

GameCore.prototype.createDefaultCamera = function(number) {
    var cam = new Camera(
        vec2.fromValues(20,60), // position of the camera
        50,                     // width of camera
        [0,0,640,480]           // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    var name = "Camera" + number;

    while (this.checkForNameConflictCamera(name)) {
        gCurrentScene.mNextCameraID++;
        name = "Camera" + gCurrentScene.mNextCameraID;
    }
    cam.mName = name;
    cam.mID = "cameraListItem" + number; // This is still unique despite the check (doesn't need to be updated to the next cam id)
    gCurrentScene.mNextCameraID++;
    //gCurrentScene.addCamera(cam);  // The scene already adds it for us so we don't need to add it again
    var list = gCurrentScene.getCameraList();
    this.selectCamera(list.length - 1); // Refreshes
};

GameCore.prototype.getSelectedCamera = function() {
    return this.mSelectedCamera;
};

GameCore.prototype.deleteCamera = function(index) {
    var wasCurrentCam = false;
    // Delete the camera.  If the instance is also the camera, then clean up the panel
    var list = gCurrentScene.getCameraList();
    var cam = list[index];
    if (this.mSelectedCamera === cam) {
        cleanUpPanelRightBody();
        this.mSelectedCamera = null;
        wasCurrentCam = true;
    }
    list.splice(index, 1);
    
    // No need to check if the camera tab is open.  It MUST be open if you're deleting a camera.
    createPanelBottomCameras();
    if (!wasCurrentCam) {
        changeCurrentListItem(this.mSelectedCamera.mID);
    }
};

GameCore.prototype.getCameraList = function() {
    return gCurrentScene.getCameraList();
};

GameCore.prototype.getInstanceList = function() {
    return gCurrentScene.getInstanceList();
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

GameCore.prototype.checkForNameConflictScene = function(name) {
    // Returns true if the name appears more than once
    var result = false;
    var i;
    for (i = 0; i < this.mSceneList.length; i++) {
        if (this.mSceneList[i].mName === name) {
            result = true;
            i = this.mSceneList.length; // Break
        }
    }
    return result;
};

GameCore.prototype.checkForNameConflictCamera = function(name) {
    // Returns true if the name appears more than once
    var result = false;
    var i;
    var list = gCurrentScene.getCameraList();
    for (i = 0; i < list.length; i++) {
        if (list[i].mName === name) {
            result = true;
            i = list.length; // Break
        }
    }
    return result;
};

GameCore.prototype.getSceneByName = function(name) {
    var result = null;
    var i;
    for (i = 0; i < this.mSceneList.length; i++) {
        if (this.mSceneList[i].mName === name) {
            result = this.mSceneList[i];
            i = this.mSceneList.length; // Break
        }
    }
    return result;
};

GameCore.prototype.getSceneIndexByName = function(name) {
    var result = null;
    var i;
    for (i = 0; i < this.mSceneList.length; i++) {
        if (this.mSceneList[i].mName === name) {
            return i;
        }
    }
    return -1;
};

GameCore.prototype.createDefaultScene = function(number) {
    // Create a default scene with a default name.  It becomes the selected scene.
    var scene = new ClientScene(number);
    while (this.checkForNameConflictScene(scene.mName)) {
        gNextSceneID++; // This has not been incremented yet so do it here.  After this method is over, + Scene will increment it to a unique value.
        scene.mName = "Scene" + gNextSceneID;
    }
    this.mSceneList.push(scene);

    // Set selected scene
    this.selectScene(this.mSceneList.length - 1);
    cleanUpPanelRightBody();
    if (!gRunning) {
        // Updated current list item in View after this is called
        createDetailsScenes();
    }
};

GameCore.prototype.selectScene = function(index) {
    // Select the scene at the index and run it too
    gEngine.GameLoop.stop();
    if (index !== null) {
        gCurrentScene = this.mSceneList[index];
        gEngine.Core.startScene(gCurrentScene);
    } else {
        this.runBlankScene();
    }
    return gCurrentScene;
};

GameCore.prototype.addInstance = function(inst) {
    // Add it to the selected scene (note: inst is just the object to add -- it is not in an array or anything)
    gCurrentScene.addInstance(inst);
    // Select it
    this.mSelected = inst;
    cleanUpPanelRightBody();
    var type = 2;
    if (inst instanceof GameObject) {
        type = 3;
    }
    if (!gRunning) {
        // Updated current list item in View after this is called
        createDetailsObjects(type);
    }
    $('#panelBottomScenes').removeClass('current-tab');
    $('#panelBottomCameras').removeClass('current-tab');
    $('#panelBottomInstances').addClass('current-tab');
    createPanelBottomInstances();
    createPanelBottomInstancesSelect(inst.mName);
};

GameCore.prototype.runBlankScene = function() {
    var blank = new ClientScene(-1);
    gCurrentScene = blank;
    blank.mName = "";
    blank.mID = "sceneListItemBlank";
    gEngine.Core.startScene(blank);
    blank.mAllCamera[1] = new Camera(
        vec2.fromValues(20,60),   // position of the camera
        50,                        // width of camera
        [0,0,640,480]        // viewport (orgX, orgY, width, height)
    );
    blank.mAllCamera[1].setBackgroundColor([77.0/256, 73.0/256, 72.0/256, 1]); // That's #4d4948, the background color
};

/*
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

var getDefaultCodeClass = function(name, id) {
    return 'function ' + name +
'() {\n\
    this.mName = "' + name + '";\n\
    this.mID = "' + id + '";\n\
}';
};*/

var getDefaultCodeGO = function(name) {
    return 'window["' + name + '"] = function(renderableObj) {\n\
    GameObject.call(this, renderableObj);\n\
    this.mCollidableFlag = false;\n\
    this.mCollisionPixelFlag = false;\n\
    this.mDestroy = false;\n\
}\n\
gEngine.Core.inheritPrototype(window["' + name + '"], window["GameObject"]);\n\
\n\
' + name + '.prototype.update = function() {\n\
    GameObject.prototype.update.call(this);\n\
};\n\
\n\
' + name + '.prototype.draw = function(aCamera) {\n\
    GameObject.prototype.draw.call(this, aCamera);\n\
};\n\
\n\
' + name + '.prototype.onCollisionStay = function(otherObj) {\n\
    \n\
};\n\
\n\
' + name + '.prototype.onCollisionEnter = function(otherObj) {\n\
    \n\
};\n\
\n\
' + name + '.prototype.onCollisionExit = function(otherObj) {\n\
    \n\
};';
};

var getDefaultCodeClass = function(name, id) {
    return 'window["' + name + '"] = function() {\n\
    this.mName = "' + name + '";\n\
    this.mID = "' + id + '";\n\
}';
};