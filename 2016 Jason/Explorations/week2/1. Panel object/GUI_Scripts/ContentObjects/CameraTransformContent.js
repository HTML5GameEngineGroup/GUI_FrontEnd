
function CameraTransformContent(tabContentID, style, title) {
	this.objectNameText = null;
	this.objectName = null;
	
	this.wcText = null;
	this.wcXYText = null;
	this.wcX = null;
	this.wcY = null;
	this.wcWText = null;
	this.wcW = null;
	
	this.viewportText = null;
	this.viewportXYText = null;
	this.viewportX = null;
	this.viewportY = null;
	this.viewportWHText = null;
	this.viewportW = null;
	this.viewportH = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(CameraTransformContent, GuiTabContent);

CameraTransformContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 10px; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	
	this.objectNameText = new Text("cameraNameText", textStyle, "Name");
	this.objectName = new TextField("cameraNameField", textFieldStyle, "Camera0");
	
	this.wcText = new Text("cameraWCText", textStyle, "World coordinates");
	this.wcXYText = new Text("cameraWCXYText", textStyle, "X / Y");
	this.wcX = new TextField("wcx", textFieldStyle, "20");
	this.wcY = new TextField("wcy", textFieldStyle, "60");
	this.wcWText = new Text("cameraWCWText", textStyle, "W");
	this.wcW = new TextField("wcw", textFieldStyle, "50");
	
	this.viewportText = new Text("viewportText", textStyle, "Viewport");
	this.viewportXYText = new Text("viewportXYText", textStyle, "X / Y");
	this.viewportX = new TextField("viewportX", textFieldStyle, "0");
	this.viewportY = new TextField("viewportY", textFieldStyle, "0");
	this.viewportWHText = new Text("viewportWHText", textStyle, "W / H");
	this.viewportW = new TextField("viewportW", textFieldStyle, "640");
	this.viewportH = new TextField("viewportH", textFieldStyle, "480");
	
	this.widgetList.push(this.objectNameText);
	this.widgetList.push(this.objectName);
	this.widgetList.push(this.wcText);
	this.widgetList.push(this.wcXYText);
	this.widgetList.push(this.wcX);
	this.widgetList.push(this.wcY);
	this.widgetList.push(this.wcWText);
	this.widgetList.push(this.wcW);
	this.widgetList.push(this.viewportText);
	this.widgetList.push(this.viewportXYText);
	this.widgetList.push(this.viewportX);
	this.widgetList.push(this.viewportY);
	this.widgetList.push(this.viewportWHText);
	this.widgetList.push(this.viewportW);
	this.widgetList.push(this.viewportH);
	
};

CameraTransformContent.prototype.initializeEventHandling = function () {
	this.objectName.setOnFocusOut(this.onTextFieldFocusOut);
	this.wcX.setOnFocusOut(this.onTextFieldFocusOut);
	this.wcY.setOnFocusOut(this.onTextFieldFocusOut);
	this.wcW.setOnFocusOut(this.onTextFieldFocusOut);
	this.viewportX.setOnFocusOut(this.onTextFieldFocusOut);
	this.viewportY.setOnFocusOut(this.onTextFieldFocusOut);
	this.viewportW.setOnFocusOut(this.onTextFieldFocusOut);
	this.viewportH.setOnFocusOut(this.onTextFieldFocusOut);

};

CameraTransformContent.prototype.onTextFieldFocusOut = function() {
	
};

CameraTransformContent.prototype.updateFields = function( camera ) {
	
	this.objectName.setText( camera.mName );
	var wc = camera.getWCCenter();
	var vp = camera.getViewport();
	
	this.wcX.setText(wc[0]);
	this.wcY.setText(wc[1]);
	this.wcW.setText(camera.getWCWidth());
	
	this.viewportX.setText(vp[0]);
	this.viewportY.setText(vp[1]);
	this.viewportW.setText(vp[2]);
	this.viewportH.setText(vp[3]);

};



