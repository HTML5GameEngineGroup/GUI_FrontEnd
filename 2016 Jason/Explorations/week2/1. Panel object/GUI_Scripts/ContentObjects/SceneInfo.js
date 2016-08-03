
function SceneInfo(tabContentID, style, title) {
	this.objectNameText = null;
	this.objectName = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(SceneInfo, GuiTabContent);

SceneInfo.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 10px; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	
	this.objectNameText = new Text("sceneNameText", textStyle, "Name");
	this.objectName = new TextField("sceneNameField", textFieldStyle, "Scene0");

	this.ambientLightLabel = new Text("ambientLightLabel", textStyle, "Ambient Lighting RGBO");
	this.ambientRed = new TextField("ambientRedField", textFieldStyle, "0.3");
	this.ambientGreen = new TextField("ambientGreenField", textFieldStyle, "0.3");
	this.ambientBlue = new TextField("ambientBlueField", textFieldStyle, "0.3");
	this.ambientOpacity = new TextField("ambientOpacityField", textFieldStyle, "1");

	this.ambientIntensityLabel = new Text("ambientIntensityLabel", textStyle, "Ambient Intensity");
	this.ambientIntensity = new TextField("ambientIntensityField", textFieldStyle, "1");

	this.widgetList.push(this.objectNameText);
	this.widgetList.push(this.objectName);
	this.widgetList.push(this.ambientLightLabel);
	this.widgetList.push(this.ambientRed);
	this.widgetList.push(this.ambientGreen);
	this.widgetList.push(this.ambientBlue);
	this.widgetList.push(this.ambientOpacity);
	this.widgetList.push(this.ambientIntensityLabel);
	this.widgetList.push(this.ambientIntensity);
};

SceneInfo.prototype.initializeEventHandling = function () {
	this.objectName.setOnFocusOut(this.onTextFieldFocusOut);
	this.ambientRed.setOnFocusOut(this.onTextFieldFocusOut);
	this.ambientGreen.setOnFocusOut(this.onTextFieldFocusOut);
	this.ambientBlue.setOnFocusOut(this.onTextFieldFocusOut);
	this.ambientOpacity.setOnFocusOut(this.onTextFieldFocusOut);
	this.ambientIntensity.setOnFocusOut(this.onTextFieldFocusOut);
};

SceneInfo.prototype.onTextFieldFocusOut = function(textField) {
	console.log(textField);
	console.log(textField.context.id);
	var textFieldId = textField.context.id;

	switch (textFieldId) {
		case "sceneNameField":
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
			break;
		case "ambientRedField":
		case "ambientGreenField":
		case "ambientBlueField":
		case "ambientOpacityField":
			var ambientColor = [$('#ambientRedField').val(),
								$('#ambientGreenField').val(),
								$('#ambientBlueField').val(),
								$('#ambientOpacityField').val()];
			gEngine.DefaultResources.setGlobalAmbientColor(ambientColor);
			console.log(ambientColor);
			console.log(gEngine.DefaultResources.getGlobalAmbientColor());
			break;
		case "ambientIntensityField":
			var ambientIntensity = textField.val();
			console.log("ambientIntensity:", ambientIntensity);
			gEngine.DefaultResources.setGlobalAmbientIntensity(ambientIntensity);
			console.log(gEngine.DefaultResources.getGlobalAmbientIntensity());
			break;
		default:
			alert("error this should be unreachable");
			break;
	}
};

SceneInfo.prototype.updateFields = function(scene) {
	//console.log(scene);
	this.objectName.setText(scene.mName);

};



