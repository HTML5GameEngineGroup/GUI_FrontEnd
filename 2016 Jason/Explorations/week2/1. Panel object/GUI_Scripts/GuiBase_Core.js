//GUI Base core functionality
var gGuiBase = gGuiBase || { };

gGuiBase.Core = (function() {
	var panelList = [];
	var floatingPanelList = [];
	var tabMap = {};
	var numFloatingPanels = 0;


	// Add a new panel to the list. Set resize functions and make the panels sortable between eachother
	var addPanel = function(guiPanel) {
		if (guiPanel.panelType == GuiPanelType.FLOATING) {
			floatingPanelList.push(guiPanel);
		} else {
			panelList.push(guiPanel);
		}
		setResizeFunction(guiPanel); //Resize based on panel type
		addTabStyle(guiPanel); //Make panels scrollable
		
		//Connect the panels with jquery ui sortable
		var panelConnectorString = "";
		
		for (var i = 0; i < panelList.length; i++) {
			panelConnectorString += panelList[i].PanelID + "Sortable, ";
		}

		if (floatingPanelList.length == 0) {
			panelConnectorString = panelConnectorString.substring(0, panelConnectorString.length-2);
		}
		
		
		for (var i = 0; i < floatingPanelList.length; i++) {
			panelConnectorString += floatingPanelList[i].PanelID + "Sortable";
			if (i != floatingPanelList.length-1) panelConnectorString += ", ";
		}
		
		$(panelConnectorString).sortable({
			opacity: 0.5,
			connectWith: ".connectedSortable",
		});
		
		var bottomPanels = getPanelsOfType(GuiPanelType.BOTTOM);
		if (bottomPanels.length > 0 && (guiPanel.panelType == GuiPanelType.RIGHT || guiPanel.panelType == GuiPanelType.LEFT)) {
			//resizeLeftRightHelper(bottomPanels[0]);
			$(guiPanel.PanelID).height($(window).height() - getBottomPanelsHeight() - 20);
		} 
		
		//If the bottom panel is added last, need to update the positions of any left/right panels
		if (guiPanel.panelType == GuiPanelType.BOTTOM) {
			resizeLeftRightHelper(guiPanel);
		}
	
	};

	var removePanel = function(panelID) {
		for (var i = 0; i < panelList.length; i++) {

			if (panelList[i].PanelID == panelID)
				panelList.splice(i, 1);
		}
		
		for (var i = 0; i < floatingPanelList.length; i++) {

			if (floatingPanelList[i].PanelID == panelID)
				floatingPanelList.splice(i, 1);
		}

		var panelConnectorString = "";
		
		for (var i = 0; i < panelList.length; i++) {
			panelConnectorString += panelList[i].PanelID + "Sortable, ";
		}

		if (floatingPanelList.length == 0) {
			panelConnectorString = panelConnectorString.substring(0, panelConnectorString.length-2);
		}
		
		for (var i = 0; i < floatingPanelList.length; i++) {
			panelConnectorString += floatingPanelList[i].PanelID + "Sortable";
			if (i != floatingPanelList.length-1) panelConnectorString += ", ";
		}

		$(panelConnectorString).sortable({
			opacity: 0.5,
			appendTo: 'body',
			zIndex: 10000,
			connectWith: ".connectedSortable"
		});
	}

	//Sets a specific resize function for specified panel type
	var setResizeFunction = function(panel) {
		switch(panel.panelType) {
			case GuiPanelType.BOTTOM:
				resizeBottom(panel);
				break;
			case GuiPanelType.TOP:
				resizeTop(panel);
				break;
			case GuiPanelType.LEFT:
				resizeLeft(panel);
				break;
			case GuiPanelType.RIGHT:
				resizeRight(panel);
				break;
			case GuiPanelType.FLOATING:
				resizeFloating(panel);
				break;
			default:
				console.log("No existing panel type for: " + panel.panelType);
		}
	};

	//Resize behavior for a panel on the bottom of the page. Pushes up panels on the right and left
	var resizeBottom = function(panel) {
		var panelID = panel.PanelID;
		
		
		$(panelID).resizable({
			handles: "n", //Only resize upward
			resize: function(event, ui) {
			   
				resizeLeftRightHelper(panel);
				
				resizeBottomHelper(panel);
				
				ui.position.top = $(window).height() - ui.size.height; //Works without this in firefox, not with chrome
			}
		});

		$( window ).resize(function() {
			$(panelID).css("top", $(window).height() - $(panelID).height());
			resizeLeftRightHelper(panel);
		});
	};

	var resizeBottomHelper = function(panel) {
		var panelID = panel.PanelID;
		var tabList = $(panel.PanelID + "Sortable");
		var tabs = tabList.find("li");
		for (var i = 0; i < tabs.length; i++) {
			
			var linkHTML = tabs[i].innerHTML;
			var href = linkHTML.match(/href="([^"]*)/)[1];
			$(href).css("height", $(panelID).height() - 60);
		}
	};


	var resizeLeftRightHelper = function(panel) {
		var panelID = panel.PanelID;
		var leftPanels = getPanelsOfType(GuiPanelType.LEFT); //Get all panels of type left
		var rightPanels = getPanelsOfType(GuiPanelType.RIGHT); //Get all panels of type right
		
		for (var i = 0; i < leftPanels.length; i++) {
			//Adjust height of actual panel based on bottom panel
			$(leftPanels[i].PanelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
			
			resizeLeftRightTabContentPane(leftPanels[i]);
			
		}
		//Same process for right panels
		for (var i = 0; i < rightPanels.length; i++) {
			//Adjust height according to bottom panel
			$(rightPanels[i].PanelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
			resizeLeftRightTabContentPane(rightPanels[i]);
		}
	};

	var resizeLeftRightTabContentPane = function(panel) {
			//Get the list of tab content containers
			var tabList = $(panel.PanelID + "Sortable");
			var tabs = tabList.find("li");
			
			for (var i = 0; i < tabs.length; i++) {
				//For each tab content container, resize it so that the scrollbar will fit
				var linkHTML = tabs[i].innerHTML;
				var href = linkHTML.match(/href="([^"]*)/)[1];
				
				var heightSum = getBottomPanelsHeight();
				
				$(href).css("height", $(window).height() - heightSum - 60);
			}
	};

	var resizeTop = function(panel) {
		//Not currently used
		var panelID = panel.PanelID;
		
	};

	//Resize for left type panels
	var resizeLeft = function(panel) {
		 var panelID = panel.PanelID;
		 $(panelID).resizable({ handles: "e",
			resize: function(event, ui) {
				var tabWidth = getTabsWidth(panelID);
				ui.size.width = Math.max(ui.size.width, tabWidth);
			}
		 }); //Just resize to the right
		 $(panelID).css("height", $(window).height() - parseInt($(panelID).css("height")) - 5);
		 
		 $( window ).resize(function() {
			var heightSum = getBottomPanelsHeight();
			$(panelID).css("height", $(window).height() - heightSum - 5);
		});
	};

	var resizeRight = function(panel) {
		var panelID = panel.PanelID;
		$(panelID).resizable({
			handles: "w",
			resize: function(event, ui) { //Fix for right panel repositioning on resize
				ui.position.left = 0;
				var tabWidth = getTabsWidth(panelID);
				ui.size.width = Math.max(ui.size.width, tabWidth);
			}
		});
		$(panelID).css("height", $(window).height() - parseInt($(panelID).css("height")));
		
		
		$( window ).resize(function() {
			var heightSum = getBottomPanelsHeight();
			$(panelID).css("height", $(window).height() - heightSum - 5);
		});
	};

	var getBottomPanelsHeight = function() {
		var bottomPanels = getPanelsOfType(GuiPanelType.BOTTOM);
		var heightSum = 0; //Sum up the heights of all the bottom panels
		for (var i = 0; i < bottomPanels.length; i++) {
			heightSum += $(bottomPanels[i].PanelID).height();
		}
		return heightSum;
	};

	var resizeFloating = function(panel) {
		var panelID = panel.PanelID;
		var numFloating = numFloatingPanels.toString();
		$(panelID).resizable({
			
			resize: function(event, ui) {
				var tabWidth = getTabsWidth(panelID);
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
			$(href).css("height", $("#panelFloater" + numFloatingPanels.toString()).height() - 60);
		}
	}



	var createFloatingPanel = function(tabheader, tab) {
		$("body").append('<div id="panelFloater' + numFloatingPanels.toString() + '"><ul id="panelFloater' + numFloatingPanels.toString() +'Sortable" class="connectedSortable"></ul></div></div>');
		var floaterTabs = $("#panelFloater" + numFloatingPanels.toString()).tabs();  
		
		var panelID = "#panelFloater" + numFloatingPanels.toString();
		var floatingPanel = new GuiPanel(panelID, GuiPanelType.FLOATING);
		addPanel(floatingPanel);
		
		$(panelID).css("position", "fixed");
		$(panelID).css("height", "234px");
		$(panelID).css("width", "234px");
		
		//Attach the dragged tab and its content to the new panel
		var floatingTabs = $("#panelFloater" + numFloatingPanels.toString() + "Sortable");
		tabheader.removeAttr("style"); //Dragging gives some style elements that we don't want
		tabheader.detach().appendTo(floatingTabs); //Take the dragged tab header and put it on the new panel
		$(tab).detach().appendTo(panelID); //Take the tab contents and put it on the new panel
		
		refreshAll();
		
		var tabList = $("#panelFloater" + numFloatingPanels.toString() + "Sortable");
		var tabs = tabList.find("li");
		for (var i = 0; i < tabs.length; i++) {
			
			var linkHTML = tabs[i].innerHTML;
			var href = linkHTML.match(/href="([^"]*)/)[1];
			//var divID = href.substring(1); //Remove the # since we won't be referring to it as a link

			$(href).css("height", $("#panelFloater"+ numFloatingPanels.toString()).height() - 60);
			//console.log($(panelID).height());
		}
		
		//Make the floating panel draggable only by the top bar
		$(panelID).draggable({
			handle: "#panelFloater" + numFloatingPanels.toString() + "Sortable",
			stack: "div" //Make currently dragged panel stack on top of other panels/divs
		});
		
		//Place the panel at the dropped mouse position
		$(panelID).css("top", mouseY);
		$(panelID).css("left", mouseX);
		
		
		
		numFloatingPanels++;
		
	};

	//Refresh all panels within the group
	var refreshAll = function() {
		for (var i = 0; i < panelList.length; i++) {
			
			var panelID = panelList[i].PanelID;
			panelList[i].guiTab.tabs("refresh");
			
			var tabWidth = getTabsWidth(panelID);
			$(panelID).width(Math.max($(panelID).width(), tabWidth));
		}
		
		for (var i = 0; i < floatingPanelList.length; i++) {
			
			var panelID = floatingPanelList[i].PanelID;
			floatingPanelList[i].guiTab.tabs("refresh");
			
			var tabWidth = getTabsWidth(panelID);
			$(panelID).width(Math.max($(panelID).width(), tabWidth));
		}
	};

	//Get all panels of a specific type
	var getPanelsOfType = function(panelType) {
		var panelArray = [];
		for (var i = 0; i < panelList.length; i++) {
			if (panelList[i].panelType == panelType) {
				panelArray.push(panelList[i]);
			}
		}
		return panelArray;
	};

	//Add scrollbars to all tab containers
	var addTabStyle = function(panel) {
		var tabList = $(panel.PanelID + "Sortable");
		var tabs = tabList.find("li");
		
		for (var i = 0; i < tabs.length; i++) {
			var linkHTML = tabs[i].innerHTML;
			var href = linkHTML.match(/href="([^"]*)/)[1];
			//var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
			
			$(href).attr("style", "overflow: auto");
			
			var bottomPanelHeight = getBottomPanelsHeight();
			
			$(href).css("height", $(window).height() - bottomPanelHeight - 60);
		}
	};

	var getTabsWidth = function(panelID) {
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

	var addTab = function (tabID, theTab) {
		tabMap[tabID] = theTab;
	};

	var getTab = function (tabID) {
		return tabMap[tabID];
	};
	
	var mPublic = {
        addPanel: addPanel,
        removePanel: removePanel,
        refreshAll: refreshAll,
        resizeLeftRightHelper: resizeLeftRightHelper,
        resizeBottomHelper: resizeBottomHelper,
        getBottomPanelsHeight: getBottomPanelsHeight,
		createFloatingPanel: createFloatingPanel,
		getPanelsOfType: getPanelsOfType,
		addTab: addTab,
		getTab: getTab,
		
		floatingPanelList: floatingPanelList,
		panelList: panelList
    };

    return mPublic;

}());