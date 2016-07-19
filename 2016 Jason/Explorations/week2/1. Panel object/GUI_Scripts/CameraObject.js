function CameraObject(camera) {
	this.cameraRef = camera;
	this.leftX = this.cameraRef.getWCCenter()[0] - this.cameraRef.getWCWidth() / 2;
	this.rightX = this.cameraRef.getWCCenter()[0] + this.cameraRef.getWCWidth() / 2;
	
	this.topY = this.cameraRef.getWCCenter()[1] - this.cameraRef.getWCHeight() / 2;
	this.botY = this.cameraRef.getWCCenter()[1] + this.cameraRef.getWCHeight() / 2;
	
	this.mTopLine = new LineRenderable(this.leftX, this.topY, this.rightX, this.topY);
	this.mTopLine.setColor([1, 1, 1, 1]);
	this.mLeftLine = new LineRenderable(this.leftX, this.topY, this.leftX, this.botY);
	this.mLeftLine.setColor([1,1,1,1]);
	this.mRightLine = new LineRenderable(this.rightX, this.topY, this.rightX, this.botY);
	this.mRightLine.setColor([1,1,1,1]);
	this.mBotLine = new LineRenderable(this.leftX, this.botY, this.rightX, this.botY);
	this.mBotLine.setColor([1, 1, 1, 1]);
	
	/*var camera = gGuiBase.SceneSupport.gCurrentScene.getSceneCamera();
	var camW = camera.getWCWidth();
	this.boxSize = camW / 50 * 0.5;*/
	
}

CameraObject.prototype.draw = function(aCamera) {
	this.mTopLine.draw(aCamera);
	this.mBotLine.draw(aCamera);
	this.mLeftLine.draw(aCamera);
	this.mRightLine.draw(aCamera);
};

CameraObject.prototype.update = function() {
	this.leftX = this.cameraRef.getWCCenter()[0] - this.cameraRef.getWCWidth() / 2;
	this.rightX = this.cameraRef.getWCCenter()[0] + this.cameraRef.getWCWidth() / 2;
	
	this.topY = this.cameraRef.getWCCenter()[1] - this.cameraRef.getWCHeight() / 2;
	this.botY = this.cameraRef.getWCCenter()[1] + this.cameraRef.getWCHeight() / 2;
	
	if (this.mTopLine.mShader === null) {
		//Workaround to make sure we remake the object with the loaded shader
		this.mTopLine = new LineRenderable(this.leftX, this.topY, this.rightX, this.topY);
		this.mTopLine.setColor([1, 1, 1, 1]);
		this.mLeftLine = new LineRenderable(this.leftX, this.topY, this.leftX, this.botY);
		this.mLeftLine.setColor([1,1,1,1]);
		this.mRightLine = new LineRenderable(this.rightX, this.topY, this.rightX, this.botY);
		this.mRightLine.setColor([1,1,1,1]);
		this.mBotLine = new LineRenderable(this.leftX, this.botY, this.rightX, this.botY);
		this.mBotLine.setColor([1, 1, 1, 1]);
	} else {
		//Don't remake the object, just change the values (Shader is loaded)
		this.mTopLine.setFirstVertex(this.leftX, this.topY);
		this.mTopLine.setSecondVertex(this.rightX, this.topY);

		this.mLeftLine.setFirstVertex(this.leftX, this.topY);
		this.mLeftLine.setSecondVertex(this.leftX, this.botY);
		
		this.mRightLine.setFirstVertex(this.rightX, this.topY);
		this.mRightLine.setSecondVertex(this.rightX, this.botY);
		
		this.mBotLine.setFirstVertex(this.leftX, this.botY);
		this.mBotLine.setSecondVertex(this.rightX, this.botY);
	}
	
	
};