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
	var cameraContent = new CamerasContent("CameraContent");
	bottomPanel.addTab(camerasTab);
	camerasTab.addContent(cameraContent);
	
	var instancesTab = new GuiPanelTab("Instances");
	var instancesContent = new InstanceContent("InstancesContent");
	instancesTab.addContent(instancesContent);
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
	
	//var detailsTransform = new TransformContent("TransformContent", contentStyle, "Transform");
	//var detailsColorTexture = new ColorTextureContent("ColorTextureContent", contentStyle, "Texture");
	rightPanel.addTab(detailsTab);
	//detailsTab.addContent(detailsTransform);
	//detailsTab.addContent(detailsColorTexture);
	
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
	
	gGuiBase.View.onWindowResize();
	gGuiBase.Core.initializeInitialScene();
	
	$( window ).resize(function() {
		gGuiBase.View.onWindowResize();
		
	});
	
});

