
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.MaterialSupport = (function() {
	var gMaterials = {};

	var getMaterialList = function() {
		var materialList = [];
		for (var material in gMaterials) {
			materialList.push(material);
		}
		return materialList;
	};

	var addMaterial = function () {
		var name = findUniqueID();
		var material = new Material();
		material.mID = name;
		
		gMaterials[name] = material;
		
		var matList = getMaterialList();
		gGuiBase.View.findWidgetByID("#materialSelectList1").rebuildWithArray( matList );
		gGuiBase.View.refreshAllTabContent();  // refresh panel
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
		getMaterialList: getMaterialList,
		checkForNameConflict: checkForNameConflict,
		getMaterialByID: getMaterialByID,
		setMaterial: setMaterial
    };
    return mPublic;
}());