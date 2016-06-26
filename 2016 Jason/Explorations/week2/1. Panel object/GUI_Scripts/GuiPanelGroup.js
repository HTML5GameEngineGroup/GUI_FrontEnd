

var GuiPanelGroup = function() {
	this.panelList = [];
	
};

GuiPanelGroup.prototype.addPanel = function(guiPanel) {
	this.panelList.push(guiPanel);
	
	var panelConnectorString = "";
	
	for (var i = 0; i < this.panelList.length; i++) {
		panelConnectorString += this.panelList[i].PanelID + "Sortable";
		if (i != this.panelList.length-1) panelConnectorString += ", ";
	};

	$(panelConnectorString).sortable({
        opacity: 0.5,
        connectWith: ".connectedSortable"
    });
};

GuiPanelGroup.prototype.removePanel = function(panelID) {
	for (var i = 0; i < this.panelList.length; i++) {

		if (this.panelList[i].PanelID == panelID)
			this.panelList.splice(i, 1);
	}

	var panelConnectorString = "";
	
	for (var i = 0; i < this.panelList.length; i++) {
		panelConnectorString += this.panelList[i].PanelID + "Sortable";
		if (i != this.panelList.length-1) panelConnectorString += ", ";
	}

	$(panelConnectorString).sortable({
        opacity: 0.5,
        connectWith: ".connectedSortable"
    });
}

GuiPanelGroup.prototype.createFloatingPanel = function(tabheader, tab) {
	$("body").append('<div id="panelFloater"><ul id="panelFloaterSortable" class="connectedSortable"></ul></div></div>');
	var floaterTabs = $("#panelFloater").tabs(); 
	
	var panelID = "#panelFloater";
    var floatingPanel = new GuiPanel(panelID, this, "floating");
	
	//Attach the dragged tab and its content to the new panel
	var floatingTabs = $("#panelFloaterSortable");
	tabheader.removeAttr("style"); //Dragging gives some style elements that we don't want
	tabheader.detach().appendTo(floatingTabs); //Take the dragged tab header and put it on the new panel
	$(tab).detach().appendTo("#panelFloater"); //Take the tab contents and put it on the new panel
	
	
	
	//tabs1.tabs("refresh");
	//floaterTabs.tabs("refresh");
	this.refreshAll();
	
	//Make this new panel draggable and resizeable, so it feels like a window
	$("#panelFloater").resizable({
	});
	
	$("#panelFloater").draggable({
	});
	
	//Place the panel at the dropped mouse position
	$("#panelFloater").css("top", mouseY);
	$("#panelFloater").css("left", mouseX);
	
};

GuiPanelGroup.prototype.refreshAll = function() {
	for (var i = 0; i < this.panelList.length; i++) {
		this.panelList[i].guiTab.tabs("refresh");
	}
};
 