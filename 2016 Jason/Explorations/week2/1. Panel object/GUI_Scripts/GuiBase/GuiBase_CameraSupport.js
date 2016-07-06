//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.CameraSupport = (function() {
	var mSelectedCamera = null;
	
	/*var selectCamera = function(index) {
		// Select the camera at the index
		var list = getCameraList();
		this.mSelectedCamera = list[index];
		createPanelBottomCameras();
		cleanUpPanelRightBody();
		if (!gRunning) {
			changeCurrentListItem(this.mSelectedCamera.mID);
			createDetailsCameras();
		}
		return this.mSelectedCamera;
	};*/
	
	var getCameraByName = function(name) {
		var result = null;
		var cameraList = getCameraList();
		var i;
		for (i = 0; i < cameraList.length; i++) {
			if (cameraList[i].mName === name) {
				result = cameraList[i];
				i = cameraList.length; // Break
			}
		}
		return result;
	};
	
	var createDefaultCamera = function() {
		var cam = new Camera(
			vec2.fromValues(20,60), // position of the camera
			50,                     // width of camera
			[0,0,640,480]           // viewport (orgX, orgY, width, height)
			);
		cam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
		var name = "Camera" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;;

		while (checkForNameConflict(name)) {
			gGuiBase.SceneSupport.gCurrentScene.mNextCameraID++;
			name = "Camera" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;
		}
		cam.mName = name;
		cam.mID = "cameraListItem" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;; // This is still unique despite the check (doesn't need to be updated to the next cam id)
		gGuiBase.SceneSupport.gCurrentScene.mNextCameraID++;
		//gCurrentScene.addCamera(cam);  // The scene already adds it for us so we don't need to add it again
		var list = gGuiBase.SceneSupport.gCurrentScene.getCameraList();
		//this.selectCamera(list.length - 1); // Refreshes
		return cam;
	};
	
	/*(var deleteCamera = function(index) {
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
	};*/
	
	var getCameraList = function() {
		return gGuiBase.SceneSupport.gCurrentScene.getCameraList();
	};
	
	var getCameraListNames = function() {
		var cameraList = getCameraList();
		var nameArray = [];
		for (i = 0; i < cameraList.length; i++) {
			//console.log(cameraList[i].mName);
			nameArray.push(cameraList[i].mName);
		}
		return nameArray;
	}
	
	var checkForNameConflict = function(name) {
		// Returns true if the name appears more than once
		var result = false;
		var i;
		var list = getCameraList();
		for (i = 0; i < list.length; i++) {
			if (list[i].mName === name) {
				result = true;
				i = list.length; // Break
			}
		}
		return result;
	};


    var mPublic = {
		//selectCamera: selectCamera,
		getCameraList: getCameraList,
		checkForNameConflict: checkForNameConflict,
		createDefaultCamera: createDefaultCamera,
		getCameraListNames: getCameraListNames,
		getCameraByName: getCameraByName
    };
    return mPublic;
}());