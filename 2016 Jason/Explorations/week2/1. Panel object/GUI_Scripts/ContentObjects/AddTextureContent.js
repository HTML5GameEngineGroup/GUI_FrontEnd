function AddTextureContent(tabContentID, style, title) {
    this.texNameInput = null;
    this.texAddButton = null;
    this.texSelectList = null;
    this.widgetList = null;

    this.selectListID = "texSelectList1";
    GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(AddTextureContent, GuiTabContent);

AddTextureContent.prototype.initialize = function () {
    // var textStyle = 'margin-left: 10px; margin-top: 4px';
    var textFieldStyle = 'width: 90%; margin-left: 10px';
    this.texNameInputID = "texNameInput";
    this.texNameInput = new TextField(this.texNameInputID, textFieldStyle, "");
    this.widgetList.push(this.texNameInput);

    this.texAddButton = new Button("texAddButton", GuiTabContent.NO_STYLE, "+Texture");
    this.widgetList.push(this.texAddButton);

    this.texSelectList = new SelectList(this.selectListID, 'list-style-type: none; margin: 0; padding: 0', []);
    this.widgetList.push(this.texSelectList);
    this.initializeEventHandling();
};

// connects the eventHandlers to their specific methods
AddTextureContent.prototype.initializeEventHandling = function () {
    this.texAddButton.setOnClick(this.buttonOnClick);
    this.texSelectList.setOnSelect(this.selectObject);

    this.texSelectList.addListClass("objectListMenu");

    $(this.texSelectList.getID()).contextmenu({
        delegate: ".objectListMenu",
        menu: [
            {title: "Details", cmd: "details", uiIcon: "ui-icon-info"},
            {title: "Edit code", cmd: "edit", uiIcon: "ui-icon-pencil"},
            {title: "Instantiate to scene", cmd: "instantiate", uiIcon: "ui-icon-arrowthick-1-e"},
            {title: "Delete", cmd: "delete", uiIcon: "ui-icon-closethick"},
        ],
        select: function(event, ui) {
            var GOName = ui.target.text();
            switch (ui.cmd) {
                case 'details':
                    gGuiBase.Core.selectDetailsObject(GOName);
                    break;
                case 'edit':
                    console.log(ui.target.text());
                    gGuiBase.EditorSupport.createFloatingEditor(GOName);
                    break;
                case 'instantiate':
                    gGuiBase.Core.addInstanceWithName(GOName);
                    break;
                case 'delete':
                    if (confirm("Warning: This will delete all instances of " + GOName + ".\n\Delete anyways?")) { // Evalutes to true and perform an action if OK is pressed, otherwise do nothing
                        gGuiBase.ObjectSupport.deleteObject(GOName);
                    }
                    break;
            }
        }
    });
};

// adds a new object when addObject button is left-clicked
AddTextureContent.prototype.buttonOnClick = function() {
    console.log("ADDING THIS TEXTURE IN ON BUTTON CLICK");
    console.log($('#texNameInput').val());
    var texName = $('#texNameInput').val();
    // var texName = "assets/minion_sprite.png";
    gGuiBase.Core.loadTextureObject(texName);
};

// this function handles the left click event on an object in the object tab
// populates the details tab with the object information
AddTextureContent.prototype.selectObject = function( ui ) {
    // get objectName/objectID
    var selectedObjectName = ui["selected"]["id"];
    gGuiBase.Core.selectDetailsObject( selectedObjectName );
};

// these are global
AddTextureContent.prototype.onTextFieldFocusOut = function() {
    alert("focus out");
};


