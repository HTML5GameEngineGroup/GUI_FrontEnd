//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.ObjectSupport = (function() {

    var mGO = {};           // store gameObjects
    var mGOCode = {};       // store gameObjects code
    var mNextObjID = 0;
    
    // returns true if name is already in use
    var checkForNameConflict = function(name) {
        console.log(mGO.hasOwnProperty(name));
        return (mGO[name] !== undefined);
    };

    // creates a defaultObject and returns its name
    var createDefaultObject = function() {
        var newObj;

        // create new default name, this should be its own function
        var name = "GameObj" + mNextObjID;
        while (this.checkForNameConflict(name)) {
            mNextObjID++; // This has not been incremented yet so do it here.  After this method is over, + Object will increment it to a unique value.
            name = "GameObj" + mNextObjID;
        }

        window[name] = function(renderableObj) {
            GameObject.call(this, renderableObj);
        };
        gEngine.View.inheritPrototype(window[name], window["GameObject"]);

        var code = this.getDefaultCodeGO(name);

        // Add code to system
        eval(code);
        eval('newObj = new ' + name + '(new Renderable());');
        // Make a default xform
        var xf = newObj.getXform();                                             // set default transform
        xf.setXPos(20);
        xf.setYPos(60);
        xf.setWidth(5);
        xf.setHeight(5);

        newObj.mID = name;                                                      // set name
        mGO[newObj.mID] = newObj;                                               // add to map
        mGOCode[newObj.mID] = this.getDefaultCodeGO(newObj.mID);                // add code to code map
        return newObj.mID;
    };

    var getDefaultCodeGO = function(name) {
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
            objList.push(objName);
        }
        return objList;
    };
    
    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var mPublic = {
        createDefaultObject: createDefaultObject,
        checkForNameConflict: checkForNameConflict,
        getObjectList: getObjectList,
        getDefaultCodeGO: getDefaultCodeGO,
        getDefaultCodeClass: getDefaultCodeClass,

        inheritPrototype: inheritPrototype
    };
    return mPublic;
}());