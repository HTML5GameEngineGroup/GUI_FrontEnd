
function ColorTextureContent(tabContentID, style) {
	this.colorText = null;
	this.colorField = null;
	this.textureText = null;
	this.textureDropDown = null;
	
	GuiTabContent.call(this, tabContentID, style);
}

gGuiBase.Core.inheritPrototype(ColorTextureContent, GuiTabContent);

ColorTextureContent.prototype.initialize = function () {
	this.colorText = new Text("colorText", GuiContentWidget.NO_STYLE, "Color");
	this.colorField = new TextField("colorTextField", GuiContentWidget.NO_STYLE, "...");
	this.textureText = new Text("textureText", GuiContentWidget.NO_STYLE, "Texture");
	
	var textureArray = ["1", "2", "3"];
	this.textureDropDown = new DropdownList("textureDropDown", GuiContentWidget.NO_STYLE, textureArray);
	
	this.widgetList.push(this.colorText);
	this.widgetList.push(this.colorField);
	this.widgetList.push(this.textureText);
	this.widgetList.push(this.textureDropDown);
	
};

ColorTextureContent.prototype.initializeEventHandling = function () {
	this.textureDropDown.setOnSelect(onListSelect);
};

var onListSelect = function(value) {
	console.log("Value is" + value);
};

