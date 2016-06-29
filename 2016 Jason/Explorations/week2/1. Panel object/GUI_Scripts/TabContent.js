
// Tab object that can be added to a GuiPanel
var TabContent = function (tabContentID){
    if (tabContentID === undefined || typeof tabContentID !==  'string') {
        throw "tabID must be a string";
    }
    
    this.tabContentID = tabContentID;                     // stores tabName
    
	
    return this;
};

TabContent.prototype.initialize = function () {
	//Do any initialization here
};

// returns the tab id
TabContent.prototype.getID = function () {
    return '#' + this.tabID;
};