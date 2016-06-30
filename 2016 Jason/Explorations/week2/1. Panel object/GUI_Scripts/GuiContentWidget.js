
function GuiContentWidget (widgetID) {
    if (widgetID === undefined || typeof widgetID !==  'string') {
        throw "widgetID must be a string";
    }
    
    this.widgetID = widgetID;
	this.htmlSnippet = "";
	
	this.initializeWidget();
}

GuiContentWidget.prototype.initializeWidget = function () {
	//Do any initialization here, build the widget
};

GuiContentWidget.prototype.getWidgetHTML = function () {
	return this.htmlSnippet;
};

// returns the tab id
GuiContentWidget.prototype.getID = function () {
    return '#' + this.widgetID;
};
