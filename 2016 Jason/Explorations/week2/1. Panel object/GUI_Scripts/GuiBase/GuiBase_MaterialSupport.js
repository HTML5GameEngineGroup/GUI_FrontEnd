
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.MaterialSupport = (function() {
	var gMaterials = {};
	gMaterials["Default"] = new Material();
	gMaterials["Default"].mID = "Default";
	console.log(gMaterials);

	var getMaterialNameList = function() {
		var materialNameList = [];
		for (var material in gMaterials) {
			materialNameList.push(material);
		}
		return materialNameList;
	};

	var getMaterialList = function() {
		var materialList = [];
		for (var materialName in gMaterials) {
			materialList.push(gMaterials[materialName]);
		}
		return materialList;
	};

	var addMaterial = function () {
		var name = findUniqueID();
		var material = new Material();
		material.mID = name;
		
		gMaterials[name] = material;
		
		var matList = getMaterialNameList();
		gGuiBase.View.findWidgetByID("#materialSelectList1").rebuildWithArray( matList );
		gGuiBase.View.refreshAllTabContent();  // refresh panel
	};
	
	var setMaterial = function (materialName, material) {
		gMaterials[materialName] = material;
	};
	
	var checkForNameConflict = function(name) {
        return (gMaterials[name] !== undefined);
    };
	
	var findUniqueID = function() {
		var id = 0;
		var name = "Material0";
		while (checkForNameConflict("Material" + id)) {
			id++; 
			name = "Material" + id;
		}
		return name;
	};
	
	var getMaterialByID = function(id) {
		return gMaterials[id];
	};
	
	var setMaterial = function(gameObjectName, material) {
		var gameObject = gGuiBase.ObjectSupport.getGameObjectByID(gameObjectName);
		gameObject.getRenderable().mMaterial = material;
		
		var instanceNames = gGuiBase.InstanceSupport.getInstanceList();
		for (var i in instanceNames) {
			var instanceName = instanceNames[i];
			// get the instance so you can manipulate it
			var inst = gGuiBase.InstanceSupport.getInstanceByID(instanceName);
			if (inst.mName === gameObjectName) {
				inst.getRenderable().mMaterial = material;
			}
		}
		
	};
	

    var mPublic = {
		addMaterial: addMaterial,
		getMaterialNameList: getMaterialNameList,
		getMaterialList: getMaterialList,
		checkForNameConflict: checkForNameConflict,
		getMaterialByID: getMaterialByID,
		setMaterial: setMaterial
    };
    return mPublic;
}());