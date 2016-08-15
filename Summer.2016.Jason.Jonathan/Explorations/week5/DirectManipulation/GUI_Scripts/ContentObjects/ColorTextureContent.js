
function ColorTextureContent(tabContentID, style, title) {
	this.colorText = null;
	this.colorField = null;
	this.textureText = null;
	this.textureDropDown = null;
	this.textureButton = null;
	this.textureSelectDialog = null;

	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(ColorTextureContent, GuiTabContent);

ColorTextureContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 5%; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	
	this.colorText = new Text("colorText", textStyle, "Color");
	this.colorField = new TextField("colorTextField", textFieldStyle, "...");
	this.textureText = new Text("textureText", textStyle, "Texture");
	
	var textureNames = gGuiBase.TextureSupport.getTexList();
	textureNames.unshift("None");
	this.textureDropDown = new DropdownList("textureDropDown", textFieldStyle, textureNames);
	
	this.textureButton = new Button("textureButton", GuiTabContent.NO_STYLE, "Select texture");
	this.widgetList.push(this.colorText);
	this.widgetList.push(this.colorField);
	this.widgetList.push(this.textureText);
	this.widgetList.push(this.textureDropDown);
	this.widgetList.push(this.textureButton);
	// if (gGuiBase.Core.selectedGameObject) this.setDropdownToSelectedGO();
};

ColorTextureContent.prototype.initializeEventHandling = function () {
	this.textureDropDown.setOnSelect(this.onListSelect);
	$('#colorTextField').colorpicker({format:'rgba'});
	this.colorField.setOnFocusOut(this.onFocusOut);
	
	var gameObject = gGuiBase.Core.selectedGameObject;
	var oldColor = gameObject.getRenderable().getColor();
	var newColor = [oldColor[0] * 255, oldColor[1] * 255, oldColor[2] * 255, oldColor[3]];
	$(this.colorField.getID()).val("rgba(" + newColor + ")");
	
	this.textureButton.setOnClick(this.onButtonClick);
	
};

ColorTextureContent.prototype.onFocusOut = function(textField) {
	var gameObject = gGuiBase.Core.selectedGameObject;
	var value = textField.val();
	
	var enteredColor = gGuiBase.View.colorStringToRGBA(value);
	var renderable = gameObject.getRenderable();
	renderable.setColor(enteredColor);
};

ColorTextureContent.prototype.onButtonClick = function() {
	var textureSelectDialog = new TextureSelectDialog("TextureSelectDialog", GuiTabContent.NO_STYLE);
	gGuiBase.View.findTabContentByID("#ColorTextureContent").widgetList.push(textureSelectDialog);

	gGuiBase.View.refreshAllTabContent();
	
	textureSelectDialog.initializeEventHandling();
	
	textureSelectDialog.setOnClose(gGuiBase.View.findTabContentByID("#ColorTextureContent").onDialogClose);
};

ColorTextureContent.prototype.onListSelect = function(value) {
	var gameObjectName = gGuiBase.Core.selectedGameObject.mName;
	var colorTextureContent = gGuiBase.View.findTabContentByID("#ColorTextureContent");
	var textureName = colorTextureContent.getDropdownTexName();
	console.log("selecting this texture:", textureName);
	if (textureName == "None") {
		gGuiBase.TextureSupport.removeTextureFromGameObject(gameObjectName);
	} else {
		gGuiBase.TextureSupport.addTextureToGameObject(gameObjectName, textureName);
	}
};

ColorTextureContent.prototype.onDialogClose = function() {
	
	var widgetList = gGuiBase.View.findTabContentByID("#ColorTextureContent").widgetList;
	var index;
	//Remove the dialog
	for (index = 0; index < widgetList.length; index++) {
		if (widgetList[index].widgetID === "TextureSelectDialog")
			break;
	}
	
	widgetList.splice(index, 1);

	gGuiBase.View.refreshAllTabContent();
	$(this).dialog('destroy').remove();
	gGuiBase.DirectManipulationSupport.setPreventInteraction(false);
	
	
};

ColorTextureContent.prototype.getDropdownTexName = function() {
	return this.textureDropDown.getSelectedListItem();
};

ColorTextureContent.prototype.setDropdownToSelectedGO = function() {
	var renderable = gGuiBase.Core.selectedGameObject.getRenderable();
	// console.log(selectedGameObject);
	// console.log("isntance of:", selectedGameObject.getRenderable() instanceof TextureRenderable);
	//console.log('instance of:', renderable instanceof TextureRenderable);
	// var texture = gGuiBase.Core.selectedGameObject.getRenderable().getTexture();
	//console.log(renderable);
	if (renderable instanceof TextureRenderable) {
		var texName = renderable.getTexture();
		console.log('texName:', texName);
		$('#textureDropDown').val(texName);
	} else {
		$('#textureDropDown').val("None");
	}
};
