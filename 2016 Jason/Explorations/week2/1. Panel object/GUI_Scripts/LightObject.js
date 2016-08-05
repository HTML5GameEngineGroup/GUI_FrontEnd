function LightObject(light) {

	this.lightRef = light;
	this.mSelector = new DragSelector("assets/lighticon.png", light);
	this.drawSelection = false;
	
	var xPos = this.lightRef.mPosition[0];
	var yPos = this.lightRef.mPosition[1];
	var zPos = this.lightRef.mPosition[2];
	
	this.radius = Math.sqrt((this.lightRef.mFar * this.lightRef.mFar) - (zPos * zPos));
	this.mOuterControl = new ControlArm(xPos, yPos, this.radius);
}

LightObject.prototype.mouseInIcon = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mSelector.mouseInIcon(mouseX, mouseY);
};

LightObject.prototype.mouseInResizeSquare = function(mouseX, mouseY) {
	if (this.lightRef.mLightType === Light.eLightType.eDirectionalLight) return false;
	return this.mOuterControl.mouseInResizeSquare(mouseX, mouseY);
};

LightObject.prototype.toggleDrawBorder = function(toggle) {
	this.drawSelection = toggle;
};


LightObject.prototype.draw = function(aCamera) {
	this.mSelector.draw(aCamera);
	
	if (this.drawSelection) {
		var xPos = this.lightRef.mPosition[0];
		var yPos = this.lightRef.mPosition[1];
		var lineBox = new LineBox(xPos, yPos, this.radius*2, this.radius*2);
		lineBox.draw(aCamera);
		this.mOuterControl.draw(aCamera);
	}
};

LightObject.prototype.update = function() {
	//For the initial camera drawing, the icon won't be loaded yet so load here

	var xPos = this.lightRef.mPosition[0];
	var yPos = this.lightRef.mPosition[1];
	var zPos = this.lightRef.mPosition[2];
	this.radius = Math.sqrt((this.lightRef.mFar * this.lightRef.mFar) - (zPos * zPos));

	if (this.drawSelection) {
		this.mOuterControl.update(xPos, yPos, this.radius);
	}

	this.mSelector.update();
};