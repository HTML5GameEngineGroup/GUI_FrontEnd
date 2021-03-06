
function SelectionObject(x, y, w, h) {
	var camera = gGuiBase.SceneSupport.gCurrentScene.getSceneCamera();
	var camW = camera.getWCWidth();
	var boxSize = camW / 50 * 0.5;
	
	this.mTopLine = new LineRenderable((x-w/2), (y+h/2), (x+w/2), (y+h/2));
	this.mTopLine.setColor([1, 1, 1, 1]);
	this.mLeftLine = new LineRenderable((x-w/2), (y+h/2), (x-w/2), (y-h/2));
	this.mLeftLine.setColor([1,1,1,1]);
	this.mRightLine = new LineRenderable((x+w/2), (y+h/2), (x+w/2), (y-h/2));
	this.mRightLine.setColor([1,1,1,1]);
	this.mBotLine = new LineRenderable((x-w/2), (y-h/2), (x+w/2), (y-h/2));
	this.mBotLine.setColor([1, 1, 1, 1]);
	
	this.mTL = new Renderable();
	this.mTL.setColor([0, 0, 1, 1]);
	var xform = this.mTL.getXform();
	xform.setXPos((x-w/2) + boxSize/2);
	xform.setYPos((y+h/2) - boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
	
	this.mBL = new Renderable();
	this.mBL.setColor([0, 0, 1, 1]);
	var xform = this.mBL.getXform();
	xform.setXPos((x-w/2) + boxSize/2);
	xform.setYPos((y-h/2) + boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
	
	this.mTR = new Renderable();
	this.mTR.setColor([0, 0, 1, 1]);
	var xform = this.mTR.getXform();
	xform.setXPos((x+w/2) - boxSize/2);
	xform.setYPos((y+h/2) - boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
	
	this.mBR = new Renderable();
	this.mBR.setColor([0, 0, 1, 1]);
	var xform = this.mBR.getXform();
	xform.setXPos((x+w/2) - boxSize/2);
	xform.setYPos((y-h/2) + boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
	
	
}

SelectionObject.prototype.draw = function(aCamera) {
	this.mTopLine.draw(aCamera);
	this.mBotLine.draw(aCamera);
	this.mLeftLine.draw(aCamera);
	this.mRightLine.draw(aCamera);
	
	this.mTL.draw(aCamera);
	this.mBL.draw(aCamera);
	this.mTR.draw(aCamera);
	this.mBR.draw(aCamera);
};

SelectionObject.prototype.update = function() {
	var xform = gGuiBase.Core.selectedGameObject.getXform();
	var x = xform.getXPos();
	var y = xform.getYPos();
	var w = xform.getWidth();
	var h = xform.getHeight();
	
	var camera = gGuiBase.SceneSupport.gCurrentScene.getSceneCamera();
	var camW = camera.getWCWidth();
	var boxSize = camW / 50 * 0.5;
	
	this.mTopLine.setFirstVertex((x-w/2), (y+h/2));
	this.mTopLine.setSecondVertex((x+w/2), (y+h/2));

	this.mLeftLine.setFirstVertex((x-w/2), (y+h/2));
	this.mLeftLine.setSecondVertex((x-w/2), (y-h/2));
	
	this.mRightLine.setFirstVertex((x+w/2), (y+h/2));
	this.mRightLine.setSecondVertex((x+w/2), (y-h/2));
	
	this.mBotLine.setFirstVertex((x-w/2), (y-h/2));
	this.mBotLine.setSecondVertex((x+w/2), (y-h/2));
	
	var xform = this.mTL.getXform();
	xform.setXPos((x-w/2) + boxSize/2);
	xform.setYPos((y+h/2) - boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
	
	var xform = this.mBL.getXform();
	xform.setXPos((x-w/2) + boxSize/2);
	xform.setYPos((y-h/2) + boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
	
	var xform = this.mTR.getXform();
	xform.setXPos((x+w/2) - boxSize/2);
	xform.setYPos((y+h/2) - boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);

	var xform = this.mBR.getXform();
	xform.setXPos((x+w/2) - boxSize/2);
	xform.setYPos((y-h/2) + boxSize/2);
	xform.setWidth(boxSize);
	xform.setHeight(boxSize);
};