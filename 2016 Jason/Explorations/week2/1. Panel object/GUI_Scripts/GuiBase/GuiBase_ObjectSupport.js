//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.ObjectSupport = (function() {

    var mGO = {};           // store gameObjects
    var mGOCode = {};       // store gameObjects code
    var mNextObjID = 0;
    
    // returns true if name is already in use
    var checkForNameConflict = function(name) {
        return (mGO[name] !== undefined);
    };

    // creates a defaultObject and returns its name
    var createDefaultObject = function() {
        // create new default name
        var name = "GameObj" + mNextObjID;
        while (this.checkForNameConflict(name)) {
            mNextObjID++; // This has not been incremented yet so do it here.  After this method is over, + Object will increment it to a unique value.
            name = "GameObj" + mNextObjID;
        }
        
        // will be overwritten probably not needed
        window[name] = function(renderableObj) {
            GameObject.call(this, renderableObj);
        };
        gEngine.View.inheritPrototype(window[name], window["GameObject"]);
		
		var code = this.getDefaultCodeGO(name);
        // Add code to window
        // dynamically create a new class which inherits from GameObject Class
        eval(code);
        // create a instance of this GO
        var newGO;
        eval('newGO = new ' + name + '(new Renderable());');
        // Make a default xform
        var xf = newGO.getXform();                                             // set default transform
        xf.setXPos(20);
        xf.setYPos(60);
        xf.setWidth(5);
        xf.setHeight(5);
        newGO.mID = name;
        newGO.mName = name;                                                    // object class name
        mGO[newGO.mName] = newGO;                                               // add to map
        mGOCode[newGO.mName] = code;                // add code to code map
        return newGO.mName;
    };

    var createDefaultTextObject = function(texture) {
        // create new default name
        var name = "GameObj" + mNextObjID;
        while (this.checkForNameConflict(name)) {
            mNextObjID++; // This has not been incremented yet so do it here.  After this method is over, + Object will increment it to a unique value.
            name = "GameObj" + mNextObjID;
        }

        // will be overwritten probably not needed
        window[name] = function(renderableObj) {
            GameObject.call(this, renderableObj);
        };
        gEngine.View.inheritPrototype(window[name], window["GameObject"]);

        var code = this.getDefaultCodeGO(name);
        // Add code to window
        // dynamically create a new class which inherits from GameObject Class
        eval(code);
        // create a instance of this GO
        var newGO;
        eval('newGO = new ' + name + '(new TextureRenderable("' + texture + '"));');
        // Make a default xform
        var xf = newGO.getXform();                                             // set default transform
        xf.setXPos(20);
        xf.setYPos(60);
        xf.setWidth(5);
        xf.setHeight(5);
        newGO.mID = name;
        newGO.mName = name;                                                    // object class name
        mGO[newGO.mName] = newGO;                                               // add to map
        mGOCode[newGO.mName] = code;                // add code to code map

        return newGO.mName;
    };
    
   
	
	var deleteObject = function(objName) {
		
		if (objName === gGuiBase.Core.selectedGameObject.mName) {
			gGuiBase.Core.emptyDetailsTab();
			gGuiBase.Core.selectedGameObject = null;
		}
		
		delete mGO[objName];
		delete mGOCode[objName];
        
		gGuiBase.InstanceSupport.deleteInstancesWithName(objName); //Delete instances containing the object name
		gGuiBase.Core.updateObjectSelectList();
		gGuiBase.Core.updateInstanceSelectList();
		gGuiBase.View.refreshAllTabContent();		
	};
	
	var replaceInMap = function(oldName, newName) {
		
		console.log(mGO[oldName]);
		console.log(mGOCode[oldName]);
		var object = mGO[oldName];
		delete mGO[oldName];
		var code = mGOCode[oldName];
		delete mGOCode[oldName];
		
		
		object.mName = newName;
		object.mID = newName;
		mGO[newName] = object;
		mGOCode[newName] = code;
	};
	
	
    
    var cloneGO = function ( gameObject ) {
        var newGO;
        console.log("type of renderable in clone:", typeof(gameObject.getRenderable()));
        console.log(gameObject.getRenderable().mTexture);
        var texture = gameObject.getRenderable().mTexture;
        if (texture) {
            eval('newGO = new ' + gameObject.mName + '(new TextureRenderable("' + texture + '"));');
        } else {
            eval('newGO = new ' + gameObject.mName + '(new Renderable());');
        }
        // Make a default xform
        this.copyTransform(newGO, gameObject);
        var rend = newGO.getRenderable();
        rend.setColor(gameObject.getRenderable().getColor());
        newGO.mName = gameObject.mName;                                                    // object class name
        return newGO;
    };
    
    var copyTransform = function ( targetGO, sourceGO ) {
        var targetTransform = targetGO.getXform();                                             // set default transform
        var gameObjectTransform = sourceGO.getXform();
        // targetTransform.cloneTo(gameObjectTransform);
        targetTransform.setXPos(gameObjectTransform.getXPos());
        targetTransform.setYPos(gameObjectTransform.getYPos());
        targetTransform.setWidth(gameObjectTransform.getWidth());
        targetTransform.setHeight(gameObjectTransform.getHeight());
        targetTransform.setRotationInDegree(gameObjectTransform.getRotationInDegree());
    };
    
    // names are id, names must be unique
    var getGameObjectByID = function( name ) {
        return mGO[ name ];
    };

    var getDefaultCodeGO = function( name ) {
        return 'window["' + name + '"] = function(renderableObj) {\n\
    GameObject.call(this, renderableObj);\n\
    this.mCollidableFlag = false;\n\
    this.mCollisionPixelFlag = false;\n\
    this.mDestroy = false;\n\
}\n\
gEngine.View.inheritPrototype(window["' + name + '"], window["GameObject"]);\n\
\n\
' + name + '.prototype.update = function() {\n\
    GameObject.prototype.update.call(this);\n\
};\n\
\n\
' + name + '.prototype.draw = function(aCamera) {\n\
    GameObject.prototype.draw.call(this, aCamera);\n\
};\n\
\n\
' + name + '.prototype.onCollisionStay = function(otherObj) {\n\
    \n\
};\n\
\n\
' + name + '.prototype.onCollisionEnter = function(otherObj) {\n\
    \n\
};\n\
\n\
' + name + '.prototype.onCollisionExit = function(otherObj) {\n\
    \n\
};';
    };



    var getDefaultCodeClass = function(name, id) {
        return 'window["' + name + '"] = function() {\n\
    this.mName = "' + name + '";\n\
    this.mID = "' + id + '";\n\
}';
    };

    var getObjectList = function() {
        var objList = [];
        for (var objName in mGO) {
            objList.push(mGO[objName]);
        }
        return objList;
    };
	
	var getObjectNameList = function() {
		var objList = [];
		for (var objName in mGO) {
			objList.push(objName);
		}
		return objList;
	};
	
	var getObjectCodeList = function() {
		var objList = [];
        for (var objName in mGOCode) {
            objList.push(mGOCode[objName]);
        }
        return objList;
	};
    
	var setGameObjectByID = function ( GOName, object ) {
		mGO[GOName] = object;
	};
	
    var getGameObjectCodeByID = function ( GOName ) {
        return mGOCode[GOName];
    };
    
    var setGameObjectCodeByID = function ( GOName, Code ) {
        mGOCode[GOName] = Code;  
    };
	
	var clearObjects = function() {
		for (var objName in mGO) {
			delete mGO[objName];
		}

		for (var objName in mGOCode) {
			delete mGOCode[objName];
		}
		
		mGO = {};
		mGOCode = {};
		mNextObjID = 0;
	};
    
    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var mPublic = {
        createDefaultObject: createDefaultObject,
        createDefaultTextObject: createDefaultTextObject,
		deleteObject: deleteObject,
        checkForNameConflict: checkForNameConflict,
        copyTransform: copyTransform,
		replaceInMap: replaceInMap,
        cloneGO: cloneGO,
        getObjectList: getObjectList,
		getObjectNameList: getObjectNameList,
		getObjectCodeList: getObjectCodeList,
        getDefaultCodeGO: getDefaultCodeGO,
        getDefaultCodeClass: getDefaultCodeClass,
        getGameObjectByID: getGameObjectByID,
		setGameObjectByID: setGameObjectByID,
        getGameObjectCodeByID: getGameObjectCodeByID,
        setGameObjectCodeByID: setGameObjectCodeByID,
		mNextObjID: mNextObjID,
		clearObjects: clearObjects,

        inheritPrototype: inheritPrototype
    };
    return mPublic;
}());