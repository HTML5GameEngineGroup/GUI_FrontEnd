/**
 * Created by MetaBlue on 6/24/16.
 */

//Poll mouse movement
var mouseX = 0;
var mouseY = 0;

$(document).on('mousemove', function(e){
	mouseY = e.pageY;
	mouseX = e.pageX;	
});
 

GuiPanelType = Object.freeze({
	TOP: 0,
	BOTTOM: 1,
	LEFT: 2,
	RIGHT: 3,
	FLOATING: 4
});
 
var GuiPanel = function (PanelID, panelGroup, panelType, Height) {
    this.PanelID = PanelID;
    this.guiTab = $(PanelID).tabs(); //Create the tabs
	this.panelType = panelType;
	this.panelGroupRef = panelGroup;
	this.panelGroupRef.addPanel(this);
	
    if (Height !== undefined) this.guiTab.height(Height);
	
	
	var tabs = $(PanelID).tabs();
    $(PanelID + "Sortable").sortable({ //Make the second tab panel (bottom) sortable within itself
        opacity: 0.5, //Opacity while "sorting"
        stop: function(event, ui) { //Refresh the tabs after a sort
            tabs.tabs("refresh");
			
			if (panelType != GuiPanelType.FLOATING) { //Behavior that we don't want for a floating tab window
				if (!mouseInPanelList(panelGroup.panelList)) {

					var linkHTML = (ui.item[0].innerHTML); //Get the moved elements <a> information
					//Get the href, which contains the tab name that we need to move
					var href = linkHTML.match(/href="([^"]*)/)[1];
					
					panelGroup.createFloatingPanel(ui.item, href);
				}
			}
        },

        receive : function(event, ui) { //When we drag a tab from panel to panel, also move the content of the tab
            var linkHTML = (ui.item[0].innerHTML); //Get the moved elements <a> information
            //Get the href, which contains the tab name that we need to move

            var href = linkHTML.match(/href="([^"]*)/)[1];
            var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
			
            $(href).detach().appendTo(PanelID); //Actually detach and move the tab
			
			if ($('#panelFloaterSortable li').length == 0) {
				panelGroup.removePanel("#panelFloater");
				$("#panelFloater").remove(); //Delete the panel
			}
			
            tabs.tabs("refresh");
            return true;
        }
    });
    return this;
};

// adds an empty tab to this panel
GuiPanel.prototype.addNewTab = function ( tabID ){
    // ADD TAB THE PANELS TAB BAR
    var newTab = new GuiPanelTab(tabID);

    $(this.PanelID + " ul").append(newTab.getHeader());
    // ADD CONTENT CONTENT SHOULD GO INSIDE THIS SECTION
    $(this.PanelID).append(newTab.getContentContainer());
    this.guiTab.tabs("refresh"); // MUST BE REFRESHED
};

$( document ).ready(function() {
	var panelGroup = new GuiPanelGroup();
    // Create panels
    var panelID = "#panelBottom";
    
    var bottomPanel = new GuiPanel(panelID, panelGroup, GuiPanelType.BOTTOM);
    bottomPanel.addNewTab("hi");
	
    panelID = "#panelLeft";
    // height of side panels is based on distance from bottom panel to the top
    var panelHeight = $(document).height() - parseInt($("#panelBottom").css("height")) - 10;
    var leftPanel = new GuiPanel(panelID, panelGroup ,GuiPanelType.LEFT, panelHeight);

    panelID = "#panelRight";
    var rightPanel = new GuiPanel(panelID, panelGroup, GuiPanelType.RIGHT, panelHeight);
	
	
	$("#panelRight").css("height", window.innerHeight - parseInt($("#panelBottom").css("height")) - 5);
	
    $("#panelLeft").css("height", window.innerHeight - parseInt($("#panelBottom").css("height")) - 5);
	/*
    //Resizing -- some specific details
    $("#panelLeft").resizable({ handles: "e" 
	
	});

    $("#panelBottom").resizable({
        handles: "n",
        resize: function(event, ui) {
            //Resize the left and right panels so they follow the bottom panel
            $("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
            $("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
			$("#tab1").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 55);
            ui.position.top = $(document).height() - ui.size.height; //Works without this in firefox, not with chrome
        }
    });

    $("#panelRight").resizable({
        handles: "w",
        resize: function(event, ui) { //Fix for right panel repositioning on resize
            ui.position.left = 0;

        }
    });
	
    //On window resize
    $( window ).resize(function() {
		//$("#panelBottom").css("top", $(document).height() - $("$panelBottom").height());
       // $("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("top")) - 5);
        //$("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("top")) - 5);
    });
	*/
});


//Checks if the mouse position (Global variables mouseX and mouseY) is within specified element
var mouseInElement = function(element) {
	
	var position = element.position();
	
	//If mouseX, mouseY is within the bounds of the element
	if (mouseX > position.left && mouseX < position.left + element.width() &&
		mouseY > position.top && mouseY < position.top + element.height()) {
		return true;
	} 
	return false;
};

var mouseInPanelList = function(panelList) {

	for (var i = 0; i < panelList.length; i++) {
		var tab = $(panelList[i].PanelID).tabs();
		var returnValue = mouseInElement(tab);
		if (returnValue) return true;
		
	}
	
	return false;
}