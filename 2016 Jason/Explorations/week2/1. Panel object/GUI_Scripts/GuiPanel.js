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
    var newTab = new GuiPanelTab(tabID);						//create new tab
	this.panelGroupRef.addTab(tabID, newTab);
    $(this.PanelID + " ul").append(newTab.createHeader());		//create tab_header add to panel
    $(this.PanelID).append(newTab.createContentContainer());	//create empty tab_content add to panel
    this.guiTab.tabs("refresh");
};

// moves tab object to the current panel, tab must be in the DOM already
GuiPanel.prototype.moveTabToThisPanel = function ( tabID ){
	// remove tab_header from any panel, append to back of this one
	var guiPanelTab = this.panelGroupRef.getTab( tabID );	// find the tab_header
	var $header = guiPanelTab.getHeader().detach();			// remove it
	$(this.PanelID + ' ul').append($header);				// attach to this panel
	
	// remove tab_content from any panel, append to back of this one
	var $content = guiPanelTab.getContentContainer().detach();
	$(this.PanelID).append($content);
	this.guiTab.tabs("refresh");
};

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