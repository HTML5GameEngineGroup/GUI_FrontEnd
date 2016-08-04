function LightObject(light) {
	this.LIGHT_ICON_WIDTH = 5;

	this.iconLoaded = false;
	this.lightRef = light;
	this.lightIcon = null;

	this.drawSelection = true;
	
	var xPos = this.lightRef.mPosition[0];
	var yPos = this.lightRef.mPosition[1];
	var zPos = this.lightRef.mPosition[2];
	
	
	this.radius = Math.sqrt((this.lightRef.mFar * this.lightRef.mFar) - (zPos * zPos));
	this.radiusLine = new LineRenderable(xPos, yPos, (xPos + this.radius), yPos);
	this.radiusLine.setColor([1, 1, 1, 1]);
	
	this.mTopLine = new LineRenderable(xPos - this.radius, yPos + this.radius, xPos + this.radius, yPos + this.radius);
	this.mTopLine.setColor([1, 1, 1, 1]);
	this.mLeftLine = new LineRenderable(xPos - this.radius, yPos - this.radius, xPos - this.radius, yPos + this.radius);
	this.mLeftLine.setColor([1,1,1,1]);
	this.mRightLine = new LineRenderable(xPos + this.radius, yPos - this.radius, xPos + this.radius, yPos + this.radius);
	this.mRightLine.setColor([1,1,1,1]);
	this.mBotLine = new LineRenderable(xPos - this.radius, yPos - this.radius, xPos + this.radius, yPos - this.radius);
	this.mBotLine.setColor([1, 1, 1, 1]);
	
}

LightObject.prototype.initializeIconRenderable = function() {
	this.lightIcon = new TextureRenderable("assets/lighticon.png");
	var xform = this.lightIcon.getXform();
	xform.setXPos(this.lightRef.mPosition[0]);
	xform.setYPos(this.lightRef.mPosition[1]);
	xform.setWidth(5);
	xform.setHeight(5);
};

LightObject.prototype.mouseInIcon = function(mouseX, mouseY) {
	return gGuiBase.DirectManipulationSupport.mouseInBound(mouseX, mouseY, 
		this.lightRef.mPosition[0], this.lightRef.mPosition[1], 5);
};

LightObject.prototype.toggleDrawBorder = function(toggle) {
	this.drawSelection = toggle;
};


LightObject.prototype.draw = function(aCamera) {
	this.radiusLine.draw(aCamera);
	if (this.lightIcon !== null) {
		this.lightIcon.draw(aCamera);
	}
	
	if (this.drawSelection) {
		this.mTopLine.draw(aCamera);
		this.mLeftLine.draw(aCamera);
		this.mRightLine.draw(aCamera);
		this.mBotLine.draw(aCamera);
	}
};

LightObject.prototype.update = function() {
	//For the initial camera drawing, the icon won't be loaded yet so load here
	if (!this.iconLoaded && gEngine.ResourceMap.isAssetLoaded("assets/lighticon.png")) {
		this.initializeIconRenderable();
		this.iconLoaded = true;
	}
	
	var xPos = this.lightRef.mPosition[0];
	var yPos = this.lightRef.mPosition[1];
	var zPos = this.lightRef.mPosition[2];
	
	this.radius = Math.sqrt((this.lightRef.mFar * this.lightRef.mFar) - (zPos * zPos));
	this.radiusLine = new LineRenderable(xPos, yPos, (xPos + this.radius), yPos);
	this.radiusLine.setColor([1, 1, 1, 1]);
	
	if (this.drawSelection) {
		this.mTopLine.setFirstVertex(xPos - this.radius, yPos + this.radius);
		this.mTopLine.setSecondVertex(xPos + this.radius, yPos + this.radius);
		this.mLeftLine.setFirstVertex(xPos - this.radius, yPos - this.radius);
		this.mLeftLine.setSecondVertex(xPos - this.radius, yPos + this.radius);
		this.mRightLine.setFirstVertex(xPos + this.radius, yPos - this.radius);
		this.mRightLine.setSecondVertex(xPos + this.radius, yPos + this.radius);
		this.mBotLine.setFirstVertex(xPos - this.radius, yPos - this.radius);
		this.mBotLine.setSecondVertex(xPos + this.radius, yPos - this.radius);
	}

	if (this.iconLoaded) {
		//this.LIGHT_ICON_WIDTH = this.lightRef.getWCWidth() / 20;
		var xform = this.lightIcon.getXform();
		xform.setXPos(this.lightRef.mPosition[0]);
		xform.setYPos(this.lightRef.mPosition[1]);
		xform.setWidth(this.LIGHT_ICON_WIDTH);
		xform.setHeight(this.LIGHT_ICON_WIDTH);
	}
};