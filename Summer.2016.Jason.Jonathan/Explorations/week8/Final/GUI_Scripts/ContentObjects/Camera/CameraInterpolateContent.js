
function CameraInterpolateContent(tabContentID, style, title) {
    this.layerLabel = null;
    this.viewportW = null;
    this.viewportH = null;
    GuiTabContent.call(this, tabContentID, style, title);
}
gGuiBase.View.inheritPrototype(CameraInterpolateContent, GuiTabContent);

// set initial values to default values of camera
CameraInterpolateContent.prototype.initialize = function () {
    var textStyle = 'margin-left: 10px; margin-top: 4px';
    var textFieldStyle = 'width: 90%; margin-left: 10px';
    this.stiffnessLabel = new Text("stiffnessLabel", textStyle, "Stiffness");
    this.viewportW = new TextField("stiffField", textFieldStyle, "640");
    this.durationLabel = new Text("durationLabel", textStyle, "Duration");
    this.viewportH = new TextField("durationField", textFieldStyle, "480");
    this.widgetList.push(this.stiffnessLabel);
    this.widgetList.push(this.viewportW);
    this.widgetList.push(this.durationLabel);
    this.widgetList.push(this.viewportH);
};

// initialize text fields
CameraInterpolateContent.prototype.initializeEventHandling = function () {
    this.viewportW.setOnFocusOut(this.onTextFieldFocusOut);
    this.viewportH.setOnFocusOut(this.onTextFieldFocusOut);
};

// set camera to settings on focus out
CameraInterpolateContent.prototype.onTextFieldFocusOut = function(textField) {
    var value = textField.val();
    var stiffness = $('#stiffField').val();
    var duration = $('#durationField').val();
    console.log('stiffness:', stiffness, 'duration:', duration);
    var camera = gGuiBase.Core.selectedCamera;
    camera.configInterpolation(stiffness, duration);
};

// sets transforms fields to the selected cameras
CameraInterpolateContent.prototype.updateFields = function( camera ) {
    var cam = gGuiBase.Core.selectedCamera;
    if (cam == null || cam == undefined) return;
    console.log(cam.getInterpolateConfig());
    var interpolateVals = cam.getInterpolateConfig();
    this.viewportW.setText(interpolateVals[0]);
    this.viewportH.setText(interpolateVals[1]);
};

// sets the selected camera's layer to this contents new layer setting
CameraInterpolateContent.prototype.onLayerSelect = function (layer) {
    layer = Number(layer);
    var cam = gGuiBase.Core.selectedCamera;
    gGuiBase.SceneSupport.gCurrentScene.setCameraLayer(cam, layer);
};

// updates the layer selector to the currently selected camera's layer
CameraInterpolateContent.prototype.setLayerDropDown = function (cam ) {
    if (cam) {
        $('#layerDropDown').val(cam.mLayer);
    }
};