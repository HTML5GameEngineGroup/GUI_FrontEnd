function LightObject(light) {
	this.LIGHT_ICON_WIDTH = 5;

	this.iconLoaded = false;
	this.lightRef = light;

	this.lightIcon = null;

}

LightObject.prototype.initializeIconRenderable = function() {
	this.lightIcon = new TextureRenderable("assets/lighticon.png");
	var xform = this.lightIcon.getXform();
	xform.setXPos(this.lightRef.mPosition[0]);
	xform.setYPos(this.lightRef.mPosition[1]);
	xform.setWidth(5);
	xform.setHeight(5);
};


LightObject.prototype.draw = function(aCamera) {

	if (this.lightIcon !== null) {
		this.lightIcon.draw(aCamera);
	}
};

LightObject.prototype.update = function() {
	//For the initial camera drawing, the icon won't be loaded yet so load here
	if (!this.iconLoaded && gEngine.ResourceMap.isAssetLoaded("assets/lighticon.png")) {
		this.initializeIconRenderable();
		this.iconLoaded = true;
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