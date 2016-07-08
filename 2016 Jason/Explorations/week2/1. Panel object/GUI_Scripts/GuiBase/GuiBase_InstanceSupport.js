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
        // track new instance by id
        mInst[inst.mID] = inst;
        return inst.mID;
    };

    var getUniqueID = function ( objName ) {
        var instName = objName + "[" + mNextInstID + "]";
        while (checkForNameConflict(instName)) {
            mNextInstID++;
            instName = objName + "[" + mNextInstID + "]";
        }
        return instName;
    };

    // returns the instance with the ID instanceID
    var getInstanceByID = function( instanceID ) {
        return mInst[ instanceID ];
    };

    var getInstanceNameList = function() {
        var instanceNames = [];
        for (var name in mInst.keys) {
            instanceNames.push(name);
        }
        return instanceNames;
    };

    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var mPublic = {
        checkForNameConflict: checkForNameConflict,
        createInstanceOfObj: createInstanceOfObj,
        getInstanceByID: getInstanceByID,
        getInstanceNameList: getInstanceNameList,
        getUniqueID: getUniqueID,
        
        inheritPrototype: inheritPrototype
    };
    return mPublic;
}());