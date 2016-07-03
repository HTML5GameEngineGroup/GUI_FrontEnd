function Text(fieldID, defaultText) {
	this.defaultText = defaultText;

	GuiContentWidget.call(this, fieldID);
}

gGuiBase.Core.inheritPrototype(Text, GuiContentWidget);

Text.prototype.initializeWidget = function () {
	this.setHTML();
};

Text.prototype.setHTML = function() {
	this.htmlSnippet = '<p>' + this.defaultText + '</p>';
};
