/*-----------------------------------------------------------------------------
//	Button widget extending GuiContentWidget
//	Author: Jason Herold/Thoof
-----------------------------------------------------------------------------*/
function Checkbox(boxID, style) {
	GuiContentWidget.call(this, boxID, style);
}

gGuiBase.View.inheritPrototype(Checkbox, GuiContentWidget);

Checkbox.prototype.initializeWidget = function () {
	if (this.style !== GuiContentWidget.NO_STYLE) {
		this.htmlSnippet += '<input id="' + this.widgetID + '" ' + this.style + 'type="checkbox"/>';
	} else {
		this.htmlSnippet += '<input id="' + this.widgetID + ' type="checkbox"/>';
	}

};


Checkbox.prototype.setOnChecked = function (onCheck) {
	var cbox = $(this.getID());
	$(cbox).on('click', function() {
		if(cbox.is(':checked')) {
			onCheck(true);
		} else {
			onCheck(false);
		}
    });
};
