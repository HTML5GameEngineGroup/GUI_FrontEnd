
function ObjectContent(tabContentID) {
	this.objectAddButton = null;
	GuiTabContent.call(this, tabContentID);
}

gGuiBase.Core.inheritPrototype(ObjectContent, GuiTabContent);

ObjectContent.prototype.initialize = function () {
	this.objectAddButton = new Button("objectAddButton", "+Object");
	this.widgetList.push(this.objectAddButton);
	
};

ObjectContent.prototype.initializeEventHandling = function () {
	this.objectAddButton.setOnClick(buttonOnClick);
};

var buttonOnClick = function() {
	console.log("Do something");
};



