var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.DirectManipulationSupport = (function() {
	var camera = null;
	var prevMouseDownState = false;
	
	var setCameraToCurrentScene = function() {
		camera = gGuiBase.SceneSupport.gCurrentScene.getFirstCamera();
	};
	
	var checkForSelect = function() {
		var camera = gGuiBase.SceneSupport.gCurrentScene.getFirstCamera();
		if (camera === undefined) return;
		
		var mouseX = camera.mouseWCX();
		var mouseY = camera.mouseWCY();
		
		if (prevMouseDownState && (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) == false)) {
			var instances = gGuiBase.SceneSupport.gCurrentScene.getInstanceList();
			var mouseInXform = false;
			var i = 0;
			for (i = 0; i < instances.length; i++) {
				var xform = instances[i].getXform();
				mouseInXform = mousePosInTransform(xform, mouseX, mouseY);
				if (mouseInXform) break;
			}
			
			if (mouseInXform) {
				gGuiBase.Core.selectInstanceDetails(instances[i].mID);
			}
		}
		
		prevMouseDownState = gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left);
	};
	window.addEventListener('mousedown', checkForSelect);
    window.addEventListener('mouseup', checkForSelect);
    window.addEventListener('mousemove', checkForSelect);
	
	var mousePosInTransform = function(transform, mouseX, mouseY) {
		
		if ((mouseX > (transform.getXPos() - transform.getWidth()/2)) && (mouseX < (transform.getXPos() + transform.getWidth()/2)) &&
			(mouseY > (transform.getYPos() - transform.getHeight()/2)) && (mouseY < (transform.getYPos() + transform.getHeight()/2))) {
			return true;
		}
		return false;
	};
	
    var mPublic = {
       
    };
    return mPublic;
}());