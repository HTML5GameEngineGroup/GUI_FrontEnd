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

}
gEngine.Core.inheritPrototype(ClientScene, Scene);

ClientScene.prototype.loadScene = function() {
   // loads the audios
    //gEngine.AudioClips.loadAudio(this.kBgClip);
   // gEngine.AudioClips.loadAudio(this.kCue);
    //gEngine.TextFileLoader.loadTextFile(this.kSceneFile, gEngine.TextFileLoader.eTextFileType.eTextFile);
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
    //gEngine.Core.startScene(nextLevel);
};

ClientScene.prototype.initialize = function() {
    
    // Do not under any circumstances initialize a scene more than once.  It deletes all the stuff in it.
    if (this.isInitialized) {
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
    
    this.isInitialized = true;
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
ClientScene.prototype.draw = function() {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
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
};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
ClientScene.prototype.update = function() {
    
    //var i;
    //var j;
    //var instances;
    
    // Bug: it only allows one click.  then you have to choose a new gameobj from the gameobj list before it lets you click again
    // also havent updated the style of the obj list to match (see view's div.on click for list-style-whatever)
    // Check if an object is clicked on, and the game is NOT running currently
    /*if (!GlobalPlay && gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left)) {
        if (this.mCamera.isMouseInViewport()) {
            var bboxMouse = new BoundingBox([this.mCamera.mouseWCX(), this.mCamera.mouseWCY()], 1, 1);
            // Traverse backwards because the object at the front is at the end of the list
            for (i = GlobalPrefabList.length - 1; i >= 0; i--) {
                j;
                instances = GlobalPrefabList[i].getInstances();
                for (j = instances.length - 1; j >= 0; j--) {
                    var bboxObj = instances[j].getBBox();
                    if (bboxObj.boundCollideStatus(bboxMouse) > 0) {
                        // Got a collision between mouse and object
                        changeInstanceTo(i, j);  // View function
                        
                        // Escape all loops, we only needed one result
                        i = -1;
                        j = -1;
                    }
                }
            }
        }
    }*/

    
    var i;
    for (i = 0; i < this.mAllCamera.length; i++) {
        this.mAllCamera[i].update();
    }
    
    if (gRunning) {
        for (i = 0; i < this.mInstanceList.length; i++) {
            if (this.mInstanceList[i] instanceof GameObject) {
                if (this.mInstanceList[i].mDestroy) {
                    this.mInstanceList.splice(i, 1);
                    i--;
                } else {
                    // Circle bounds do not need to be checked anymore.  We are using a simplified collision formula where rotated objects will use circle collision
                    //this.mInstanceList[i].getRenderable().mCircleBound = this.mInstanceList[i].mCircleBound;
                    this.mInstanceList[i].update();
                }
            }
        }
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

ClientScene.prototype.getInstanceList = function() {
    return this.mInstanceList;
};

ClientScene.prototype.collision = function() {
    if (!gRunning) {
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

/*
 
// The following commented code lets regular Renderables collide, and works.
// However, it is being replaced by an extra else statement in GameObject_PixelCollision's pixelTouches().
// That else statement handles a simplified version of the issue, and is entered when one or both colliding objects are Renderables.
// It will handle circle to circle (if one or both are rotated), or bbox to bbox (none rotated), and no other cases.

Renderable.prototype.pixelTouches = function(other, wcTouchPos) {   
    // Let non-textured renderables use the texture renderable's collision function
    // The parameter, wcTouchPos, is unused
    
    var result = false;
    
    // Correct boolean variables if null
    if (this.mCircleBound === null) {
        this.mCircleBound = false;
    }
    if (other.mCircleBound === null) {
        other.mCircleBound = false;
    }
    
    // Get the xforms
    var xf1 = this.getXform();
    var xf2 = other.getXform();
    
    // Start checking for collisions
    if (this.mCircleBound && other.mCircleBound) {
        // Both circles, use distance and radius
        var part1 = Math.pow(xf2.getXPos() - xf1.getXPos(), 2);
        var part2 = Math.pow(xf2.getYPos() - xf1.getYPos(), 2);
        var dist = Math.sqrt(part1 + part2);
        if (dist <= (xf1.getWidth() / 2) + (xf2.getWidth() / 2)) {
            // Collision found when the distance <= the sum of the 2 radii
            result = true;
        }
    } else if (this.mCircleBound) {
        // Only obj1 is using the circle bound
        result = this.intersectsRectangle(other);
    } else if (other.mCircleBound) {
        // Only obj2 is using the circle bound
        result = other.intersectsRectangle(this);
    } else {
        // Standard bbox collision
        var b1 = new BoundingBox(xf1.getPosition(), xf1.getWidth(), xf1.getHeight());
        var b2 = new BoundingBox(xf2.getPosition(), xf2.getWidth(), xf2.getHeight());
        result = (b1.boundCollideStatus(b2) > 0);
    }
    
    return result;
};

Renderable.prototype.setColorArray = function() {
    // Let non-textured renderables use the texture renderable system's rotated-renderable-collision by giving them a full color array
    if (this.mColorArray === null) {
        this.mColorArray = [1]; // Simplest full array for a 1x1 object
    }
};

Renderable.prototype.intersectsRectangle = function(otherObj) {
    // Code adapted from: http://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
    var xf = this.getXform();
    var xf2 = otherObj.getXform();
    var radius = xf.getWidth() / 2;
    var circleDistanceX = Math.abs(xf.getXPos() - xf2.getXPos());
    var circleDistanceY = Math.abs(xf.getYPos() - xf2.getYPos());

    if (circleDistanceX > (xf2.getWidth() / 2) + radius) { return false; }
    if (circleDistanceY > (xf2.getHeight()/2) + radius) { return false; }

    if (circleDistanceX <= (xf2.getWidth() / 2)) { return true; } 
    if (circleDistanceY <= (xf2.getHeight() / 2)) { return true; }

    var cornerDistanceSq = Math.pow(circleDistanceX - xf2.getWidth()/2, 2) + Math.pow(circleDistanceY - xf2.getHeight()/2, 2);

    return (cornerDistanceSq <= Math.pow(radius, 2));
};*/