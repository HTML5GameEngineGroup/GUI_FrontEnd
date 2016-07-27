/*-----------------------------------------------------------------------------
//	Scene content
//	Extension of GuiTabContent
//
//	Author: Jason Herold/Thoof
-----------------------------------------------------------------------------*/
function CamerasContent(tabContentID, style, title) {
	this.cameraAddButton = null;
	this.cameraSelectList = null;
	
	this.selectListID = "cameraSelectList";
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(CamerasContent, GuiTabContent);

CamerasContent.prototype.initialize = function () {
	this.cameraAddButton = new Button("cameraAddButton", GuiTabContent.NO_STYLE, "+Camera");
	this.widgetList.push(this.cameraAddButton);
	
	this.cameraSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', [], 'display: inline; margin: 5px');
	
	this.widgetList.push(this.cameraSelectList);


};

CamerasContent.prototype.initializeEventHandling = function () {
	this.cameraAddButton.setOnClick(this.buttonOnClick);
	this.cameraSelectList.setOnSelect(this.onListSelect);

	
	this.cameraSelectList.addListClass("cameraListMenu");
	
	$(this.cameraSelectList.getID()).contextmenu({
		delegate: ".cameraListMenu",
		menu: [
			{title: "Details", cmd: "details", uiIcon: "ui-icon-info"},
			{title: "Edit code", cmd: "edit", uiIcon: "ui-icon-pencil"},
			{title: "Delete", cmd: "delete", uiIcon: "ui-icon-closethick"}
		],
		select: function(event, ui) {
			switch (ui.cmd) {
				case 'details':
					gGuiBase.Core.selectDetailsCamera(ui.target.text());
					break;
				case 'edit':
					console.log(ui.target.text());
					gGuiBase.EditorSupport.createFloatingEditor(ui.target.text());
					break;
				case 'delete':
                    gGuiBase.CameraSupport.deleteCamera(ui.target.text());
					break;
			}
		}
	});
	
};

CamerasContent.prototype.buttonOnClick = function() {
	gGuiBase.Core.addDefaultCamera();
};

CamerasContent.prototype.onListSelect = function(ui) {
	
	// get objectName/objectID
	console.log(ui["selected"]["id"]);
	var selectedCameraName = ui["selected"]["id"];
	gGuiBase.Core.selectDetailsCamera( selectedCameraName );


	//todo: use this function to populate the details panel
};


