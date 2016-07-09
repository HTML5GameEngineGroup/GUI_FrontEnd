
function ColorTextureContent(tabContentID, style, title) {
	this.colorText = null;
	this.colorField = null;
	this.textureText = null;
	this.textureDropDown = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(ColorTextureContent, GuiTabContent);

ColorTextureContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 5%; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	
	this.colorText = new Text("colorText", textStyle, "Color");
	this.colorField = new TextField("colorTextField", textFieldStyle, "...");
	this.textureText = new Text("textureText", textStyle, "Texture");
	
	var textureArray = ["1", "2", "3"];
	this.textureDropDown = new DropdownList("textureDropDown", textFieldStyle, textureArray);
	
	
	
	this.widgetList.push(this.colorText);
	this.widgetList.push(this.colorField);
	this.widgetList.push(this.textureText);
	this.widgetList.push(this.textureDropDown);
};

ColorTextureContent.prototype.initializeEventHandling = function () {
	this.textureDropDown.setOnSelect(this.onListSelect);
	$('#colorTextField').colorpicker({format:'rgba'});
	this.colorField.setOnFocusOut(this.onFocusOut);
	
	var gameObject = gGuiBase.Core.selectedGameObject;
	var oldColor = gameObject.getRenderable().getColor();
	var newColor = [oldColor[0] * 255, oldColor[1] * 255, oldColor[2] * 255, oldColor[3]];
	$(this.colorField.getID()).val("rgba(" + newColor + ")");
	
};

ColorTextureContent.prototype.onFocusOut = function(textField) {
	var gameObject = gGuiBase.Core.selectedGameObject;
	var value = textField.val();
	
	var enteredColor = gGuiBase.View.colorStringToRGBA(value);
	var renderable = gameObject.getRenderable();
	renderable.setColor(enteredColor);
};

ColorTextureContent.prototype.onListSelect = function(value) {
	console.log("Value is" + value);
};



