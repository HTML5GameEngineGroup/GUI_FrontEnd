
function LightTransformContent(tabContentID, style, title) {
	this.lightNameText = null;
	this.lightName = null;
	this.lightXYZ = null;
	this.lightX = null;
	this.lightY = null;
	this.lightZ = null;
	this.lightDirectionText = null;
	this.lightDirX = null;
	this.lightDirY = null;
	this.lightDirZ = null;
	
	this.lightFarText = null;
	this.lightFar = null;
	this.lightNearText = null;
	this.lightNear = null;
	
	this.lightInnerText = null;
	this.lightOuterText = null;
	this.lightInner = null;
	this.lightOuter = null;
	
	this.lightIntensityText = null;
	this.lightIntensity = null;
	
	this.lightDropoffText = null;
	this.lightDropoff = null;
	
	this.lightTypeText = null;
	this.lightType = null;
	
	this.lightOnText = null;
	this.lightOn = null;
	
	this.lightCastShadowText = null;
	this.lightCastShadow = null;
	
	GuiTabContent.call(this, tabContentID, style, title);
}

gGuiBase.View.inheritPrototype(LightTransformContent, GuiTabContent);

LightTransformContent.prototype.initialize = function () {
	
	var textStyle = 'margin-left: 10px; margin-top: 4px';
	var textFieldStyle = 'width: 90%; margin-left: 10px';
	var sliderStyle = 'width: 90%; margin-top: 10px; margin-bottom: 10px; margin-left: 10px';
	
	this.lightNameText = new Text("lightNameText", textStyle, "Name");
	this.lightName = new TextField("lightNameField", textFieldStyle, "Light0");
	this.lightXYZ = new Text("lightXYText", textStyle, "X / Y / Z");
	this.lightX = new TextField("lightXField", textFieldStyle, "20");
	this.lightY = new TextField("lightYField", textFieldStyle, "60");
	this.lightZ = new TextField("lightZField", textFieldStyle, "5");
	
	this.lightDirectionText = new Text("lightDirText", textStyle, "Direction X / Y / Z");
	this.lightDirX = new TextField("lightXDirField", textFieldStyle, "20");
	this.lightDirY = new TextField("lightYDirField", textFieldStyle, "60");
	this.lightDirZ = new TextField("lightZDirField", textFieldStyle, "5");
	
	this.lightFarText = new Text("lightFarText", textStyle, "Far");
	this.lightFar = new TextField("lightFarField", textFieldStyle, "10");
	this.lightNearText = new Text("lightNearText", textStyle, "Near");
	this.lightNear = new TextField("lightNearField", textFieldStyle, "5");
	
	this.lightInnerText = new Text("lightInnerText", textStyle, "Inner");
	this.lightInner = new TextField("lightInnerField", textFieldStyle, "0.1");
	this.lightOuterText = new Text("lightOuterText", textStyle, "Outer");
	this.lightOuter = new TextField("lightOuterField", textFieldStyle, "0.3");
	
	this.lightIntensityText = new Text("lightIntensityText", textStyle, "Intensity");
	this.lightIntensity = new TextField("lightIntensityField", textFieldStyle, "1");
	this.lightDropoffText = new Text("lightDropoffText", textStyle, "Dropoff");
	this.lightDropoff = new TextField("lightDropoffField", textFieldStyle, "1");
	
	this.lightTypeText = new Text("lightTypeText", textStyle, "Type");
	var types = {"Point", "Directional", "Spotlight"};
	this.lightType = new DropDownList("lightTypeDropdown", textFieldStyle, types);
	
	this.lightOnText = new Text("lightOnText", textStyle, "Light on/off");
	//this.lightOn = new Checkbox
	
	this.lightCastShadowText = new Text("lightCastShadowText", textStyle, "Cast shadow");
	
	this.widgetList.push(this.lightNameText);
	this.widgetList.push(this.lightName);
	this.widgetList.push(this.lightXYZ);
	this.widgetList.push(this.lightX);
	this.widgetList.push(this.lightY);
	this.widgetList.push(this.lightZ);
	this.widgetList.push(this.lightDirectionText);
	this.widgetList.push(this.lightDirX);
	this.widgetList.push(this.lightDirY);
	this.widgetList.push(this.lightDirZ);
	this.widgetList.push(this.lightFarText);
	this.widgetList.push(this.lightFar);
	this.widgetList.push(this.lightNearText);
	this.widgetList.push(this.lightNear);
	this.widgetList.push(this.lightInnerText);
	this.widgetList.push(this.lightInner);
	this.widgetList.push(this.lightOuterText);
	this.widgetList.push(this.lightOuter);
	this.widgetList.push(this.lightIntensityText);
	this.widgetList.push(this.lightIntensity);
	this.widgetList.push(this.lightDropoffText);
	this.widgetList.push(this.lightDropoff);
	this.widgetList.push(this.lightTypeText);
	this.widgetList.push(this.lightType);
	this.widgetList.push(this.lightOnText);
	//this.widgetList.push(this.lightOn);
	this.widgetList.push(this.lightCastShadowText);
	//this.widgetList.push(this.lightCastShadow);
	
	
};

LightTransformContent.prototype.initializeEventHandling = function () {
	this.lightName.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightX.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightY.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightZ.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightDirX.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightDirY.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightDirZ.setOnSliderChange(this.onSliderChange);
	this.lightFar.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightNear.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightInner.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightOuter.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightIntensity.setOnFocusOut(this.onTextFieldFocusOut);
	this.lightDropoff.setOnFocusOut(this.onTextFieldFocusOut);
	
};

LightTransformContent.prototype.onTextFieldFocusOut = function(textField) {
	//Can do all the handling for changing game object here
	
	/*var gameObject = gGuiBase.Core.selectedGameObject;
	var value = textField.val();
	var xform = gameObject.getXform();
	
	switch(textField.attr("id")) {
		case "gameObjectNameField":
			var gLastSetName = textField.val();
			
			if (gameObject.mID.includes('[') && gameObject.mID.includes(']')) {
				break;
			}
			if (gLastSetName !== gameObject.mName) { // If the name is new
                if (!gGuiBase.ObjectSupport.checkForNameConflict(gLastSetName)) {
                    // Create a new class with the new name
					//delete window[gameObject.mName];
					
					window[gLastSetName] = function(renderableObj) {
						GameObject.call(this, renderableObj);
					};
                    gEngine.View.inheritPrototype(window[gLastSetName], GameObject);
                    
                    // Re-eval any class code
                    var i;
					var code;
                    var objs = gGuiBase.ObjectSupport.getObjectList();
					var objCode = gGuiBase.ObjectSupport.getObjectCodeList();
                    for (i = 0; i < objs.length; i++) { //Find the old code
                        if (objs[i].mName === gameObject.mName) {
							code = objCode[i];
                            
                        }
                    }
					
					code = gGuiBase.Core.replaceObjectNameInCode(code, gameObject.mName, gLastSetName);
					gGuiBase.ObjectSupport.setGameObjectCodeByID(gameObject.mName, code);
                    eval(code);
					
					var sceneList = gGuiBase.SceneSupport.getSceneList();
					for (var j = 0; j < sceneList.length; j++) {
						
						// First update all instances with the new name and class
						var instances = sceneList[j].getInstanceList();
						for (i = 0; i < instances.length; i++) {
							var name = instances[i].mName;
							if (name === gameObject.mName) {
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
								
								var newID = value + instances[i].mID.substring(instances[i].mID.indexOf('['), instances[i].mID.length);
								gGuiBase.InstanceSupport.replaceInMap(instances[i].mID, newID, value);
					
								instances[i].mName = value;
								instances[i].mID = newID;
								
								
							}
						}
					}
                    
                    // Now update the class itself, where the instances came from
					gGuiBase.ObjectSupport.replaceInMap(gameObject.mName, value);
                    //gameObject.mName = value;
					//gameObject.mID = value;
					
					gGuiBase.Core.updateInstanceSelectList();
					gGuiBase.Core.updateObjectSelectList();
					
					gGuiBase.Core.selectDetailsObject(value);
                    gGuiBase.View.refreshAllTabContent();
					
					//console.log(gGuiBase.ObjectSupport.getObjectList());
					
                    // The user NEEDS to update his/her own code to match the new name, then save it.
                    // That save will add it to the system.
      

                    alert("Remember to update all your code to match the new class name.");
                } else {
                    alert("Names must be unique.");

                }
            }
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
	*/
	
};

LightTransformContent.prototype.updateFields = function( gameObject ) {
	//update these widgets...
	// set name field
	/*this.objectName.setText( gameObject.mID );
	
	// set x form
	var xf = gameObject.getXform();
	this.objectX.setText( xf.getXPos().toFixed(2) );
	this.objectY.setText( xf.getYPos().toFixed(2) );
	// set width and height
	this.objectW.setText( xf.getWidth().toFixed(2) );
	this.objectH.setText( xf.getHeight().toFixed(2) );
	
	this.rotationField.setText(xf.getRotationInDegree().toFixed(2));
	$("#gameObjectRotationSlider").slider("value", xf.getRotationInDegree().toFixed(2));*/
};



