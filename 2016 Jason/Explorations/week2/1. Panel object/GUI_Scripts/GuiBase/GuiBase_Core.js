//  Supports the addition of gameObjects
var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.Core = (function() {
    // Adds a default gameObject to the Object Tab and updates detail tab with this object
    var addDefaultObject = function () {
        var newObjID = gGuiBase.ObjectSupport.createDefaultObject();                    // create new gameObj
        //todo: abstract this to a content function call
        gGuiBase.View.findWidgetByID("#objectSelectList1").addElement( newObjID );      // add to obj panel
        this.selectDetailsObject( newObjID );                                           // select this object in details
        gGuiBase.View.refreshAllTabContent();                                           // refresh panel
    };

    // updates the details tab with the object whose name is passed as parameter
    var selectDetailsObject = function ( objName ) {
        //todo : write function in transform widget to do update it self with this object
		var gameObject = gGuiBase.ObjectSupport.getGameObjectByID( objName );           // get gameObj
		var transformContent = gGuiBase.View.findTabContentByID("#TransformContent");
		transformContent.updateFields(gameObject);
		
        //console.log(detailXf);
        
        gGuiBase.View.refreshAllTabContent();                                           // refresh panel
    };

    var inheritPrototype = function (subClass, superClass) {
        var prototype = Object.create(superClass.prototype);
        prototype.constructor = subClass;
        subClass.prototype = prototype;
    };

    var mPublic = {
        addDefaultObject: addDefaultObject,
        selectDetailsObject: selectDetailsObject,

        inheritPrototype: inheritPrototype
    };
    return mPublic;

}());