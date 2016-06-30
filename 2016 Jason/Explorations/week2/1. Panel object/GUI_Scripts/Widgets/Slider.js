function Slider(sliderID) {
	GuiContentWidget.call(this, sliderID);
}

gGuiBase.Core.inheritPrototype(Slider, GuiContentWidget);

Slider.prototype.initializeWidget = function () {
	this.setHTML();
};

Slider.prototype.setHTML = function() {
	this.htmlSnippet = '<div id="' + this.widgetID + '">';
};

Slider.prototype.setOnSliderChange = function (onSliderChangeFunction) {
	$(this.getID()).slider({
		orientation: "horizontal",
		slide: function(event, ui) {
			onSliderChangeFunction(ui.value);
		},
		change:  function(event, ui) {
			onSliderChangeFunction(ui.value);
		}
	});
};
