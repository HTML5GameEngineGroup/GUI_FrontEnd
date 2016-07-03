
function TransformContent(tabContentID, style) {
	this.isGameObjectCheck = null;
	this.objectNameText = null;
	this.objectName = null;
	this.objectXY = null;
	this.objectX = null;
	this.objectY = null;
	this.objectWH = null;
	this.objectW = null;
	this.objectH = null;
	this.rotationText = null;
	this.rotationField = null;
	this.rotationSlider = null;
	
	GuiTabContent.call(this, tabContentID, style);
}

gGuiBase.Core.inheritPrototype(TransformContent, GuiTabContent);

TransformContent.prototype.initialize = function () {
	var textFieldStyle = 'width: 90px;';
	var sliderStyle = 'width: 180px; margin-top: 10px; margin-bottom: 10px';
	
	this.objectNameText = new Text("gameObjectNameText", GuiTabContent.NO_STYLE, "Name");
	this.objectName = new TextField("gameObjectNameField", GuiTabContent.NO_STYLE, "GameObj0");
	this.objectXY = new Text("gameObjectXYText", GuiTabContent.NO_STYLE, "X / Y");
	this.objectX = new TextField("gameObjectXField", textFieldStyle, "20");
	this.objectY = new TextField("gameObjectYField", textFieldStyle, "60");
	
	this.objectWH = new Text("gameObjectWHText", GuiTabContent.NO_STYLE, "W / H");
	this.objectW = new TextField("gameObjectWField", textFieldStyle, "5");
	this.objectH = new TextField("gameObjectHField", textFieldStyle, "5");
	
	this.rotationText = new Text("gameObjectRotationText", GuiTabContent.NO_STYLE, "Rotation");
	this.rotationField = new TextField("gameObjectRotationField", GuiTabContent.NO_STYLE, "0");
	this.rotationSlider = new Slider("gameObjectRotationSlider", sliderStyle);
	
	this.widgetList.push(this.objectNameText);
	this.widgetList.push(this.objectName);
	this.widgetList.push(this.objectXY);
	this.widgetList.push(this.objectX);
	this.widgetList.push(this.objectY);
	this.widgetList.push(this.objectWH);
	this.widgetList.push(this.objectW);
	this.widgetList.push(this.objectH);
	this.widgetList.push(this.rotationText);
	this.widgetList.push(this.rotationField);
	this.widgetList.push(this.rotationSlider);
	
};

TransformContent.prototype.initializeEventHandling = function () {
	this.objectName.setOnFocusOut(onTextFieldFocusOut);
	this.objectX.setOnFocusOut(onTextFieldFocusOut);
	this.objectY.setOnFocusOut(onTextFieldFocusOut);
	this.objectW.setOnFocusOut(onTextFieldFocusOut);
	this.objectH.setOnFocusOut(onTextFieldFocusOut);
	
	this.rotationSlider.setOnSliderChange(onSliderChange);
};

var onTextFieldFocusOut = function() {
	//Can do all the handling for changing game object here
};

var onSliderChange = function(sliderValue) {
	
};



