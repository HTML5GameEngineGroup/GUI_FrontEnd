
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.LightSupport = (function() {
	
	var createDefaultLight = function() {
		var light = new Light();
		light.mID = findUniqueID();
		light.setXPos(20);
		light.setYPos(60);
		gGuiBase.SceneSupport.gCurrentScene.mLightSet.addToSet(light);
		this.addLightsToInstances();
		
		return light;
	};
	
	var addLight = function(light) {
		gGuiBase.SceneSupport.gCurrentScene.mLightSet.addToSet(light);
		
		this.addLightsToInstances();
		gGuiBase.View.findWidgetByID("#lightSelectList").rebuildWithArray(gGuiBase.LightSupport.getLightIDList());
	};
	
	var checkForNameConflict = function(name) {
		var lightSet = gGuiBase.SceneSupport.gCurrentScene.mLightSet;
        var result = false;
		var i;
		for (i = 0; i < lightSet.numLights(); i++) {
			if (lightSet.getLightAt(i).mID === name) {
				result = true;
				i = lightSet.numLights(); // Break
			}
		}
		return result;
    };
	
	var findUniqueID = function() {
		var id = 0;
		var name = "Light0";
		while (checkForNameConflict("Light" + id)) {
			id++; 
			name = "Light" + id;
		}
		return name;
	};
	
	var getLightByID = function(id) {
		var lightSet = gGuiBase.SceneSupport.gCurrentScene.mLightSet;
		for (var i = 0; i < lightSet.numLights(); i++) {
			if (lightSet.getLightAt(i).mID === id) {
				return lightSet.getLightAt(i);
			}
		}
		return null;
	};
	
	var getLightIDList = function() {
		var list = [];
		var lightSet = gGuiBase.SceneSupport.gCurrentScene.mLightSet;
		for (var i = 0; i < lightSet.numLights(); i++) {
			list.push(lightSet.getLightAt(i).mID);
		}
		return list;
	};
	
	//Don't call on an object with a non texture renderable
	var addLightingToGameObject = function(gameObjectName, textureName) {
		var gameObject = gGuiBase.ObjectSupport.getGameObjectByID(gameObjectName);
		
		var newRenderable = new LightRenderable(textureName);
		
		gGuiBase.TextureSupport.setRenderableForGameObject(gameObject, newRenderable);
		this.setLightRenderableForAllInstancesOfObject(gameObjectName, textureName);

	};
	
	var setLightRenderableForAllInstancesOfObject = function(gameObjectName, textureName) {
		var instanceNames = gGuiBase.InstanceSupport.getInstanceList();
		for (var i in instanceNames) {
			var instanceName = instanceNames[i];
			console.log(instanceName);
			// get the instance so you can manipulate it
			var inst = gGuiBase.InstanceSupport.getInstanceByID(instanceName);
			console.log(inst);
			console.log(gameObjectName);
			if (inst.mName === gameObjectName) {
				// assign appropriate renderable
				var rend = new LightRenderable(textureName);
			}
			gGuiBase.TextureSupport.setRenderableForGameObject(inst, rend);
			
		}
	};
	
	var addLightsToInstances = function() {
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		
		for (var j = 0; j < sceneList.length; j++) {
			// First update all instances with the new name and class
			var instances = sceneList[j].getInstanceList();
			for (i = 0; i < instances.length; i++) {
				var renderable = instances[i].getRenderable();
				renderable.deleteAllLights();
				if (renderable instanceof LightRenderable) {
					var lightSet = sceneList[j].mLightSet;
					for (var k = 0; k < lightSet.numLights(); k++) {
						renderable.addLight(lightSet.getLightAt(k));
					}
				}
			}
		}
	};
	
	var removeLightReferences = function() {
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		for (var j = 0; j < sceneList.length; j++) {
			// First update all instances with the new name and class
			var instances = sceneList[j].getInstanceList();
			for (i = 0; i < instances.length; i++) {
				var renderable = instances[i].getRenderable();
				if (renderable instanceof LightRenderable) {
					renderable.deleteAllLights();
				}
			}
		}
	};

    var mPublic = {
		createDefaultLight: createDefaultLight,
		checkForNameConflict: checkForNameConflict,
		getLightByID: getLightByID,
		getLightIDList: getLightIDList,
		addLightingToGameObject: addLightingToGameObject,
		setLightRenderableForAllInstancesOfObject: setLightRenderableForAllInstancesOfObject,
		addLightsToInstances: addLightsToInstances,
		addLight: addLight,
		removeLightReferences: removeLightReferences,
    };
    return mPublic;
}());