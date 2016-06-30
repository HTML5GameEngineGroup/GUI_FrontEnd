
function GuiTabContent (tabContentID) {
    if (tabContentID === undefined || typeof tabContentID !==  'string') {
        throw "tabContentID must be a string";
    }
    
    this.tabContentID = tabContentID; 
    this.widgetList = [];
	
	this.initialize();
}

GuiTabContent.prototype.initialize = function () {
	//Do any initialization here
};

GuiTabContent.prototype.initializeEventHandling = function() {
	//Do any event handling here, like adding an onclick to a button
};

GuiTabContent.prototype.getHTMLContent = function () {
	var htmlString = '<div id="' + this.tabContentID + '">';
	for (var i = 0; i < this.widgetList.length; i++) {
		htmlString += this.widgetList[i].getWidgetHTML();
	}
	
	htmlString += '</div>';
	return htmlString;
};

GuiTabContent.prototype.findWidgetByID = function(id) {
	for (var i = 0; i < this.widgetList.length; i++) {
		if (id == this.widgetList[i].getID())
			return this.widgetList[i];
	}
	return null;
};

// returns the tab id
GuiTabContent.prototype.getID = function () {
    return '#' + this.tabContentID;
};