/*
 * File: ClientScene.js 
 * This is a scene template. 
 * 
 * But what does each cam in this scene draw?  each instance?  does the user get any choice?
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, vec2, View */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

//=============================================================================
// Temporarily defining variables to silence errors -- will replace later!
var GlobalPlay = false;
var GlobalPrefabList = [];
//=============================================================================

function ClientScene() {
    Scene.call(this);
     // audio clips: supports both mp3 and wav formats
//    this.kBgClip = "assets/sounds/BGClip.mp3";
//    this.kCue = "assets/sounds/MyGame_cue.wav";
//    this.kSceneFile = "assets/GrayLevel.json";



    // The camera to view the scene
    //this.mCamera = null;
    this.mCameraList = [];
    this.mInstanceList = [];

    
//    this.mSqSet = [];
//    
//
//    // the hero and the support objects
//    this.mHero = null;
//    this.mSupport = null;
}

ClientScene.prototype.loadScene = function () {
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

ClientScene.prototype.initialize = function () {

 
    var cam = new Camera(
        vec2.fromValues(20,60),   // position of the camera
        50,                        // width of camera
        [0,0,640,480]        // viewport (orgX, orgY, width, height)
        );
    cam.setBackgroundColor([0.8,0.8,0.8,1]);
    this.mCameraList.push(cam);
    //registerMainCamera(this.mCamera);
    
    /*
    var box = new GameObject(new Renderable());
    var xf = box.getXform();
    xf.setXPos(20);
    xf.setYPos(60);
    xf.setWidth(5);
    xf.setHeight(5);
    this.mInstanceList.push(box);*/
            
//    for(var i = 0; i < sqrs.length; i++){
//        var renderable = new Renderable(gEngine.DefaultResources.getConstColorShader());
//        renderable.setColor(sqrs[i].Color);
//        renderable.getXform().setPosition(sqrs[i].Pos[0], sqrs[i].Pos[1]);
//        renderable.getXform().setSize(sqrs[i].Width,sqrs[i].Height);
//        renderable.getXform().setRotationInDegree(sqrs[i].Rotation);
//        this.mSqSet.push(renderable);
//        Global_ObjectList[i] = renderable;
//    }

};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
ClientScene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

    // Step  B: Activate the drawing Camera
    var i, j;
    for (i = 0; i < this.mCameraList.length; i++) {
        var cam = this.mCameraList[i];
        cam.setupViewProjection();
        
        for (j = 0; j < this.mInstanceList.length; j++) {
            this.mInstanceList[j].draw(cam);
        }
    }
    //this.mCamera.setupViewProjection();

    

     
     /*for (i = 0; i < Global_ObjectList.size(); i++) {
        Global_ObjectList.getObjectAt(i).draw(this.mCamera);
     }*/
     /*for (i = 0; i < GlobalPrefabList.length; i++) {
        var j;
        var instances = GlobalPrefabList[i].getInstances();
        for (j = 0; j < instances.length; j++) {
            instances[j].draw(this.mCamera);
        }
     }*/
    


//    for (i = 0; i < this.mSqSet.length; i++) {
//        this.mSqSet[i].draw(this.mCamera.getVPMatrix());
//    }

};

// The update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
ClientScene.prototype.update = function () {
    
    var i;
    var j;
    var instances;
    
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
    
    // Update instances
    /*for (i = 0; i < GlobalPrefabList.length; i++) {
        instances = GlobalPrefabList[i].getInstances();
        for (j = 0; j < instances.length; j++) {
            instances[j].update();
        }
    }*/
    if (gRunning) {
        for (i = 0; i < this.mInstanceList.length; i++) {
            this.mInstanceList[i].update();
        }
    }
    
    // let's only allow the movement of hero, 
    // and if hero moves too far off, this level ends, we will
    // load the next level
//    var deltaX = 0.05;
//    var xform = this.mHero.getXform();
//    

//      var whiteXform = this.mSqSet[0].getXform();
//      var redXform = this.mSqSet[1].getXform();
//
//
//      redXform.incRotationByDegree(1.2);
//      
//      whiteXform.incXPosBy(1/9);
//      
//      if(whiteXform.getXPos() >= 30){
//          whiteXform.setXPos(10);
//      }
//      
//
//      
//      updateView(
//              whiteXform.getXPos(),
//              whiteXform.getYPos(),
//              whiteXform.getRotationInDegree(),
//              0,
//              0
//           
//            );
//    
//        updateView(
//            redXform.getXPos(),
//            redXform.getYPos(),
//            redXform.getRotationInDegree(),
//            0,
//            1
//
//          );
      
      //console.log(whiteXform.getXPos());
    

//    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left)) {
//        gEngine.AudioClips.playACue(this.kCue);
//        xform.incXPosBy(-deltaX);
//        if (xform.getXPos() < 11) {  // this is the left-bound of the window
//            gEngine.GameLoop.stop();
//        }
//    }
};

ClientScene.prototype.addInstance = function (inst) {
    this.mInstanceList.push(inst);
};