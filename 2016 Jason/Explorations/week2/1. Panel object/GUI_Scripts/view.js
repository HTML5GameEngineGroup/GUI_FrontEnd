/**
 * Created by MetaBlue on 6/26/16.
 */
$( document ).ready(function() {
	console.log(GuiContentWidget.NO_STYLE);
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
	
	gGuiBase.Core.addPanel(bottomPanel);
	gGuiBase.Core.addPanel(leftPanel);
	gGuiBase.Core.addPanel(rightPanel);
	
	bottomPanel.setFirstTabActive();
	leftPanel.setFirstTabActive();
	rightPanel.setFirstTabActive();
	
	console.log($('#panelLeft').outerHeight());
	
	//Silly canvas resize in center
	/*$( window ).resize(function() {
		var initWidth = 640.0;
		var initHeight = 480.0;
		var panelWidth = 234;
		
		// Vars to resize the GLCanvas with
		var availableWidth = $(window).width() - (2 * panelWidth);
		var availableHeight = $(window).height() - 48 - panelWidth;
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
		
		// Keep it centered (note: 219 and 229 are the w/h of the left/bottom panels including their white space)
		$('#GLCanvasDiv').css('position', 'absolute');
		$('#GLCanvasDiv').css("top", Math.max(0, (($(window).height() - $('#GLCanvasDiv').outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
		$('#GLCanvasDiv').css("left", Math.max(0, (($(window).width() - $('#GLCanvasDiv').outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
	});*/
	
});

