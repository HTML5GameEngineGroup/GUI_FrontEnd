function AddTextureContent(tabContentID, style, title) {
	this.fileInputButton = null;
    this.texNameInput = null;
    this.texAddButton = null;
    this.texSelectList = null;
    this.widgetList = null;

    this.selectListID = "texSelectList1";
    GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(AddTextureContent, GuiTabContent);

AddTextureContent.prototype.initialize = function () {
	
	this.fileInputButton = new FileInputButton("TextureInput", GuiTabContent.NO_STYLE, "Add texture");
	this.widgetList.push(this.fileInputButton);
	
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
	this.fileInputButton.setOnFileSelect(this.onFileSelect);
    this.texAddButton.setOnClick(this.buttonOnClick);
    this.texSelectList.setOnSelect(this.selectObject);

    this.texSelectList.addListClass("objectListMenu");

    $(this.texSelectList.getID()).contextmenu({
        delegate: ".objectListMenu",
        menu: [
            {title: "Details", cmd: "details", uiIcon: "ui-icon-info"},
            {title: "Create GameObject", cmd: "create", uiIcon: "ui-icon-arrowthick-1-e"},
            {title: "Delete", cmd: "delete", uiIcon: "ui-icon-closethick"},
        ],
        select: function(event, ui) {
            var texName = ui.target.text();
            switch (ui.cmd) {
                case 'details':
                    alert('to be implemented');
                    break;
                case 'create':
                    gGuiBase.TextureSupport.addTextureObject(texName);
                    break;
                case 'delete':
                    alert('to be implemented');
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
    gGuiBase.TextureSupport.addTexture(texName);
	console.log(window);
};

// this function handles the left click event on an object in the object tab
// populates the details tab with the object information
AddTextureContent.prototype.selectObject = function( ui ) {
    // get objectName/objectID
    var selectedTextureName = ui["selected"]["id"];
    //gGuiBase.Core.selectDetailsObject( selectedObjectName );
};

// these are global
AddTextureContent.prototype.onTextFieldFocusOut = function() {
    alert("focus out");
};

AddTextureContent.prototype.onFileSelect = function() {
	gEngine.Textures.loadTextureFromFile("TextureInput", gGuiBase.TextureSupport.addTexture);
	
};


