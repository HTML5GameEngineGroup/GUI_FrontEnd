
function Button(buttonID, buttonName) {
	this.buttonName = buttonName;
	GuiContentWidget.call(this, buttonID);
}

gGuiBase.Core.inheritPrototype(Button, GuiContentWidget);

Button.prototype.initializeWidget = function () {
	this.htmlSnippet += '<button id="' + this.widgetID + '">' + this.buttonName + '</button>';
};

Button.prototype.setOnClick = function (onClickFunction) {

	$(this.getID()).button().click(function() {
		onClickFunction();
    });
};
