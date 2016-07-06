//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.SceneSupport = (function() {
	gCurrentScene = new ClientScene(0);
	
    var mSceneList = [];
    var mNextSceneID = 0;
    
	mSceneList.push(gCurrentScene);
    //gEngine.Core.initializeEngineCore('GLCanvas', gCurrentScene);
	
    // returns true if name is already in use
    var checkForNameConflict = function(name) {
        var result = false;
		var i;
		for (i = 0; i < mSceneList.length; i++) {
			if (mSceneList[i].mName === name) {
				result = true;
				i = mSceneList.length; // Break
			}
		}
		return result;
    };
	
    var createDefaultScene = function() {
		// Create a default scene with a default name.  It becomes the selected scene.
		var scene = new ClientScene(mNextSceneID);
		while (checkForNameConflictScene(scene.mName)) {
			mNextSceneID++; // This has not been incremented yet so do it here.  After this method is over, + Scene will increment it to a unique value.
			scene.mName = "Scene" + mNextSceneID;
		}
		mSceneList.push(scene);
		
		return scene;
	};
    
	/*var deleteScene = function(index) {
		var newID = gCurrentScene.mID;
		if (gCurrentScene === this.mSceneList[index]) {
			gGuiBase.Core.emptyDetailsTab();
			// Select the scene before as a replacement -- be careful about negative indices
			if (index === 0) {
				if (mSceneList.length <= 1) {
					// We are splicing the only scene in the list
					selectScene(null);
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
				selectScene(index - 1);
				if (!gRunning) {
					newID = mSceneList[index - 1].mID;
					createDetailsScenes();
				}
			}
		}
		this.mSceneList.splice(index, 1);
		createPanelBottomScenes();
		changeCurrentListItem(newID);
	};
	
	var selectScene = function(index) {
		// Select the scene at the index and run it too
		gEngine.GameLoop.stop();
		if (index !== null) {
			gCurrentScene = this.mSceneList[index];
			gEngine.Core.startScene(gCurrentScene);
		} else {
			this.runBlankScene();
		}
		return gCurrentScene;
	};*/
	
    var getSceneByName = function( name ) {
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

    var getSceneList = function() {
        return mSceneList;
    };

    var mPublic = {
        createDefaultScene: createDefaultScene,
        checkForNameConflict: checkForNameConflict,
        getSceneList: getSceneList,
        getSceneByName: getSceneByName,

    };
    return mPublic;
}());