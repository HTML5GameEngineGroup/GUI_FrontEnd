
function ObjectContent(tabContentID) {
	this.objectAddButton = null;
	this.objectSelectList = null;
	this.widgetList = null;

	this.selectListID = "objectSelectList1";
	GuiTabContent.call(this, tabContentID);
}

gGuiBase.View.inheritPrototype(ObjectContent, GuiTabContent);

ObjectContent.prototype.initialize = function () {
	this.objectAddButton = new Button("objectAddButton", GuiTabContent.NO_STYLE, "+Object");
	this.widgetList.push(this.objectAddButton);
	
	// var testArray = ["list1", "list2", "list3"];
	// this.objectSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', testArray);
	//todo: get function that gets list of already created objects
	// var objects = 
	this.objectSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', []);

	this.objectSelectList.setOnSelect(this.selectObject);
	// this.objectSelectList = new SelectList("objectSelectList1", []);
	this.widgetList.push(this.objectSelectList);
};

ObjectContent.prototype.initializeEventHandling = function () {
	this.objectAddButton.setOnClick(this.buttonOnClick);
	this.objectSelectList.setOnSelect(this.selectObject);
	// this.textField.setOnFocusOut(onTextFieldFocusOut);
	// this.testSlider.setOnSliderChange(onSliderChange);
};

ObjectContent.prototype.buttonOnClick = function() {
	// var newObjID = gGameCore.createDefaultObject();
	// var newObj = gGameCore.getObject(newObjID); // controller should do this
	// console.log("get object by id: " + newObj);
	// // we could regenerate the object select list every time
	// // var objList = gGameCore.getObjectList(); // list is just the 1 object, [[OBJ, CODE, TYPE], ...] why type?
	//
	// console.log("Object List:" + objList);
	// this.objectSelectList.addElement(newObjID);
	gGuiBase.Core.addDefaultObject();
};

ObjectContent.prototype.selectObject = function(event, ui, theThis) {
	//todo: Clean this code up, move over needed functions from GameCore to core_object_support
	// DEBUG CODE TO FIGURE OUT WHAT THESE OBJECTS ARE
	// console.log("event, ui, thethis, this");
	// console.log(event, ui, theThis, this);
	console.log("on list select is run()");

	// get objectName/objectID
	var selectedObjectName = ui["selected"]["id"];
	
	console.log(selectedObjectName);
	//todo: create detailsContent
	// send this info to Details panel have it update with it...
	//todo: use this function to populate the details panel
};

// these are global
ObjectContent.prototype.onTextFieldFocusOut = function() {
	alert("focus out");
};

ObjectContent.prototype.onSliderChange = function(sliderValue) {
	console.log("slider value: " + sliderValue);
};



