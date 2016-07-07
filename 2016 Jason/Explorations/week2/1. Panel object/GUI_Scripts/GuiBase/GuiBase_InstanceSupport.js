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
        var GO = gGuiBase.ObjectSupport.getGameObjectByID( objName );
        var instName = objName + "[" + mNextInstID + "]";
        while (checkForNameConflict(instName)) {
            mNextInstID++;
            instName = objName + "[" + mNextInstID + "]";
        }

        var inst;
        eval("inst = new " + objName + "(new Renderable());");

        // copy xform from gameObject
        var instanceXf = inst.getXform();
        var GOXf = GO.getXform();
        instanceXf.setXPos(GOXf.getXPos());
        instanceXf.setYPos(GOXf.getYPos());
        instanceXf.setWidth(GOXf.getWidth());
        instanceXf.setHeight(GOXf.getHeight());
        instanceXf.setRotationInDegree(GOXf.getRotationInDegree());

        var rend = inst.getRenderable();
        rend.setColor(GO.getRenderable().getColor());
        inst.mID = instName;
        inst.mName = instName;

        mInst[instName] = inst;
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