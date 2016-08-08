function LightObject(light) {
	this.lightRef = light;
	this.mSelector = new DragSelector("assets/lighticon.png", light);
	this.drawSelection = false;
	
	var xPos = this.lightRef.mPosition[0];
	var yPos = this.lightRef.mPosition[1];
	var zPos = this.lightRef.mPosition[2];

	this.mInnerRadius = 0;
	this.mOuterRadius = 0;
	
	// this.radius = Math.sqrt((this.lightRef.mFar * this.lightRef.mFar) - (zPos * zPos));
	this.isVerticle = true;
	this.mNearControl = new ControlArm(xPos, yPos, this.lightRef.mNear, this.isVerticle);
	this.mNearControl.setSquareColor([0,1,0,1]);

	this.mFarControl = new ControlArm(xPos, yPos, -this.lightRef.mFar, this.isVerticle); // otherside so wont collide with outer controls
	this.mFarControl.setSquareColor([1,0,1,1]);

	this.mOuterControl = new ControlArm(xPos, yPos, this.mOuterRadius);
	this.mInnerControl = new ControlArm(xPos, yPos, -this.mInnerRadius); // otherside so wont collide with outer controls
	this.mInnerControl.setSquareColor([0,0,1,1]);
}

LightObject.prototype.mouseInIcon = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mSelector.mouseInIcon(mouseX, mouseY);
};

LightObject.prototype.mouseInOuterSquare = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mOuterControl.mouseInControl(mouseX, mouseY);
};

LightObject.prototype.mouseInInnerSquare = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mInnerControl.mouseInControl(mouseX, mouseY);
};


LightObject.prototype.mouseInNearSquare = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mNearControl.mouseInControl(mouseX, mouseY);
};

LightObject.prototype.mouseInFarSquare = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mFarControl.mouseInControl(mouseX, mouseY);
};

LightObject.prototype.toggleDrawBorder = function(toggle) {
	this.drawSelection = toggle;
};

LightObject.prototype.draw = function(aCamera) {
	this.mSelector.draw(aCamera);
	var selectedObj = gGuiBase.DirectManipulationSupport.getSelected();
	if ( selectedObj == this) {
		var xPos = this.lightRef.mPosition[0];
		var yPos = this.lightRef.mPosition[1];

		if (this.lightRef.mLightType === Light.eLightType.eSpotLight) {
			this.mNearControl.draw(aCamera);
			this.mFarControl.draw(aCamera);
		}

		var outerLineBox = new LineBox(xPos, yPos, this.mOuterRadius*2, this.mOuterRadius*2);
		outerLineBox.draw(aCamera);
		this.mOuterControl.draw(aCamera);
		var innerLineBox = new LineBox(xPos, yPos, this.mInnerRadius*2, this.mInnerRadius*2);
		innerLineBox.draw(aCamera);
		this.mInnerControl.draw(aCamera);
	}
};


LightObject.prototype.update = function() {
	//For the initial camera drawing, the icon won't be loaded yet so load here
	var xPos = this.lightRef.mPosition[0];
	var yPos = this.lightRef.mPosition[1];
	if (this.lightRef.mLightType === Light.eLightType.eSpotLight) {
		this.mInnerRadius = this.lightRef.mInner;
		this.mOuterRadius = this.lightRef.mOuter;
	} else if (this.lightRef.mLightType === Light.eLightType.ePointLight) {
		this.mInnerRadius = this.lightRef.mNear;
		this.mOuterRadius = this.lightRef.mFar;
	}
	// this.radius = Math.sqrt((this.lightRef.mFar * this.lightRef.mFar) - (zPos * zPos));

	if (this.drawSelection) {
		this.mFarControl.update(xPos, yPos, this.lightRef.mFar);
		this.mNearControl.update(xPos, yPos, -this.lightRef.mNear);
		this.mOuterControl.update(xPos, yPos, this.mOuterRadius);
		this.mInnerControl.update(xPos, yPos, -this.mInnerRadius);
	}
	this.mSelector.update();
};