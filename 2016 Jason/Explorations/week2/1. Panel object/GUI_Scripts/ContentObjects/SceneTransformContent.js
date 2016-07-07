
function SceneTransformContent(tabContentID, style, title) {
	this.objectNameText = null;
	this.objectName = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(SceneTransformContent, GuiTabContent);

SceneTransformContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 10px; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	
	this.objectNameText = new Text("sceneNameText", textStyle, "Name");
	this.objectName = new TextField("sceneNameField", textFieldStyle, "Scene0");
	
	this.widgetList.push(this.objectNameText);
	this.widgetList.push(this.objectName);
	
};

SceneTransformContent.prototype.initializeEventHandling = function () {
	this.objectName.setOnFocusOut(this.onTextFieldFocusOut);
};

SceneTransformContent.prototype.onTextFieldFocusOut = function(textField) {
	var gLastSetName = textField.val();
	var scene = gGuiBase.SceneSupport.gCurrentScene;
	
	if (textField.val() == scene.mName) return;
	
	if (!gGuiBase.SceneSupport.checkForNameConflict(textField.val())) {
		scene.mName = textField.val();
		gGuiBase.Core.reinitializeSceneTab();
		gGuiBase.Core.selectDetailsScene(scene.mName);
	} else {
		$(this).val(gLastSetName);
		alert("Names must be unique.");
		
	}
};

SceneTransformContent.prototype.updateFields = function(scene) {
	//console.log(scene);
	this.objectName.setText(scene.mName);

};



