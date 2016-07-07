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
        var obj = gGuiBase.ObjectSupport.getGameObjectByID( objName );
        var instName = objName + mNextInstID;
        while (checkForNameConflict(instName)) {
            mNextInstID++;
            instName = objName + mNextInstID;
        }
        mInst[ instName ] = new {JSON.parse(JSON.stringify(obj))}; // prolly have to use eval
        console.log('instname: ' + instName);
        console.log(mInst[ instName ]);
        return instName;
    };

    // names are id, names must be unique
    var getInstanceByID = function( name ) {
        return mInst[ name ];
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
        
        inheritPrototype: inheritPrototype
    };
    return mPublic;
}());