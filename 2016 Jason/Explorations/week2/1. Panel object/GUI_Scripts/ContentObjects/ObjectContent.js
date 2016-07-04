
function ObjectContent(tabContentID, style, title) {
	this.objectAddButton = null;
	this.objectSelectList = null;
	this.widgetList = null;

	this.selectListID = "objectSelectList1";
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(ObjectContent, GuiTabContent);

ObjectContent.prototype.initialize = function () {
	this.objectAddButton = new Button("objectAddButton", GuiTabContent.NO_STYLE, "+Object");
	this.widgetList.push(this.objectAddButton);
	this.objectSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', []);
	this.widgetList.push(this.objectSelectList);
	this.initializeEventHandling();
};

// connects the eventHandlers to their specific methods
ObjectContent.prototype.initializeEventHandling = function () {
	this.objectAddButton.setOnClick(this.buttonOnClick);
	this.objectSelectList.setOnSelect(this.selectObject);
};

// adds a new object when addObject button is left-clicked
ObjectContent.prototype.buttonOnClick = function() {
	gGuiBase.Core.addDefaultObject();
};

// this function handles the left click event on an object in the object tab
// populates the details tab with the object information
ObjectContent.prototype.selectObject = function( ui ) {
	// get objectName/objectID
	var selectedObjectName = ui["selected"]["id"];
	gGuiBase.Core.selectDetailsObject( selectedObjectName );
};

// these are global
ObjectContent.prototype.onTextFieldFocusOut = function() {
	alert("focus out");
};

ObjectContent.prototype.onSliderChange = function(sliderValue) {
	console.log("slider value: " + sliderValue);
};



