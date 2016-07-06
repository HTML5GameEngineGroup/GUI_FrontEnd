/**
 * Created by MetaBlue on 6/26/16.
 */
$( document ).ready(function() {

	//Create bottom panel and tabs
	var panelID = "#panelBottom";
    var bottomPanel = new GuiPanel(panelID, GuiPanelType.BOTTOM);

	var scenesTab = new GuiPanelTab("Scenes");
	bottomPanel.addTab(scenesTab);
	var sceneContent = new ScenesContent("ScenesContent");
	scenesTab.addContent(sceneContent);
	
	var camerasTab = new GuiPanelTab("Cameras");
	bottomPanel.addTab(camerasTab);
	
	var instancesTab = new GuiPanelTab("Instances");
	bottomPanel.addTab(instancesTab);
	
	//Create left panel and tabs
    panelID = "#panelLeft";
    var leftPanel = new GuiPanel(panelID, GuiPanelType.LEFT);
	
	var contentStyle = 'border: 2px solid #d3d3d3; border-radius: 1px; padding: 0px; margin-bottom: 20px;';
	
	var objectsTab = new GuiPanelTab("Objects");
	var objectsTabContent = new ObjectContent("ObjectsContent", contentStyle);
	leftPanel.addTab(objectsTab);
	objectsTab.addContent(objectsTabContent);
	
	var texturesTab = new GuiPanelTab("Textures");
	//var texturesTabContent = new GuiTabContent("TexturesContent");
	//texturesTab.addContent(texturesTabContent);
	leftPanel.addTab(texturesTab);

	
	//Create right panel and tabs
    panelID = "#panelRight";
    var rightPanel = new GuiPanel(panelID, GuiPanelType.RIGHT);
	var detailsTab = new GuiPanelTab("Details");
	
	var detailsTransform = new TransformContent("TransformContent", contentStyle, "Transform");
	var detailsColorTexture = new ColorTextureContent("ColorTextureContent", contentStyle, "Texture");
	rightPanel.addTab(detailsTab);
	detailsTab.addContent(detailsTransform);
	detailsTab.addContent(detailsColorTexture);
	
	//Would have to do this for each tab we want to have collapsible elements
	//tabContentAccordion(detailsTab.getID());
	detailsTab.tabContentAccordion(detailsTab.getID());
	
	leftPanel.setTopDistance(48);
	rightPanel.setTopDistance(48);
	
	gGuiBase.View.addPanel(bottomPanel);
	gGuiBase.View.addPanel(leftPanel);
	gGuiBase.View.addPanel(rightPanel);
	
	
	bottomPanel.setFirstTabActive();
	leftPanel.setFirstTabActive();
	rightPanel.setFirstTabActive();
	
	onWindowResize();
	gGuiBase.Core.initializeInitialScene();
	
	$( window ).resize(function() {
		onWindowResize();
		
	});
	
});

var onWindowResize = function() {
	var initWidth = 640.0;
	var initHeight = 480.0;
	
	//var tabWidth = gGuiBase.View.getTabsWidth("#panelLeft");
	//var leftPanelEdge = Math.max($("#panelLeft").outerWidth(true), tabWidth);
	var leftPanelEdge = $("#panelLeft").outerWidth(true);
	
	//var tabWidth = gGuiBase.View.getTabsWidth("#panelRight");
	//var rightEdge = Math.max($("#panelRight").outerWidth(true), tabWidth);
	//var rightPanelEdge = $(window).width() - rightEdge;
	var rightPanelEdge = $(window).width() - $("#panelRight").outerWidth(true);
	
	var dropdownEdge = 48;
	var bottomPanelEdge = $("#panelBottom").position().top;

	// Vars to resize the GLCanvas with
	var availableWidth = rightPanelEdge - leftPanelEdge;
	var availableHeight = bottomPanelEdge - dropdownEdge;
	var width = availableWidth;
	var height = availableHeight;
	
	// Resize to the dimension with the lowest proportion
	if (availableWidth / initWidth > availableHeight / initHeight) {
		width = (height / initHeight) * initWidth;  // Resize based on height
	} else {
		height = (width / initWidth) * initHeight;  // Resize based on width
	}

	// Set the proper width and height
	$('#GLCanvas').width(width);
	$('#GLCanvas').height(height);
	
	
	//console.log (rightPanelEdge - leftPanelEdge);
	var centerX = ((rightPanelEdge - leftPanelEdge) / 2) + leftPanelEdge - (width / 2);
	var centerY = ((bottomPanelEdge - dropdownEdge) / 2) + dropdownEdge - (height / 2);

	
	// Keep it centered (note: 219 and 229 are the w/h of the left/bottom panels including their white space)
	$('#GLCanvasDiv').css('position', 'absolute');
	$('#GLCanvasDiv').css("top", centerY + "px");
	$('#GLCanvasDiv').css("left", centerX + "px");
};



