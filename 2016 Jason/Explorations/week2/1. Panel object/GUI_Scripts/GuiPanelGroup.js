/* Gui Panel Group */

var GuiPanelGroup = function() {
	this.panelList = [];
	this.floatingPanelList = [];
	this.numFloatingPanels = 0;
	this.tabMap = {};
};

// Add a new panel to the list. Set resize functions and make the panels sortable between eachother
GuiPanelGroup.prototype.addPanel = function(guiPanel) {
	if (guiPanel.panelType == GuiPanelType.FLOATING) {
		this.floatingPanelList.push(guiPanel);
	} else {
		this.panelList.push(guiPanel);
	}
	this.setResizeFunction(guiPanel); //Resize based on panel type
	this.addTabStyle(guiPanel); //Make panels scrollable
	
	//Connect the panels with jquery ui sortable
	var panelConnectorString = "";
	
	for (var i = 0; i < this.panelList.length; i++) {
		panelConnectorString += this.panelList[i].PanelID + "Sortable, ";
		//if (i != this.panelList.length-1) panelConnectorString += ", ";
	}

	if (this.floatingPanelList.length == 0) {
		panelConnectorString = panelConnectorString.substring(0, panelConnectorString.length-2);
	}
	
	for (var i = 0; i < this.floatingPanelList.length; i++) {
		panelConnectorString += this.floatingPanelList[i].PanelID + "Sortable";
		if (i != this.floatingPanelList.length-1) panelConnectorString += ", ";
	}
	
	$(panelConnectorString).sortable({
        opacity: 0.5,
		//helper: 'clone',
		//appendTo: 'body',
		//zIndex: 10000,
        connectWith: ".connectedSortable",
    });
	
	var bottomPanels = this.getPanelsOfType(GuiPanelType.BOTTOM);
	if (bottomPanels.length > 0 && (guiPanel.panelType == GuiPanelType.RIGHT || guiPanel.panelType == GuiPanelType.LEFT)) {
		//this.resizeLeftRightHelper(bottomPanels[0]);
		$(guiPanel.PanelID).height($(window).height() - this.getBottomPanelsHeight() - 20);
	} 
	
	//If the bottom panel is added last, need to update the positions of any left/right panels
	if (guiPanel.panelType == GuiPanelType.BOTTOM) {
		this.resizeLeftRightHelper(guiPanel);
	}
	
};

GuiPanelGroup.prototype.removePanel = function(panelID) {
	for (var i = 0; i < this.panelList.length; i++) {

		if (this.panelList[i].PanelID == panelID)
			this.panelList.splice(i, 1);
	}
	
	for (var i = 0; i < this.floatingPanelList.length; i++) {

		if (this.floatingPanelList[i].PanelID == panelID)
			this.floatingPanelList.splice(i, 1);
	}

	var panelConnectorString = "";
	
	for (var i = 0; i < this.panelList.length; i++) {
		panelConnectorString += this.panelList[i].PanelID + "Sortable, ";
		//if (i != this.panelList.length-1) panelConnectorString += ", ";
	}

	if (this.floatingPanelList.length == 0) {
		panelConnectorString = panelConnectorString.substring(0, panelConnectorString.length-2);
	}
	
	for (var i = 0; i < this.floatingPanelList.length; i++) {
		panelConnectorString += this.floatingPanelList[i].PanelID + "Sortable";
		if (i != this.floatingPanelList.length-1) panelConnectorString += ", ";
	}

	$(panelConnectorString).sortable({
        opacity: 0.5,
		appendTo: 'body',
		zIndex: 10000,
        connectWith: ".connectedSortable"
    });
}

//Sets a specific resize function for specified panel type
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

//Resize behavior for a panel on the bottom of the page. Pushes up panels on the right and left
GuiPanelGroup.prototype.resizeBottom = function(panel) {
	var panelID = panel.PanelID;
	
	$(panelID).resizable({
        handles: "n", //Only resize upward
        resize: function(event, ui) {
           
			panel.panelGroupRef.resizeLeftRightHelper(panel);
			
			panel.panelGroupRef.resizeBottomHelper(panel);
			
            ui.position.top = $(window).height() - ui.size.height; //Works without this in firefox, not with chrome
        }
    });

	$( window ).resize(function() {
		$(panelID).css("top", $(window).height() - $(panelID).height());
		panel.panelGroupRef.resizeLeftRightHelper(panel);
    });
};

GuiPanelGroup.prototype.resizeBottomHelper = function(panel) {
	var panelID = panel.PanelID;
	var tabList = $(panel.PanelID + "Sortable");
	var tabs = tabList.find("li");
	for (var i = 0; i < tabs.length; i++) {
		
		var linkHTML = tabs[i].innerHTML;
		var href = linkHTML.match(/href="([^"]*)/)[1];
		$(href).css("height", $(panelID).height() - 60);
	}
};


GuiPanelGroup.prototype.resizeLeftRightHelper = function(panel) {
	var panelID = panel.PanelID;
	var leftPanels = panel.panelGroupRef.getPanelsOfType(GuiPanelType.LEFT); //Get all panels of type left
	var rightPanels = panel.panelGroupRef.getPanelsOfType(GuiPanelType.RIGHT); //Get all panels of type right
	
	for (var i = 0; i < leftPanels.length; i++) {
		//Adjust height of actual panel based on bottom panel
		$(leftPanels[i].PanelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
		
		panel.panelGroupRef.resizeLeftRightTabContentPane(leftPanels[i]);
		
	}
	//Same process for right panels
	for (var i = 0; i < rightPanels.length; i++) {
		//Adjust height according to bottom panel
		$(rightPanels[i].PanelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
		panel.panelGroupRef.resizeLeftRightTabContentPane(rightPanels[i]);
	}
};

GuiPanelGroup.prototype.resizeLeftRightTabContentPane = function(panel) {
		//Get the list of tab content containers
		var tabList = $(panel.PanelID + "Sortable");
		var tabs = tabList.find("li");
		
		for (var i = 0; i < tabs.length; i++) {
			//For each tab content container, resize it so that the scrollbar will fit
			var linkHTML = tabs[i].innerHTML;
			var href = linkHTML.match(/href="([^"]*)/)[1];
			
			var heightSum = this.getBottomPanelsHeight();
			
			$(href).css("height", $(window).height() - heightSum - 60);
		}
};

GuiPanelGroup.prototype.resizeTop = function(panel) {
	//Not currently used
	var panelID = panel.PanelID;
	
};

//Resize for left type panels
GuiPanelGroup.prototype.resizeLeft = function(panel) {
	 var panelID = panel.PanelID;
	 $(panelID).resizable({ handles: "e",
		resize: function(event, ui) {
			var tabWidth = panel.panelGroupRef.getTabsWidth(panelID);
			ui.size.width = Math.max(ui.size.width, tabWidth);
		}
	 }); //Just resize to the right
	 $(panelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
	 
	 $( window ).resize(function() {
		var heightSum = panel.panelGroupRef.getBottomPanelsHeight();
		$(panelID).css("height", $(window).height() - heightSum - 5);
    });
};

GuiPanelGroup.prototype.resizeRight = function(panel) {
	var panelID = panel.PanelID;
	$(panelID).resizable({
        handles: "w",
        resize: function(event, ui) { //Fix for right panel repositioning on resize
            ui.position.left = 0;
			var tabWidth = panel.panelGroupRef.getTabsWidth(panelID);
			ui.size.width = Math.max(ui.size.width, tabWidth);
        }
    });
	$(panelID).css("height", $(window).height() - parseInt($(panelID).css("height")));
	
	
	$( window ).resize(function() {
		var heightSum = panel.panelGroupRef.getBottomPanelsHeight();
		$(panelID).css("height", $(window).height() - heightSum - 5);
    });
};

GuiPanelGroup.prototype.getBottomPanelsHeight = function() {
	var bottomPanels = this.getPanelsOfType(GuiPanelType.BOTTOM);
	var heightSum = 0; //Sum up the heights of all the bottom panels
	for (var i = 0; i < bottomPanels.length; i++) {
		heightSum += $(bottomPanels[i].PanelID).height();
	}
	return heightSum;
};

GuiPanelGroup.prototype.resizeFloating = function(panel) {
	var panelID = panel.PanelID;
	var numFloating = this.numFloatingPanels.toString();
	$(panelID).resizable({
		
		resize: function(event, ui) {
			var tabWidth = panel.panelGroupRef.getTabsWidth(panelID);
			ui.size.width = Math.max(ui.size.width, tabWidth);
			
			var tabList = $(panelID + "Sortable");
			var tabs = tabList.find("li");
			for (var i = 0; i < tabs.length; i++) {
				
				var linkHTML = tabs[i].innerHTML;
				var href = linkHTML.match(/href="([^"]*)/)[1];
				//var divID = href.substring(1); //Remove the # since we won't be referring to it as a link

				$(href).css("height", $("#panelFloater" + numFloating).height() - 60);
				//console.log($(panelID).height());
			}
		}
	});
	
	var tabList = $("#panelFloater" + numFloating + "Sortable");
	var tabs = tabList.find("li");
	for (var i = 0; i < tabs.length; i++) {
		var linkHTML = tabs[i].innerHTML;
		var href = linkHTML.match(/href="([^"]*)/)[1];
		$(href).css("height", $("#panelFloater" + this.numFloatingPanels.toString()).height() - 60);
	}
}



GuiPanelGroup.prototype.createFloatingPanel = function(tabheader, tab) {
	$("body").append('<div id="panelFloater' + this.numFloatingPanels.toString() + '"><ul id="panelFloater' + this.numFloatingPanels.toString() +'Sortable" class="connectedSortable"></ul></div></div>');
	var floaterTabs = $("#panelFloater" + this.numFloatingPanels.toString()).tabs();  
	
	var panelID = "#panelFloater" + this.numFloatingPanels.toString();
    var floatingPanel = new GuiPanel(panelID, this, GuiPanelType.FLOATING);
	
	$(panelID).css("position", "fixed");
	$(panelID).css("height", "234px");
	$(panelID).css("width", "234px");
	
	//Attach the dragged tab and its content to the new panel
	var floatingTabs = $("#panelFloater" + this.numFloatingPanels.toString() + "Sortable");
	tabheader.removeAttr("style"); //Dragging gives some style elements that we don't want
	tabheader.detach().appendTo(floatingTabs); //Take the dragged tab header and put it on the new panel
	$(tab).detach().appendTo(panelID); //Take the tab contents and put it on the new panel
	
	this.refreshAll();
	
	var tabList = $("#panelFloater" + this.numFloatingPanels.toString() + "Sortable");
	var tabs = tabList.find("li");
	for (var i = 0; i < tabs.length; i++) {
		
		var linkHTML = tabs[i].innerHTML;
		var href = linkHTML.match(/href="([^"]*)/)[1];
		//var divID = href.substring(1); //Remove the # since we won't be referring to it as a link

		$(href).css("height", $("#panelFloater"+ this.numFloatingPanels.toString()).height() - 60);
		//console.log($(panelID).height());
	}
	
	//Make the floating panel draggable only by the top bar
	$(panelID).draggable({
		handle: "#panelFloater" + this.numFloatingPanels.toString() + "Sortable",
		stack: "div" //Make currently dragged panel stack on top of other panels/divs
	});
	
	//Place the panel at the dropped mouse position
	$(panelID).css("top", mouseY);
	$(panelID).css("left", mouseX);
	
	this.numFloatingPanels++;
	
};

//Refresh all panels within the group
GuiPanelGroup.prototype.refreshAll = function() {
	for (var i = 0; i < this.panelList.length; i++) {
		
		var panelID = this.panelList[i].PanelID;
		this.panelList[i].guiTab.tabs("refresh");
		
		var tabWidth = this.getTabsWidth(panelID);
		$(panelID).width(Math.max($(panelID).width(), tabWidth));
	}
	
	for (var i = 0; i < this.floatingPanelList.length; i++) {
		
		var panelID = this.floatingPanelList[i].PanelID;
		this.floatingPanelList[i].guiTab.tabs("refresh");
		
		var tabWidth = this.getTabsWidth(panelID);
		$(panelID).width(Math.max($(panelID).width(), tabWidth));
	}
};

//Get all panels of a specific type
GuiPanelGroup.prototype.getPanelsOfType = function(panelType) {
	var panelArray = [];
	for (var i = 0; i < this.panelList.length; i++) {
		if (this.panelList[i].panelType == panelType) {
			panelArray.push(this.panelList[i]);
		}
	}
	return panelArray;
};

//Add scrollbars to all tab containers
GuiPanelGroup.prototype.addTabStyle = function(panel) {
	var tabList = $(panel.PanelID + "Sortable");
	var tabs = tabList.find("li");
	
	for (var i = 0; i < tabs.length; i++) {
		var linkHTML = tabs[i].innerHTML;
		var href = linkHTML.match(/href="([^"]*)/)[1];
		//var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
		
		$(href).attr("style", "overflow: auto");
		
		var bottomPanelHeight = this.getBottomPanelsHeight();
		
		$(href).css("height", $(window).height() - bottomPanelHeight - 60);
	}
};

GuiPanelGroup.prototype.getTabsWidth = function(panelID) {
	var widthInPixel = 0;
	
	var tabList = $(panelID + "Sortable li");
	
	tabList.each(function(index) {
		widthInPixel += ($(this).width());
		var padding = $(this).css("border-top-right-radius");
		padding = parseInt(padding.substring(0, padding.length - 2));
		widthInPixel += 15;
	});
	
	return widthInPixel;

};

GuiPanelGroup.prototype.addTab = function (tabID, theTab) {
	this.tabMap[tabID] = theTab;
};

GuiPanelGroup.prototype.getTab = function (tabID) {
	return this.tabMap[tabID];
};