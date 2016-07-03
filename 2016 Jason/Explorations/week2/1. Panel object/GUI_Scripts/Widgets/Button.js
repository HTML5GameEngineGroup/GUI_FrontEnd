
function Button(buttonID, style, buttonName) {
	this.buttonName = buttonName;

	GuiContentWidget.call(this, buttonID, style);
}

gGuiBase.Core.inheritPrototype(Button, GuiContentWidget);

Button.prototype.initializeWidget = function () {
	if (this.style !== GuiContentWidget.NO_STYLE) {
		this.htmlSnippet += '<button id="' + this.widgetID + '" ' + this.style + '>' + this.buttonName + '</button>';
	} else {
		this.htmlSnippet += '<button id="' + this.widgetID + '">' + this.buttonName + '</button>';
	}

};

Button.prototype.setOnClick = function (onClickFunction) {

	$(this.getID()).button().click(function() {
		onClickFunction();
    });
};
