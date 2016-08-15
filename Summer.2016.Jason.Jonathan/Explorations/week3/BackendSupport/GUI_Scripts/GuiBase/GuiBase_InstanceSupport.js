//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.InstanceSupport = (function() {

    var mInst = {};           // store instance of GO
    var mNextInstID = 0;

    // returns true if name is already in use
    var checkForNameConflict = function(name) {
        return (mInst[name] !== undefined);
    };

    // creates a defaultObject and returns its name
    var createInstanceOfObj = function( objName ) {
        // get object and clone it
        var GO = gGuiBase.ObjectSupport.getGameObjectByID( objName );
        var inst = gGuiBase.ObjectSupport.cloneGO( GO );
        inst.mID = this.getUniqueID( objName );

		gGuiBase.SceneSupport.gCurrentScene.addInstance(inst);
        // track new instance by id
        mInst[inst.mID] = inst;
        return inst.mID;
    };
	
	var deleteInstance = function(instanceID) {
		
		if (gGuiBase.Core.selectedGameObject !== null && instanceID === gGuiBase.Core.selectedGameObject.mID) {
			gGuiBase.Core.emptyDetailsTab();
			gGuiBase.Core.selectedGameObject = null;
		}
		
		deleteInMap(instanceID);
		
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		for (var i = 0; i < sceneList.length; i++) {
			var instances = sceneList[i].getInstanceList();
			for (var j = 0; j < instances.length; j++) {
				if (instances[j].mID === instanceID) {
					instances.splice(j, 1);
					break;
				}
			}
		}
		
		gGuiBase.Core.updateInstanceSelectList();
		gGuiBase.View.refreshAllTabContent();
	};
	
	//Delete instances of a given object type (For when we're deleting an object)
	var deleteInstancesWithName = function (objName) {
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		for (var i = 0; i < sceneList.length; i++) {
			var instances = sceneList[i].getInstanceList();

			for (var j = 0; j < instances.length; j++) {
				if (instances[j].mName === objName) {
					deleteInMap(instances[j].mID);
					instances.splice(j, 1);
					j--;
				}
			}
		}
	};

    var getUniqueID = function ( objName ) {
        var instName = objName + "[" + mNextInstID + "]";
        while (checkForNameConflict(instName)) {
            mNextInstID++;
            instName = objName + "[" + mNextInstID + "]";
        }
        return instName;
    };
	
	var deleteInMap = function(id) {
		delete mInst[id];

	};
	
	var replaceInMap = function (oldID, newID, newName) {
		var object = mInst[oldID];
		delete mInst[oldID];
		
		object.mName = newName;
		object.mID = newID;
		mInst[newID] = object;
	};

    // returns the instance with the ID instanceID
    var getInstanceByID = function( instanceID ) {
        return mInst[ instanceID ];
    };

    // var getInstanceNameList = function() {
    //     var instanceNames = [];
    //     for (var name in mInst.keys) {
    //         instanceNames.push(name);
    //     }
    //     return instanceNames;
    // };

    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

	var getInstanceList = function() {
        var instanceList = [];
        for (var objName in mInst) {
            instanceList.push(objName);
        }
        return instanceList;
    };
	
	
    var mPublic = {
        checkForNameConflict: checkForNameConflict,
        createInstanceOfObj: createInstanceOfObj,
        getInstanceByID: getInstanceByID,
		deleteInstancesWithName: deleteInstancesWithName,
		deleteInstance: deleteInstance,
        // getInstanceNameList: getInstanceNameList,
        getUniqueID: getUniqueID,
		replaceInMap: replaceInMap,
        
        inheritPrototype: inheritPrototype
    };
    return mPublic;
}());