/**
 * Created by MetaBlue on 6/26/16.
 */
$( document ).ready(function() {
    //var panelGroup = new GuiPanelGroup();
    // Create panels
	
	var panelID = "#panelBottom";
    var bottomPanel = new GuiPanel(panelID, GuiPanelType.BOTTOM);
    //bottomPanel.addNewTab("hi");

	var extraTab = new GuiPanelTab("Extra");
	var objectsTabContent = new ObjectContent("objectsContent");

	
	bottomPanel.addTab(extraTab);
	extraTab.addContent(objectsTabContent);

	
	//var bottomPanelContent = new ObjectsContent();
	
    panelID = "#panelLeft";
    // height of side panels is based on distance from bottom panel to the top
    //var panelHeight = $(window).height() - gGuiBase.Core.getBottomPanelsHeight() - 20;
	
    var leftPanel = new GuiPanel(panelID, GuiPanelType.LEFT);
	
    panelID = "#panelRight";
    var rightPanel = new GuiPanel(panelID, GuiPanelType.RIGHT);
	
	gGuiBase.Core.addPanel(bottomPanel);
	gGuiBase.Core.addPanel(leftPanel);
	gGuiBase.Core.addPanel(rightPanel);
	
	// var tab2 = new GuiPanelTab("bye");
    // bottomPanel.addTab(tab2);
    // tab2.appendContent("<p> hi there sucka </p>");
    //leftPanel.moveTabToThisPanel("hi");

});