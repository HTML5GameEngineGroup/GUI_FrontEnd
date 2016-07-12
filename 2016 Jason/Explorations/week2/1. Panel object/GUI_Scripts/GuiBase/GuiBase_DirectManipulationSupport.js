var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.DirectManipulationSupport = (function() {
	var camera = null;
	var prevMouseDownState = false;
	var prevX = 0;
	var prevY = 0;
	var objectSelected = false;
	
	
	var setCameraToCurrentScene = function() {
		camera = gGuiBase.SceneSupport.gCurrentScene.getFirstCamera();
	};
	
	var checkForSelect = function() {
		var camera = gGuiBase.SceneSupport.gCurrentScene.getFirstCamera();
		if (camera === undefined) return;
		
		var mouseX = camera.mouseWCX();
		var mouseY = camera.mouseWCY();
		
		if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && !objectSelected) {
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
				objectSelected = true;
			}
		}
		
		if (prevMouseDownState && (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) == false) && objectSelected) {
			objectSelected = false;
		}
		
		if(gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && (prevX !== mouseX || prevY !== mouseY) && objectSelected) {

			var xform = gGuiBase.Core.selectedGameObject.getXform();
			xform.setXPos(mouseX);
			xform.setYPos(mouseY);
			
			/*var detailsTab = gGuiBase.View.findTabByID("#Details");
			
			var detailsTransform = new TransformContent("TransformContent", gGuiBase.View.CONTENT_STYLE, "Transform");
			detailsTransform.updateFields(gGuiBase.Core.selectedGameObject);
			detailsTab.removeContent("#TransformContent");
			detailsTab.addContentToFront(detailsTransform);*/
			

		}
		
		prevMouseDownState = gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left);
		prevX = mouseX;
		prevY = mouseY;
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