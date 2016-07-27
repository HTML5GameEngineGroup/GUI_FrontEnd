//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.CameraSupport = (function() {
	var mSelectedCamera = null;

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
	
	// var createDefaultCamera = function() {
	// 	var cam = new Camera(
	// 		vec2.fromValues(20,60), // position of the camera
	// 		50,                     // width of camera
	// 		[0,0,640,480]           // viewport (orgX, orgY, width, height)
	// 		);
	// 	cam.setBackgroundColor([0.8, 0.8, 0.8, 1.0]);
	// 	var name = "Camera" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;
    //
	// 	while (checkForNameConflict(name)) {
	// 		gGuiBase.SceneSupport.gCurrentScene.mNextCameraID++;
	// 		name = "Camera" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;
	// 	}
	// 	cam.mName = name;
	// 	cam.mID = "cameraListItem" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID; // This is still unique despite the check (doesn't need to be updated to the next cam id)
	// 	gGuiBase.SceneSupport.gCurrentScene.mNextCameraID++;
	//
	//
	// 	//console.log(gEngine.DefaultResources.getConstColorShader())
	// 	var cameraObject = new CameraObject(cam);
	// 	gGuiBase.SceneSupport.gCurrentScene.cameraObjects.push(cameraObject);
	// 	gGuiBase.SceneSupport.gCurrentScene.mAllCamera.push(cam);
	// 	return cam;
	// };
	
	var deleteCamera = function(cameraName) {
		
		var list = getCameraList();
		var camera = getCameraByName(cameraName);
		
		if (this.mSelectedCamera === camera) {
			gGuiBase.Core.emptyDetailsTab();
			this.mSelectedCamera = null;
		}
		
		var index = getCameraIndex(cameraName);
		list.splice(index, 1);
		
		gGuiBase.Core.reinitializeCameraTab();
		gGuiBase.View.refreshAllTabContent();
	};
	
	var getCameraIndex = function(cameraName) {
		var list = getCameraList();
		for (var i = 0; i < list.length; i++) {
			if (list[i].mName === cameraName)
				return i;
		}
		return -1;
	};
	
	var getCameraList = function() {
		return gGuiBase.SceneSupport.gCurrentScene.getCameraList();
	};
	
	var clearCameras = function() {
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		for (var i = 0; i < sceneList.length; i++) {
			var cameras = sceneList[i].getCameraList();

			cameras.splice(0, cameras.length);
			cameras = [];

		}
	};
	
	var getCameraListNames = function() {
		var cameraList = getCameraList();
		var nameArray = [];
		var i;
		for (i = 0; i < cameraList.length; i++) {
			nameArray.push(cameraList[i].mName);
		}
		return nameArray;
	};
	
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

	var getDefaultCodeCam = function( name ) {
		return 'window["' + name + '"] = function(wcCenter, wcWidth, viewportArray) {' +
			'this.mCameraState = new CameraState(wcCenter, wcWidth);' +
			'this.mCameraShake = null;' +
			'this.mViewport = [];' +
			'this.mViewportBound = 0;' +
			'if (bound !== undefined) {' +
				'this.mViewportBound = bound;' +
			'}' +
			'this.mScissorBound = [];' +
			'this.setViewport(viewportArray, this.mViewportBound);' +
			'this.mNearPlane = 0;' +
			'this.mFarPlane = 1000;' +
			'this.kCameraZ = 10;' +
			'this.mViewMatrix = mat4.create();' +
			'this.mProjMatrix = mat4.create();' +
			'this.mVPMatrix = mat4.create();' +
			'this.mBgColor = [0.8, 0.8, 0.8, 1];' +
			'this.mRenderCache = new PerRenderCache();' +
			'this.mEnable=true;' +
		'};' +
		'gEngine.View.inheritPrototype(window["' + name + '"], window["Camera"]);' +
		name + '.prototype.update = function () {' +
			'if (this.mCameraShake !== null) {' +
				'if (this.mCameraShake.shakeDone()) {' +
					'this.mCameraShake = null;' +
				'} else {' +
					'this.mCameraShake.setRefCenter(this.getWCCenter());' +
					'this.mCameraShake.updateShakeState();' +
				'}' +
			'}' +
			'this.mCameraState.updateCameraState();' +
		'};';
	};

	var createDefaultCamera = function() {
		// default camera values
		var wcCenter = vec2.fromValues(20,60);   // position of the camera
		var wcWidth = 50;                        // width of camera
		var viewportArray = [0,0,640,480];       // viewport (orgX, orgY, width, height)
		var bound = undefined;

		// create new default name
		var name = "Camera" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;
		while (checkForNameConflict(name)) {
			gGuiBase.SceneSupport.gCurrentScene.mNextCameraID++;
			name = "Camera" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID;
		}

		// will be overwritten probably not needed
		window[name] = function(wcCenter, wcWidth, viewportArray, bound) {
			Camera.call(this, wcCenter, wcWidth, viewportArray, bound);
		};
		gEngine.View.inheritPrototype(window[name], window["Camera"]);

		var code = this.getDefaultCodeCam(name);
		// Add code to window
		eval(code);
		// create a instance of this Camera
		var cam;
		eval('cam = new ' + name + '(wcCenter, wcWidth, viewportArray, bound);');

		cam.mID = "cameraListItem" + gGuiBase.SceneSupport.gCurrentScene.mNextCameraID; // This is still unique despite the check (doesn't need to be updated to the next cam id)
		cam.mName = name;
		cam.setBackgroundColor([0.8, 0.8, 0.8, 1.0]);

		var cameraObject = new CameraObject(cam);
		gGuiBase.SceneSupport.gCurrentScene.cameraObjects.push(cameraObject);
		gGuiBase.SceneSupport.gCurrentScene.mAllCamera.push(cam);
		return cam;
	};

    var mPublic = {
		//selectCamera: selectCamera,
		getCameraList: getCameraList,
		checkForNameConflict: checkForNameConflict,
		// createDefaultCamera: createDefaultCamera,
		getCameraListNames: getCameraListNames,
		getCameraByName: getCameraByName,
		deleteCamera: deleteCamera,
		clearCameras: clearCameras,

		createDefaultCamera: createDefaultCamera,
		getDefaultCodeCam: getDefaultCodeCam
    };
    return mPublic;
}());