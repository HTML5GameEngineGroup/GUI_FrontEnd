/**
 * Created by MetaBlue on 6/25/16.
 */

// Tab object that can be added to a GuiPanel
var GuiPanelTab = function (tabID){
    if (tabID === undefined || typeof tabID !==  'string') {
        throw "tabID must be a string";
    }
    // jquery object representing the tab_content
    this.tabID = tabID;                     // stores tabName
    this.content = [];                      // stores the content to place into the tab_content

    // jquery object representing the tab_top
    this.headerID = tabID + 'Header';

    return this;
};

// returns a new jquery tab_header
GuiPanelTab.prototype.createHeader = function () {
    return $('<li id="' + this.headerID + '"><a href="#' + this.tabID + '">' + this.tabID + '</a></li>');
};

// returns a new jquery tab_content
GuiPanelTab.prototype.createContentContainer = function () {
    return $('<div id="' + this.tabID + '">' + this.tabID + " content" + '</div>');
};

// returns the current jquery header_information
GuiPanelTab.prototype.getHeader = function() {
    var $header = $('#' + this.headerID);
    if ($header.length < 1) throw "no header found";
    else return $header;
};

// returns the current jquery content_container
GuiPanelTab.prototype.getContentContainer = function () {
    var $content = $('#' + this.tabID);
    if ($content.length < 1) throw "no content found";
    else return $content;
};

GuiPanelTab.prototype.getContent = function() {
	return this.content;
};

GuiPanelTab.prototype.addContent = function(contentobject) {
	this.content.push(contentobject);
	this.appendContent(contentobject.getID(), contentobject.getHTMLContent());
	contentobject.initializeEventHandling();
};

GuiPanelTab.prototype.refreshContent = function() {

	$(this.getID()).empty();

	for (var i = 0; i < this.content.length; i++) {
		this.appendContent(this.content[i].getID(), this.content[i].getHTMLContent());
		this.content[i].initializeEventHandling();
	}
};

// appends jquery/html to the tab
GuiPanelTab.prototype.appendContent = function ( contentID, contentHTML ) {
    this.content[contentID] = true;
    $('#' + this.tabID).append( contentHTML );
};

// removes content with ID contentID
GuiPanelTab.prototype.removeContent = function ( contentID ) {
    if (!(contentID in this.content)) throw contentID + " not found";
    else {
        delete this.content[contentID];
        $('#' + contentID).remove();
    }
};

// returns the tab id
GuiPanelTab.prototype.getID = function () {
    return '#' + this.tabID;
};