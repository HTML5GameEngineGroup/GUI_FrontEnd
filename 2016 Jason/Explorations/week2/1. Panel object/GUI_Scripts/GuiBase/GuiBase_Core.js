//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.Core = (function() {

    // this should actually be in core
    var addDefaultObject = function () {
        var newObjID = gGuiBase.ObjectSupport.createDefaultObject();                // create new gameObj
        //todo: abstract this to a content function call
        gGuiBase.View.findWidgetByID("#objectSelectList1").addElement(newObjID);    // add to obj panel
        //todo: ADD TO DETAIL PANEL UPDATE CALL HERE
        gGuiBase.View.refreshAllTabContent();                                       // refresh panel
    };
    
    var selectObject = function ( objName ) {
        //todo: ADD TO DETAIL PANEL UPDATE CALL HERE
    };

    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var mPublic = {
        addDefaultObject: addDefaultObject,
        selectObject: selectObject,

        inheritPrototype: inheritPrototype
    };
    return mPublic;

}());