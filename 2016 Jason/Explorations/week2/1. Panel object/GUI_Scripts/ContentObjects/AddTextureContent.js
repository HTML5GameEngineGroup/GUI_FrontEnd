function AddTextureContent(tabContentID, style, title) {
	this.fileInputButton = null;
	this.imageSelectList = null;
    this.widgetList = null;

    this.selectListID = "texSelectList1";
    GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(AddTextureContent, GuiTabContent);

AddTextureContent.prototype.initialize = function () {
	
	this.fileInputButton = new FileInputButton("TextureInput", GuiTabContent.NO_STYLE, "Add texture");
	this.widgetList.push(this.fileInputButton);
	
	var imageList = gGuiBase.TextureSupport.getImageList();
	this.imageSelectList = new ImageSelectList("TextureSelectList", 'list-style-type: none; margin: 0; padding: 0', imageList, GuiTabContent.NO_STYLE, "width: 33%; height: auto; width: auto; float: left; min-width: 50px; min-height: 50px; max-width: 100px; max-height: 100px;");
	this.widgetList.push(this.imageSelectList);
	
    this.initializeEventHandling();
};

// connects the eventHandlers to their specific methods
AddTextureContent.prototype.initializeEventHandling = function () {
	this.fileInputButton.setOnFileSelect(this.onFileSelect);

    this.imageSelectList.setOnSelect(this.selectObject);

    this.imageSelectList.addListClass("imageListMenu");

    $(this.imageSelectList.getID()).contextmenu({
        delegate: ".imageListMenu",
        menu: [
            {title: "Details", cmd: "details", uiIcon: "ui-icon-info"},
            {title: "Create GameObject", cmd: "create", uiIcon: "ui-icon-arrowthick-1-e"},
            {title: "Delete", cmd: "delete", uiIcon: "ui-icon-closethick"},
        ],
        select: function(event, ui) {

			var imageName = gGuiBase.TextureSupport.getImageName(ui.target[0].currentSrc);
            switch (ui.cmd) {
                case 'details':
                    alert('to be implemented');
                    break;
                case 'create':
                    gGuiBase.TextureSupport.addTextureObject(imageName);
                    break;
                case 'delete':
					gGuiBase.TextureSupport.removeTextureFromAll(imageName);
                    break;
            }
        }
    });
};

// this function handles the left click event on an object in the object tab
// populates the details tab with the object information
AddTextureContent.prototype.selectObject = function( ui ) {
    // get objectName/objectID
    var selectedTextureName = ui["selected"]["id"];
    //gGuiBase.Core.selectDetailsObject( selectedObjectName );
};

AddTextureContent.prototype.onFileSelect = function() {
	gEngine.Textures.loadTextureFromFile("TextureInput", gGuiBase.TextureSupport.addTexture);
	
};


