/*-----------------------------------------------------------------------------
//	Scene content
//	Extension of GuiTabContent
//
//	Author: Jason Herold/Thoof
-----------------------------------------------------------------------------*/
function ScenesContent(tabContentID, style) {
	this.sceneAddButton = null;
	this.sceneSelectList = null;
	
	this.selectListID = "sceneSelectList1";
	GuiTabContent.call(this, tabContentID, style);
}

gGuiBase.View.inheritPrototype(ScenesContent, GuiTabContent);

ScenesContent.prototype.initialize = function () {
	this.sceneAddButton = new Button("sceneAddButton", GuiTabContent.NO_STYLE, "+Scene");
	this.widgetList.push(this.sceneAddButton);
	
	var testArray = ["list1", "list2", "list3"];
	this.sceneSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', testArray, 'display: inline; margin: 5px');
	
	this.widgetList.push(this.sceneSelectList);


};

ScenesContent.prototype.initializeEventHandling = function () {
	this.sceneAddButton.setOnClick(this.buttonOnClick);
	this.sceneSelectList.setOnSelect(this.onListSelect);

};

ScenesContent.prototype.buttonOnClick = function() {
	var list = gGuiBase.View.findWidgetByID("#sceneSelectList1");
	/*var newObjID = gGameCore.createDefaultObject();
	var newObj = gGameCore.getObject(newObjID);
	console.log("get object by id: " + newObj);
	var objList = gGameCore.getSceneList(); // list is just the 1 object, [[OBJ, CODE, TYPE], ...] why type?
	var i;
	for (i = 0; i < objList.length; i++) {
		var curObj = objList[0];
		
	}
	console.log("Scene List:" + objList);
	list.addElement(newObjID);*/
	gGuiBase.View.refreshAllTabContent();
};

ScenesContent.prototype.onListSelect = function(event, ui, theThis) {
	//todo: Clean this code up, move over needed functions from GameCore to Game.View
	// DEBUG CODE TO FIGURE OUT WHAT THESE OBJECTS ARE
	// console.log("event, ui, thethis, this");
	// console.log(event, ui, theThis, this);

	// get objectName/objectID
	console.log(ui["selected"]["id"]);
	var selectedObjectName = ui["selected"]["id"];

	// send this info to Details panel have it update with it...
	var selectedObject = gGameCore.getObject(selectedObjectName);
	console.log(selectedObject.getXform());


	//todo: use this function to populate the details panel
};


