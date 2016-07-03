
function SelectList(listID, list) {
	this.list = list;
	GuiContentWidget.call(this, listID);
}

gGuiBase.Core.inheritPrototype(SelectList, GuiContentWidget);

SelectList.prototype.initializeWidget = function () {
	this.setHTML();
};

SelectList.prototype.setHTML = function() {
	this.htmlSnippet = '<ul id="' + this.widgetID + '" style="list-style-type: none; margin: 0; padding: 0">';
	
	for (var i = 0; i < this.list.length; i++) {
		this.htmlSnippet += '<li id="' + this.list[i] + '">' + this.list[i] + '</li>';
	}
	
	this.htmlSnippet += '</ul>';
};

SelectList.prototype.addElement = function(listElement) {
	this.list.push(listElement);
	this.setHTML();
};

SelectList.prototype.setOnSelect = function (onSelectFunction) {
	$(this.getID()).selectable({
		
		selecting: function(event, ui){
            if( $(".ui-selected, .ui-selecting").length > 1){
                  $(ui.selecting).removeClass("ui-selecting");
            }
		},
		
		selected: function(event, ui) {
			//Get the selected item
			onSelectFunction(event, ui, this);
		}
	});
};
