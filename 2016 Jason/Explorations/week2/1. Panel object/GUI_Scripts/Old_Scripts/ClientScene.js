/*
 * File: ClientScene.js 
 * This is a scene template. 
 * 
 * But what does each cam in this scene draw?  each instance?  does the user get any choice?
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, vec2, View, GameObject, Renderable */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClientScene(number) {
    Scene.call(this);
    this.mName = "Scene" + number;
    this.mID = "sceneListItem" + number;
    this.mNextCameraID = 1; // Due to the starting camera being 0
    this.mAllCamera = [];
    this.mInstanceList = [];
    this.mAllUpdateSet = new GameObjectSet();
    this.isInitialized = false;
    this.mAllTextures = {};
	
	this.selectObject = null;
	this.rotationObject = null;
	this.sceneViewCamera = null;
	this.cameraObjects = [];
	this.cameraTexture = null;

}
gEngine.View.inheritPrototype(ClientScene, Scene);

ClientScene.prototype.loadScene = function() {
   // loads the audios
    //gEngine.AudioClips.loadAudio(this.kBgClip);
   // gEngine.AudioClips.loadAudio(this.kCue);
    //gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
    // gEngine.Textures.loadTexture("assets/minion_sprite.png");
    for (var texture in gGuiBase.TextureSupport.gAllTextures) {
        console.log("calling load texture from scene:", texture);
      gEngine.Textures.loadTexture(texture);
    };
	
	gEngine.Textures.loadTexture("assets/cameraicon.png");
};


ClientScene.prototype.unloadScene = function() {
    // Step A: Game loop not running, unload all assets
    // stop the background audio
    //gEngine.AudioClips.stopBackgroundAudio();

    // unload the scene resources
    // gEngine.AudioClips.unloadAudio(this.kBgClip);
    //      You know this clip will be used elsewhere in the game
    //      So you decide to not unload this clip!!
    //gEngine.AudioClips.unloadAudio(this.kCue);

    // JUST CALL gEngine.GameLoop.stop(); SOMEWHERE IN ORDER TO REACH THIS METHOD (I.E. CAUSES THE SCENE CHANGE)
    // BELOW IS WHERE YOU DECIDE THE NEXT SCENE

    // Step B: starts the next level
    // starts the next level
    //var nextLevel = new BlueLevel();  // next level to be loaded
    //gEngine.View.startScene(nextLevel);
    for (var texture in this.mAllTextures) {
        console.log('calling unload from scene', texture);
        gEngine.Textures.unloadTexture(texture);
    };
	
	gEngine.Textures.unloadTexture("assets/cameraicon.png");
};

ClientScene.prototype.initialize = function() {
    // Do not under any circumstances initialize a scene more than once.  It deletes all the stuff in it.
    if (this.isInitialized) {
		//console.log('Scene not initialized');
        return;
    }
    
    Scene.prototype.initialize.call(this);

    // Add this camera
    var cam = new Camera(
        vec2.fromValues(20,60),   // position of the camera
        50,                        // width of camera
        [0,0,640,480]        // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor([0.8,0.8,0.8,1]);
    cam.mName = "Camera0";  // Cameras don't have a mName, but we can just add it in like this
    cam.mID = "cameraListItem0";
	
	
	this.sceneViewCamera = new Camera(
			vec2.fromValues(20,60), // position of the camera
			50,                     // width of camera
			[0,0,640,480]           // viewport (orgX, orgY, width, height)
			);
	this.sceneViewCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
	this.sceneViewCamera.mName = "SceneCam"; 
    this.sceneViewCamera.mID = "SceneViewCamera";
	
	
    var cameraObject = new CameraObject(cam);
	this.cameraObjects.push(cameraObject);
	gGuiBase.SceneSupport.gCurrentScene.mAllCamera.push(cam);
	
    this.isInitialized = true;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
ClientScene.prototype.draw = function() {
	
	gEngine.View.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
	 
	if (!gGuiBase.Core.gRunning) {
		this.sceneViewCamera.setupViewProjection();
		for (var i = 0; i < this.mInstanceList.length; i++) {
            if (this.mInstanceList[i] instanceof GameObject) {
                this.mInstanceList[i].draw(this.sceneViewCamera);
            }
        }
		
		if (this.sceneViewCamera !== null && gGuiBase.Core.selectedGameObject !== null &&
			gGuiBase.Core.selectedGameObject.mID.includes('[')) { 
			if (this.selectObject !== null)
				this.selectObject.draw(this.sceneViewCamera);
			if (this.rotationObject !== null)
				this.rotationObject.draw(this.sceneViewCamera);
		}
		
		for(var i = 0; i < this.cameraObjects.length; i++) {
			this.cameraObjects[i].draw(this.sceneViewCamera);
		}
		
	} else {
		
		var i, j;
		for (i = 0; i < this.mAllCamera.length; i++) {
			var cam = this.mAllCamera[i];
			cam.setupViewProjection();
			
			for (j = 0; j < this.mInstanceList.length; j++) {
				if (this.mInstanceList[j] instanceof GameObject) {
					this.mInstanceList[j].draw(cam);
				}
			}
		}
	}
		
	//Selection should not be shown if there is no selection object, if the camera does not exist,
	// if there is no selected gameobject, and if the selected gameobject is an instance
	
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
ClientScene.prototype.update = function() {
    var i;
    for (i = 0; i < this.mAllCamera.length; i++) {
        this.mAllCamera[i].update();
    }
	
	for (i = 0; i < this.cameraObjects.length; i++) {
		this.cameraObjects[i].update();
	}
	
	this.sceneViewCamera.update();
    
    if (gGuiBase.Core.gRunning) {
        for (i = 0; i < this.mInstanceList.length; i++) {
            if (this.mInstanceList[i] instanceof GameObject) {
                if (this.mInstanceList[i].mDestroy) { // uses this variable to destroy from external pointer
                    this.mInstanceList.splice(i, 1);
                    i--;
                } else {
                    this.mInstanceList[i].update();
                }
            }
        }
    }
	
	if (this.selectObject !== null && gGuiBase.Core.selectedGameObject !== null) {
		this.selectObject.update()
	}
	
	if (this.rotationObject !== null && gGuiBase.Core.selectedGameObject !== null) {
		this.rotationObject.update()
	}
	
};

ClientScene.prototype.addInstance = function(inst) {
    this.mInstanceList.push(inst);
    return true;
};

ClientScene.prototype.addCamera = function(cam) {
    this.mAllCamera.push(cam);
    return true;
};

ClientScene.prototype.getCameraList = function() {
    return this.mAllCamera;
};

ClientScene.prototype.getSceneCamera = function() {
	//if (this.mAllCamera.length > 0) return this.mAllCamera[0];
	return this.sceneViewCamera;
	
};

ClientScene.prototype.setSceneCamera = function(camera) {
	this.sceneViewCamera = camera;
};

ClientScene.prototype.setInitialCameraObject = function() {
	if (this.cameraObjects.length === 0) {
		if (this.mAllCamera.length > 0) {
			var cameraObject = new CameraObject(this.mAllCamera[0]);
			this.cameraObjects.push(cameraObject);
		}
	}
};

ClientScene.prototype.getInstance = function ( instID ) {
    
};

ClientScene.prototype.getInstanceList = function() {
    return this.mInstanceList;
};

ClientScene.prototype.getInstanceNameList = function() {
    var instanceNames = [];
    var i;
    for (i=0; i < this.mInstanceList.length; i++) {
        if (this.mInstanceList[i] instanceof GameObject) { // i dont think this will be required
            instanceNames.push(this.mInstanceList[i].mID);
        }
    }
    return instanceNames;
};

ClientScene.prototype.getSelectObject = function() {
	return this.selectObject;
};

ClientScene.prototype.setSelectObject = function(selectObject) {
	this.selectObject = selectObject;
};

ClientScene.prototype.getRotationObject = function() {
	return this.rotationObject;
};

ClientScene.prototype.setRotationObject = function(rotationObject) {
	this.rotationObject = rotationObject;
};

ClientScene.prototype.collision = function() {
    if (!gGuiBase.Core.gRunning) {
        return;
    }
    
    var i;
    var j;
    for (i = 0; i < this.mInstanceList.length; i++) {
        var iGO = (this.mInstanceList[i] instanceof GameObject);
        for (j = 0; j < this.mInstanceList.length; j++) {
            var jGO = (this.mInstanceList[j] instanceof GameObject);
            
            if (i < j) {
                if (iGO && jGO && this.mInstanceList[i].mCollidableFlag) {
                    this.mInstanceList[i].collisionTest(this.mInstanceList[j]);
                }
            } else if (i > j) {
                if (iGO && jGO && this.mInstanceList[i].mCollidableFlag && !this.mInstanceList[j].mCollidableFlag) {
                    this.mInstanceList[i].collisionTest(this.mInstanceList[j]);
                }
            }
        }
        if (iGO && this.mInstanceList[i].mCollidableFlag) {
                this.mInstanceList[i].collisionExitTest();
        }
    }
};
