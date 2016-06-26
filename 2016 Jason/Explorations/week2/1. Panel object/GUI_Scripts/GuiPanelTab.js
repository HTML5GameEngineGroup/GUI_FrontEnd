/**
 * Created by MetaBlue on 6/25/16.
 */

// Tab object that can be added to a GuiPanel
var GuiPanelTab = function (tabID){
    if (tabID === undefined || typeof tabID !==  'string') {
        throw "tabID must be a string";
    }
    this.tabID = tabID;                     // stores tabName
    this.content = [];                      // stores the content to place into the tab_content

    // jquery object representing the tab_top
    this.headerID = tabID + 'Header';

    // jquery object representing the tab_content
    this.contentID = tabID + " Content";    // Place holder until real content is put in
    return this;
};

GuiPanelTab.prototype.getHeader = function () {
    return $('<li id="' + this.headerID + '"><a href="#' + this.tabID + '">' + this.tabID + '</a></li>');
};

GuiPanelTab.prototype.getContentContainer = function () {
    return $('<div id="#' + this.contentID + '">' + this.content + '</div>');
};