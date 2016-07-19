//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.Core = (function() {
	var selectedGameObject = null;
	var selectedCamera = null;
	var gRunning = false;    
	var gBackup = null;
	
	// ************* OBJECT SUPPORT ****************
	// Adds a default gameObject to the Object Tab and updates detail tab with this object
    var addDefaultObject = function () {
        var newObjID = gGuiBase.ObjectSupport.createDefaultObject();                    // create new gameObj
        //todo: abstract this to a content function call
        this.selectDetailsObject( newObjID );                                           // select this object in details
		updateObjectSelectList();
        gGuiBase.View.refreshAllTabContent();  // refresh panel
    };

	var loadTextureObject = function (textName) {
		// add texture to scene
		gGuiBase.SceneSupport.gCurrentScene.addTexture(textName);
		gGuiBase.TextureSupport.addTexture(textName);
		console.log("TexList:", gGuiBase.TextureSupport.getTexList());
		gEngine.GameLoop.stop();
		gEngine.View.startScene(gGuiBase.SceneSupport.gCurrentScene);
		gGuiBase.Core.reinitializeCameraTab();
	};

	var addTextureObject = function (textName) {
		loadTextureObject(textName);
		// create texture object
		var textObjName = gGuiBase.ObjectSupport.createDefaultTextObject(textName);
		// add it to scene
		var textObj = gGuiBase.ObjectSupport.getGameObjectByID(textObjName);
		gGuiBase.SceneSupport.gCurrentScene.addInstance(textObj);
		//update the gui
		var texList = gGuiBase.TextureSupport.getTexList();
		gGuiBase.View.findWidgetByID("#texSelectList1").rebuildWithArray( texList )
		updateObjectSelectList();
		gGuiBase.View.refreshAllTabContent();  // refresh panel
	};
	
	// gets a list of names of all the objects
	var getObjectList = function() {
		return gGuiBase.ObjectSupport.getObjectList();
	};
	
	var updateObjectSelectList = function() {
		var objectInstances = gGuiBase.ObjectSupport.getObjectNameList();
		gGuiBase.View.findWidgetByID("#objectSelectList1").rebuildWithArray( objectInstances );
		gGuiBase.View.findWidgetByID("#instanceDropdown").rebuildWithArray( objectInstances );
	};
	
	var addDefaultScene = function() {
		var newScene = gGuiBase.SceneSupport.createDefaultScene();
		gGuiBase.View.findWidgetByID("#sceneSelectList1").rebuildWithArray(gGuiBase.SceneSupport.getSceneListNames());
		this.selectDetailsScene(newScene.mName);
		gGuiBase.View.refreshAllTabContent();
	};

	var addDefaultCamera = function() {
		var newCamera = gGuiBase.CameraSupport.createDefaultCamera();
		gGuiBase.View.findWidgetByID("#cameraSelectList").rebuildWithArray(gGuiBase.CameraSupport.getCameraListNames());
		this.selectDetailsCamera(newCamera.mName);
		gGuiBase.View.refreshAllTabContent();
	};

    // updates the details tab with the object whose name is passed as parameter
    var selectDetailsObject = function ( objName ) {
        var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new TransformContent("TransformContent", gGuiBase.View.CONTENT_STYLE, "Transform");
		var detailsColorTexture = new ColorTextureContent("ColorTextureContent", gGuiBase.View.CONTENT_STYLE, "Texture");

		var gameObject = gGuiBase.ObjectSupport.getGameObjectByID( objName );           // get gameObj
		gGuiBase.Core.selectedGameObject = gameObject;
		detailsTransform.updateFields(gameObject);
		
		detailsTab.addContent(detailsTransform);
		detailsTab.addContent(detailsColorTexture);

		//var transformContent = gGuiBase.View.findTabContentByID("#TransformContent");
		//transformContent.updateFields(gameObject);
        gGuiBase.View.refreshAllTabContent();                                           // refresh panel
    };

	// ************* SCENE SUPPORT ****************
	var initializeInitialScene = function() {
		gGuiBase.SceneSupport.gCurrentScene.initialize();
		gGuiBase.View.findWidgetByID("#sceneSelectList1").rebuildWithArray(gGuiBase.SceneSupport.getSceneListNames());
		// gGuiBase.SceneSupport.selectScene(0);
		gGuiBase.View.findWidgetByID("#cameraSelectList").rebuildWithArray(gGuiBase.CameraSupport.getCameraListNames());
		gGuiBase.View.refreshAllTabContent();
	};

	var selectDetailsScene = function (sceneName) {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new SceneTransformContent("SceneTransformContent", gGuiBase.View.CONTENT_STYLE, "Scene");
		
		var scene = gGuiBase.SceneSupport.getSceneByName(sceneName);
		detailsTransform.updateFields(scene);
		
		gGuiBase.SceneSupport.selectSceneByName(sceneName);
		
		detailsTab.addContent(detailsTransform);
		this.updateInstanceSelectList();
		gGuiBase.View.refreshAllTabContent();
	};

	// ************* CAMERA SUPPORT ****************
	var selectDetailsCamera = function (cameraName) {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new CameraTransformContent("CameraTransformContent", gGuiBase.View.CONTENT_STYLE, "Camera Transform");
		var detailsColor = new ColorCameraContent("ColorCameraContent", gGuiBase.View.CONTENT_STYLE, "Camera Color");
		
		var camera = gGuiBase.CameraSupport.getCameraByName(cameraName);
		detailsTransform.updateFields(camera);
		gGuiBase.Core.selectedCamera = camera;

		detailsTab.addContent(detailsTransform);
		detailsTab.addContent(detailsColor);
		gGuiBase.View.refreshAllTabContent();
	};
	
	// To be called on scene change
	var reinitializeCameraTab = function() {
		gGuiBase.View.findWidgetByID("#cameraSelectList").rebuildWithArray(gGuiBase.CameraSupport.getCameraListNames());
		gGuiBase.View.refreshAllTabContent();
		
	};
	
	var reinitializeSceneTab = function() {
		gGuiBase.View.findWidgetByID("#sceneSelectList1").rebuildWithArray(gGuiBase.SceneSupport.getSceneListNames());
	};
	
	var emptyDetailsTab = function () {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
	};

	// ************* INSTANCE SUPPORT ****************
	var addInstance = function () {
		var objName = gGuiBase.View.findTabContentByID("#InstancesContent").getDropdownObjectName();	// get object selected by dropdown
		if (objName == "") return;																		// dont add if no object selected
		var instName = gGuiBase.InstanceSupport.createInstanceOfObj( objName );							// create an instance of the object
		var inst = gGuiBase.InstanceSupport.getInstanceByID( instName );								// add instance to current scene
		this.updateInstanceSelectList();
		gGuiBase.Core.selectInstanceDetails( instName );												// set details panel with instance info
		gGuiBase.View.refreshAllTabContent();
		gGuiBase.View.findTabContentByID('#InstancesContent').setDropdownToSelectedGO();
	};
	
	var addInstanceWithName = function(objName) {
		var instName = gGuiBase.InstanceSupport.createInstanceOfObj( objName );							// create an instance of the object
		var inst = gGuiBase.InstanceSupport.getInstanceByID( instName );								// add instance to current scene
		this.updateInstanceSelectList();
		gGuiBase.Core.selectInstanceDetails( instName );												// set details panel with instance info
		gGuiBase.View.refreshAllTabContent();
		gGuiBase.View.findTabContentByID('#InstancesContent').setDropdownToSelectedGO();
	};

	// updates instanceSelectList
	var updateInstanceSelectList = function () {
		var sceneInstances = gGuiBase.SceneSupport.gCurrentScene.getInstanceNameList();			// add instance to instance content
		gGuiBase.View.findWidgetByID("#instanceSelectList").rebuildWithArray( sceneInstances );
	};

	var selectInstanceDetails = function ( instanceID ) {
		var detailsTab = gGuiBase.View.findTabByID("#Details");
		detailsTab.clearContent();
		var detailsTransform = new TransformContent("TransformContent", gGuiBase.View.CONTENT_STYLE, "Transform");
		var detailsColorTexture = new ColorTextureContent("ColorTextureContent", gGuiBase.View.CONTENT_STYLE, "Texture");

		var inst = gGuiBase.InstanceSupport.getInstanceByID( instanceID );				// get instance
		
		gGuiBase.Core.selectedGameObject = inst;										// set to selected so it can update from panel
		detailsTransform.updateFields( inst );											// give details instance data

		detailsTab.addContent(detailsTransform);
		detailsTab.addContent(detailsColorTexture);

		gGuiBase.View.refreshAllTabContent();                                           // refresh panel
	};
	
	var replaceObjectNameInCode = function(code, oldName, newName) {
		return code.replaceAll(oldName, newName);
	};
	
	String.prototype.replaceAll = function(search, replace) {
		if (replace === undefined) {
			return this.toString();
		}
		return this.split(search).join(replace);
	}
	
    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };
	
	var cleanUpGameCore = function() {
		// Close (delete) all code editor windows that are open
		for (var i in gGuiBase.EditorSupport.gEditorMap) {
			$('#' + gGuiBase.EditorSupport.gEditorMap[i]).remove();
			delete gGuiBase.EditorSupport.gEditorMap[i];
		}
		
		// Rest the vars (for loading)
		gGuiBase.ObjectSupport.clearObjects();
		gGuiBase.InstanceSupport.clearInstances();
		gGuiBase.CameraSupport.clearCameras();
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		sceneList.splice(0, sceneList.length);
		
		var selectedGameObject = null;
		var selectedCamera = null;
		
		gEngine.GameLoop.stop();
		gGuiBase.SceneSupport.runBlankScene();
		
		//gNextObjectID = 0;          // For making unique IDs
		gGuiBase.InstanceSupport.mNextInstID = 0;
		gGuiBase.SceneSupport.mNextSceneID = 0;
		gGuiBase.ObjectSupport.mNextObjID = 0;  
		gGuiBase.Core.gRunning = false;           // If true, the update function will be called each game loop

		gGuiBase.View.refreshAllTabContent();
		reinitializeTabs();
	};
	
	var reinitializeTabs = function() {
		reinitializeSceneTab();
		reinitializeCameraTab();
		updateObjectSelectList();
		updateInstanceSelectList();
		emptyDetailsTab();
	};

    var mPublic = {
        addDefaultObject: addDefaultObject,
		addTextureObject: addTextureObject,
		loadTextureObject: loadTextureObject,
        selectDetailsObject: selectDetailsObject,
		getObjectList: getObjectList,
		updateObjectSelectList: updateObjectSelectList,

		addDefaultScene: addDefaultScene,
		selectDetailsScene: selectDetailsScene,
		initializeInitialScene: initializeInitialScene,

		addDefaultCamera: addDefaultCamera,
		selectDetailsCamera: selectDetailsCamera,
		reinitializeCameraTab: reinitializeCameraTab,
		reinitializeSceneTab: reinitializeSceneTab,
		reinitializeTabs: reinitializeTabs,
		
		addInstance: addInstance,
		addInstanceWithName: addInstanceWithName,
		updateInstanceSelectList: updateInstanceSelectList,
		selectInstanceDetails: selectInstanceDetails,
		
		emptyDetailsTab: emptyDetailsTab,
		
        inheritPrototype: inheritPrototype,
		cleanUpGameCore: cleanUpGameCore,
		replaceObjectNameInCode: replaceObjectNameInCode,
		
		selectedGameObject: selectedGameObject,
		selectedCamera: selectedCamera,
		gRunning: gRunning,
		gBackup: gBackup
    };
    return mPublic;

}());