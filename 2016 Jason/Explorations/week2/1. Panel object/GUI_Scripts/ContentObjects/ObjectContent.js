
function ObjectContent(tabContentID) {
	this.objectAddButton = null;
	this.objectSelectList = null;
	this.textField = null;
	this.testSlider = null;
	this.widgetList = null;
	GuiTabContent.call(this, tabContentID);
}

gGuiBase.Core.inheritPrototype(ObjectContent, GuiTabContent);

ObjectContent.prototype.initialize = function () {
	this.objectAddButton = new Button("objectAddButton", "+Object");
	this.widgetList.push(this.objectAddButton);
	
	var testArray = ["list1", "list2", "list3"];
	this.objectSelectList = new SelectList("objectSelectList1", testArray);
	// this.objectSelectList = new SelectList("objectSelectList1", []);
	this.widgetList.push(this.objectSelectList);

	// this.textField = new TextField("textField1");
	// this.widgetList.push(this.textField);

	// this.testSlider = new Slider("TestSlider1");
	// this.widgetList.push(this.testSlider);
	
};

ObjectContent.prototype.initializeEventHandling = function () {
	this.objectAddButton.setOnClick(this.buttonOnClick);
	this.objectSelectList.setOnSelect(onListSelect);
	// this.textField.setOnFocusOut(onTextFieldFocusOut);
	// this.testSlider.setOnSliderChange(onSliderChange);
};

ObjectContent.prototype.buttonOnClick = function() {
	var list = gGuiBase.Core.findWidgetByID("#objectSelectList1");
	var newObjID = gGameCore.createDefaultObject();
	var newObj = gGameCore.getObject(newObjID);
	console.log("get object by id: " + newObj);
	var objList = gGameCore.getObjectList(); // list is just the 1 object, [[OBJ, CODE, TYPE], ...] why type?
	var i;
	for (i = 0; i < objList.length; i++) {
		var curObj = objList[0];
		
	}
	console.log("Object List:" + objList);
	list.addElement(newObjID);
	gGuiBase.Core.refreshAllTabContent();
};

var onListSelect = function(selectedElement) {
	alert(selectedElement);
	alert(selectedElement.id);
	//todo: use this function to populate the details panel
};

var onTextFieldFocusOut = function() {
	alert("focus out");
};

var onSliderChange = function(sliderValue) {
	console.log("slider value: " + sliderValue);
};


