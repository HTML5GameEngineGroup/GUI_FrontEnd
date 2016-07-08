
function TransformContent(tabContentID, style, title) {
	this.isGameObjectCheck = null;
	this.objectNameText = null;
	this.objectName = null;
	this.objectXY = null;
	this.objectX = null;
	this.objectY = null;
	this.objectWH = null;
	this.objectW = null;
	this.objectH = null;
	this.rotationText = null;
	this.rotationField = null;
	this.rotationSlider = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(TransformContent, GuiTabContent);

TransformContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 10px; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	var sliderStyle = 'width: 90%; margin-top: 10px; margin-bottom: 10px; margin-left: 10px';
	
	this.objectNameText = new Text("gameObjectNameText", textStyle, "Name");
	this.objectName = new TextField("gameObjectNameField", textFieldStyle, "GameObj0");
	this.objectXY = new Text("gameObjectXYText", textStyle, "X / Y");
	this.objectX = new TextField("gameObjectXField", textFieldStyle, "20");
	this.objectY = new TextField("gameObjectYField", textFieldStyle, "60");
	
	this.objectWH = new Text("gameObjectWHText", textStyle, "W / H");
	this.objectW = new TextField("gameObjectWField", textFieldStyle, "5");
	this.objectH = new TextField("gameObjectHField", textFieldStyle, "5");
	
	this.rotationText = new Text("gameObjectRotationText", textStyle, "Rotation");
	this.rotationField = new TextField("gameObjectRotationField", textFieldStyle, "0");
	this.rotationSlider = new Slider("gameObjectRotationSlider", sliderStyle, 360);
	
	this.widgetList.push(this.objectNameText);
	this.widgetList.push(this.objectName);
	this.widgetList.push(this.objectXY);
	this.widgetList.push(this.objectX);
	this.widgetList.push(this.objectY);
	this.widgetList.push(this.objectWH);
	this.widgetList.push(this.objectW);
	this.widgetList.push(this.objectH);
	this.widgetList.push(this.rotationText);
	this.widgetList.push(this.rotationField);
	this.widgetList.push(this.rotationSlider);
	
};

TransformContent.prototype.initializeEventHandling = function () {
	this.objectName.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectX.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectY.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectW.setOnFocusOut(this.onTextFieldFocusOut);
	this.objectH.setOnFocusOut(this.onTextFieldFocusOut);
	this.rotationField.setOnFocusOut(this.onTextFieldFocusOut);
	
	this.rotationSlider.setOnSliderChange(this.onSliderChange);
};

TransformContent.prototype.onTextFieldFocusOut = function(textField) {
	//Can do all the handling for changing game object here
	
	var gameObject = gGuiBase.Core.selectedGameObject;
	var value = textField.val();
	var xform = gameObject.getXform();
	
	switch(textField.attr("id")) {
		case "gameObjectNameField":
			/*var gLastSetName = textField.val();
			
			if (gLastSetName !== gameObject.mName) { // If the name is new
                if (!gGameCore.checkForNameConflict(gLastSetName)) {
                    // Create a new class with the new name
                    
					window[gLastSetName] = function(renderableObj) {
						GameObject.call(this, renderableObj);
					};
                    gEngine.Core.inheritPrototype(window[gLastSetName], GameObject);
                    
                    // Re-eval any class code
                    var i;
                    var objs = gGuiBase.Core.getObjectList();
                    for (i = 0; i < objs.length; i++) {
                        if (objs[i][0].mName === selected[0].mName) {
                            eval(objs[i][1]);
                        }
                    }
                    
                    // First update all instances with the new name and class
                    var instances = gGameCore.getInstanceList();
                    for (i = 0; i < instances.length; i++) {
                        if (instances[i].mName === selected[0].mName) {
                            // Each instance needs to be re-created exactly as the old one, but as a new class
                            // They also need their name value modified
                            var rend = instances[i].getRenderable();
                            var xf = instances[i].getXform();
                            var newInstance;
                            eval("newInstance = new " + gLastSetName + "(rend);");
                            newInstance.mID = instances[i].mID;
                            var newXf = newInstance.getXform();
                            newXf = xf;
                            instances[i] = newInstance;
                            instances[i].mName = $(this).val();
                        }
                    }
                    if ($('#panelBottomInstances').hasClass('current-tab')) {
                        createPanelBottomInstances(); // Refresh only if open currently
                    }
                    
                    // Now update the class itself, where the instances came from
                    selected[0].mName = $(this).val();
                    
                    // Don't do anything with the code!  It isn't even updated yet.
                    // The user NEEDS to update his/her own code to match the new name, then save it.
                    // That save will add it to the system.
                    
                    // Update the bottom
                    if ($('#panelBottomInstances').hasClass('current-tab')) {
                        createPanelBottomInstancesSelect(selected[0].mName);
                    }
                    
                    // Update the left panel
                    createPanelLeftObjects();
                    changeCurrentListItem(selected[0].mID);
                    
                    alert("Remember to update all your code to match the new class name.");
                } else {
                    alert("Names must be unique.");
                    // Revert the name
                    cleanUpPanelRightBody();
                    if (!gRunning) {
                        // No need to update the current list item color
                        createDetailsObjects(selected[2]);
                    }
                    gLastSetName = selected[0].mName;
                }
            }*/
		
		
		
			break;
		case "gameObjectXField":
			xform.setXPos(value);
			break;
		case "gameObjectYField":
			xform.setYPos(value);
			break;
		case "gameObjectWField":
			xform.setWidth(value);
			break;
		case "gameObjectHField":
			xform.setHeight(value);
			break;
		case "gameObjectRotationField":
			xform.setRotationInDegree(value);
			$("#gameObjectRotationSlider").slider( "value", value);
			
			break;
		default:
			break;
	}
	
	
};

TransformContent.prototype.onSliderChange = function(sliderValue) {
	var gameObject = gGuiBase.Core.selectedGameObject;
	var xform = gameObject.getXform();
	
	xform.setRotationInDegree(sliderValue);
	//var rotationField = gGuiBase.View.findWidgetByID("#gameObjectRotationField");
	$("#gameObjectRotationField").attr("value", sliderValue);
	
};

TransformContent.prototype.updateFields = function( gameObject ) {
	//update these widgets...
	// set name field
	this.objectName.setText( gameObject.mID );
	
	// set x form
	var xf = gameObject.getXform();
	this.objectX.setText( xf.getXPos() );
	this.objectY.setText( xf.getYPos() );
	// set width and height
	this.objectW.setText( xf.getWidth() );
	this.objectH.setText( xf.getHeight() );
	
	this.rotationField.setText(xf.getRotationInDegree());
	$("#gameObjectRotationSlider").slider("value", xf.getRotationInDegree());
};



