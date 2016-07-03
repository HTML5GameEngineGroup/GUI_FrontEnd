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
	
	var objectsTab = new GuiPanelTab("Objects");
	var objectsTabContent = new ObjectContent("ObjectsContent", 'border: 2px solid #d3d3d3; border-radius: 1px; padding: 5px');
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
	
	var detailsTransform = new TransformContent("TransformContent");
	var detailsColorTexture = new ColorTextureContent("ColorTextureContent");
	rightPanel.addTab(detailsTab);
	detailsTab.addContent(detailsTransform);
	detailsTab.addContent(detailsColorTexture);
	
	leftPanel.setTopDistance(48);
	rightPanel.setTopDistance(48);
	
	gGuiBase.Core.addPanel(bottomPanel);
	gGuiBase.Core.addPanel(leftPanel);
	gGuiBase.Core.addPanel(rightPanel);
	
	
	bottomPanel.setFirstTabActive();
	leftPanel.setFirstTabActive();
	rightPanel.setFirstTabActive();
	
	onWindowResize();
	
	$( window ).resize(function() {
		onWindowResize();
	});
	
});

var onWindowResize = function() {
	var initWidth = 640.0;
	var initHeight = 480.0;
	
	var leftPanelEdge = (($("#panelLeft").offset().left + $("#panelLeft").outerWidth()));
	var rightPanelEdge = $("#panelRight").position().left;
	
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
	console.log(rightPanelEdge);
	
	
	// Keep it centered (note: 219 and 229 are the w/h of the left/bottom panels including their white space)
	$('#GLCanvasDiv').css('position', 'absolute');
	$('#GLCanvasDiv').css("top", dropdownEdge + "px");
	$('#GLCanvasDiv').css("left", centerX + "px");
};

