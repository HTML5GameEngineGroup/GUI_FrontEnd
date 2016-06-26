/**
 * Created by MetaBlue on 6/25/16.
 */

// Tab object that can be added to a GuiPanel
var GuiPanelTab = function (tabID){
    if (tabID === undefined || typeof tabID !==  'string') {
        throw "tabID must be a string";
    }
    this.tabID = tabID;

    this.$top = null;                   // jquery object representing the tab_top
    this.$top = $('<li><a href="#' + tabID + '">' + tabID + '</a></li>');

    this.content = null;                // stores the content to place into the tab_content
    this.content = tabID + " content";  // Place holder until real content is put in

    this.$content_container = null;     // jquery object representing the tab_content
    this.$content_container = $('<div id="' + tabID + '">' + this.content + '</div>');

    return this;
};

// sets the ID of the tab and modifies any relevant
GuiPanelTab.prototype.setID = function( newTabID ) {
    //todo: NOT CURRENTLY WORKING
    alert("tabid = " + this.tabID);
    // create tab_top

    alert($('a[href="#' + this.tabID + '"]').prop('href'));
    $('a[href="#' + this.tabID + '"]').prop('href', '#' + newTabID);

    this.tabID = newTabID;
    alert(this.tabID);
};

GuiPanelTab.prototype.getTabTop = function () {
    
};