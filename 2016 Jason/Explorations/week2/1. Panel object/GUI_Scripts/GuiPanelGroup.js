/* Gui Panel Group */

var GuiPanelGroup = function() {
	this.panelList = [];
	
};

GuiPanelGroup.prototype.addPanel = function(guiPanel) {
	this.panelList.push(guiPanel);
	this.setResizeFunction(guiPanel);
	//this.addTabStyle(guiPanel);
	
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

GuiPanelGroup.prototype.setResizeFunction = function(panel) {
	switch(panel.panelType) {
		case GuiPanelType.BOTTOM:
			this.resizeBottom(panel);
			break;
		case GuiPanelType.TOP:
			this.resizeTop(panel);
			break;
		case GuiPanelType.LEFT:
			this.resizeLeft(panel);
			break;
		case GuiPanelType.RIGHT:
			this.resizeRight(panel);
			break;
		case GuiPanelType.FLOATING:
			this.resizeFloating(panel);
			break;
		default:
			console.log("No existing panel type for: " + panel.panelType);
	}
};

GuiPanelGroup.prototype.resizeBottom = function(panel) {
	var panelID = panel.PanelID;
	
	$(panelID).resizable({
        handles: "n",
        resize: function(event, ui) {
            //If we have right or left panels, adjust their height according to the bottom panel
			var leftPanels = panel.panelGroupRef.getPanelsOfType(GuiPanelType.LEFT);
			var rightPanels = panel.panelGroupRef.getPanelsOfType(GuiPanelType.RIGHT);
			
			for (var i = 0; i < leftPanels.length; i++) {
				//Adjust height according to bottom panel
				$(leftPanels[i].PanelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
			}
			
			for (var i = 0; i < rightPanels.length; i++) {
				//Adjust height according to bottom panel
				$(rightPanels[i].PanelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
			}
			
            ui.position.top = $(window).height() - ui.size.height; //Works without this in firefox, not with chrome
        }
    });
	
	$( window ).resize(function() {
		$(panelID).css("top", $(window).height() - $(panelID).height());
    });
};

GuiPanelGroup.prototype.resizeTop = function(panel) {
	//Not currently used
	var panelID = panel.PanelID;
	
};

GuiPanelGroup.prototype.resizeLeft = function(panel) {
	 var panelID = panel.PanelID;
	 $(panelID).resizable({ handles: "e" });
	 $(panelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
	 
	 $( window ).resize(function() {
		var bottomPanels = panel.panelGroupRef.getPanelsOfType(GuiPanelType.BOTTOM);
		var heightSum = 0; //Sum up the heights of all the bottom panels
		for (var i = 0; i < bottomPanels.length; i++) {
			heightSum += $(bottomPanels[i].PanelID).height();
		}
		$(panelID).css("height", $(window).height() - heightSum - 5);
    });
};

GuiPanelGroup.prototype.resizeRight = function(panel) {
	var panelID = panel.PanelID;
	$("#panelRight").resizable({
        handles: "w",
        resize: function(event, ui) { //Fix for right panel repositioning on resize
            ui.position.left = 0;
        }
    });
	$(panelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
	
	$( window ).resize(function() {
		var bottomPanels = panel.panelGroupRef.getPanelsOfType(GuiPanelType.BOTTOM);
		var heightSum = 0; //Sum up the heights of all the bottom panels
		for (var i = 0; i < bottomPanels.length; i++) {
			heightSum += $(bottomPanels[i].PanelID).height();
		}
		$(panelID).css("height", $(window).height() - heightSum - 5);
    });
};

GuiPanelGroup.prototype.resizeFloating = function(panelID) {
	$("#panelFloater").resizable({});
}

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
    var floatingPanel = new GuiPanel(panelID, this, GuiPanelType.FLOATING);
	
	//Attach the dragged tab and its content to the new panel
	var floatingTabs = $("#panelFloaterSortable");
	tabheader.removeAttr("style"); //Dragging gives some style elements that we don't want
	tabheader.detach().appendTo(floatingTabs); //Take the dragged tab header and put it on the new panel
	$(tab).detach().appendTo("#panelFloater"); //Take the tab contents and put it on the new panel
	
	this.refreshAll();
	
	//Make this new panel draggable and resizeable, so it feels like a window
	$("#panelFloater").resizable({
	});
	
	//Make the floating panel draggable only by the top bar
	$("#panelFloater").draggable({
		handle: "#panelFloaterSortable"
	});
	
	//Place the panel at the dropped mouse position
	$("#panelFloater").css("top", mouseY);
	$("#panelFloater").css("left", mouseX);
	
};

//Refresh all panels within the group
GuiPanelGroup.prototype.refreshAll = function() {
	for (var i = 0; i < this.panelList.length; i++) {
		this.panelList[i].guiTab.tabs("refresh");
	}
};

GuiPanelGroup.prototype.getPanelsOfType = function(panelType) {
	var panelArray = [];
	for (var i = 0; i < this.panelList.length; i++) {
		if (this.panelList[i].panelType == panelType) {
			panelArray.push(this.panelList[i]);
		}
	}
	return panelArray;
};

GuiPanelGroup.prototype.addTabStyle = function(panel) {
	var tabList = $(panel.PanelID + "Sortable");

	
	var tabs = tabList.find("li");
	for (var i = 0; i < tabs.length; i++) {
		var linkHTML = tabs[i].innerHTML;
		var href = linkHTML.match(/href="([^"]*)/)[1];
		//var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
		
		$(href).attr("style", "overflow: scroll");
		
		$(href).css("height", $(window).height() - 400);
	}
	/*tabList.tabs().each(function(index) {
		console.log($(this).html());
		var linkHTML = $(this).html();
		var href = linkHTML.match(/href="([^"]*)/)[1];
		var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
		
		console.log(divID);
	});*/
	
	
			
};