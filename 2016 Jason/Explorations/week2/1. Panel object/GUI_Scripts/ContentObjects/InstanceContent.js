// contains content file for instance tab
"use strict";
/*-----------------------------------------------------------------------------
 //	Scene content
 //	Extension of GuiTabContent
 //
 //	Author: Jason Herold/Thoof
 -----------------------------------------------------------------------------*/
function InstanceContent(tabContentID, style, title) {
    this.instanceAddButton = null;
    this.instanceSelectList = null;
    this.objInstanceSelecter = null;

    this.selectListID = "instanceSelectList";
    this.objDropdownSelectorID = "instanceDropdown";
    GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(InstanceContent, GuiTabContent);

InstanceContent.prototype.initialize = function () {
    this.dropdownList = gGuiBase.Core.getObjectList();
    this.objInstanceSelecter = new DropdownList(this.objDropdownSelectorID, GuiTabContent.NO_STYLE, ['test1', 'test2', 'test3']);
    this.widgetList.push(this.objInstanceSelecter);
    console.log("after push select list");
    this.instanceAddButton = new Button("instanceAddButton", GuiTabContent.NO_STYLE, "+Instance");
    this.widgetList.push(this.instanceAddButton);

    this.instanceSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', [], 'display: inline; margin: 5px');
    this.widgetList.push(this.instanceSelectList);
};

InstanceContent.prototype.initializeEventHandling = function () {
    this.instanceAddButton.setOnClick(this.buttonOnClick);
    this.instanceSelectList.setOnSelect(this.onListSelect);
};

InstanceContent.prototype.buttonOnClick = function() {
    gGuiBase.Core.addInstance();
};

InstanceContent.prototype.onListSelect = function(ui) {
    // get objectName/objectID
    console.log(ui["selected"]["id"]);
    var selectedInstanceName = ui["selected"]["id"];
    gGuiBase.core.selectInstanceDetails( selectedInstanceName );

    //todo: use this function to populate the details panel
};

InstanceContent.prototype.getDropdownObjectName = function() {
    console.log('int target function get selcted object');
    console.log( $('#' + this.objDropdownSelectorID + ' option').filter(':selected').text() );
    return this.objInstanceSelecter.getSelectedListItem();

};



