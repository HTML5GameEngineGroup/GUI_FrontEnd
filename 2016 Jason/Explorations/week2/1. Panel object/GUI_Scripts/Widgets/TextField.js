function TextField(fieldID) {
	GuiContentWidget.call(this, fieldID);
}

gGuiBase.Core.inheritPrototype(TextField, GuiContentWidget);

TextField.prototype.initializeWidget = function () {
	this.setHTML();
};

TextField.prototype.setHTML = function() {
	this.htmlSnippet = '<input id="' + this.widgetID + '" type="text">';
};

TextField.prototype.setOnFocusOut = function (onFocusOutFunction) {
	$(this.getID()).focusout(function() {
		onFocusOutFunction();
	})
};
