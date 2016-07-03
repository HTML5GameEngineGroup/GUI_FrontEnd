function DropdownList(listID, list) {
	this.list = list;
	GuiContentWidget.call(this, listID);
}

gGuiBase.Core.inheritPrototype(DropdownList, GuiContentWidget);

DropdownList.prototype.initializeWidget = function () {
	this.setHTML();
};

DropdownList.prototype.setHTML = function() {
	this.htmlSnippet = '<select id="' + this.widgetID + '">';
	
	for (var i = 0; i < this.list.length; i++) {
		this.htmlSnippet += '<option id="' + this.list[i] + '">' + this.list[i] + '</option>';
	}
	
	this.htmlSnippet += '</ul>';
};

DropdownList.prototype.addElement = function(listElement) {
	this.list.push(listElement);
	this.setHTML();
};

DropdownList.prototype.setOnSelect = function (onSelectFunction) {
	$(this.getID()).change(function() {
		onSelectFunction($(this).val());
	});
};
