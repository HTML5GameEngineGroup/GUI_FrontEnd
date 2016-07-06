/*-----------------------------------------------------------------------------
//	Scene content
//	Extension of GuiTabContent
//
//	Author: Jason Herold/Thoof
-----------------------------------------------------------------------------*/
function ScenesContent(tabContentID, style, title) {
	this.sceneAddButton = null;
	this.sceneSelectList = null;
	
	this.selectListID = "sceneSelectList1";
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(ScenesContent, GuiTabContent);

ScenesContent.prototype.initialize = function () {
	this.sceneAddButton = new Button("sceneAddButton", GuiTabContent.NO_STYLE, "+Scene");
	this.widgetList.push(this.sceneAddButton);
	
	this.sceneSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', [], 'display: inline; margin: 5px');
	
	this.widgetList.push(this.sceneSelectList);


};

ScenesContent.prototype.initializeEventHandling = function () {
	this.sceneAddButton.setOnClick(this.buttonOnClick);
	this.sceneSelectList.setOnSelect(this.onListSelect);

};

ScenesContent.prototype.buttonOnClick = function() {
	gGuiBase.Core.addDefaultScene();
};

ScenesContent.prototype.onListSelect = function(ui) {
	
	// get objectName/objectID
	console.log(ui["selected"]["id"]);
	var selectedSceneName = ui["selected"]["id"];
	gGuiBase.Core.selectDetailsScene( selectedSceneName );


	//todo: use this function to populate the details panel
};


