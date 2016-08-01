
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.LightSupport = (function() {
	
	var createDefaultLight = function() {
		var light = new Light();
		light.mID = findUniqueID();
		light.setXPos(20);
		light.setYPos(60);
		gGuiBase.SceneSupport.gCurrentScene.mLightSet.addToSet(light);
		
		return light;
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
	}

    var mPublic = {
		createDefaultLight: createDefaultLight,
		checkForNameConflict: checkForNameConflict,
		getLightByID: getLightByID,
		getLightIDList: getLightIDList,
    };
    return mPublic;
}());