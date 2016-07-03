function TextField(fieldID, defaultText, optionalFrontText) {
	this.defaultText = defaultText;
	this.optionalFrontText = optionalFrontText;
	
	if (this.defaultText == undefined) this.defaultText = "";
	if (this.optionalFrontText == undefined) this.optionalFrontText = "";
	
	GuiContentWidget.call(this, fieldID);
}

gGuiBase.Core.inheritPrototype(TextField, GuiContentWidget);

TextField.prototype.initializeWidget = function () {
	this.setHTML();
};

TextField.prototype.setHTML = function() {
	this.htmlSnippet = this.optionalFrontText + '<input id="' + this.widgetID + '" type="text" value="' + this.defaultText + '">';
};

TextField.prototype.setOnFocusOut = function (onFocusOutFunction) {
	$(this.getID()).focusout(function() {
		onFocusOutFunction();
	})
};
