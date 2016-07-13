/*-----------------------------------------------------------------------------
//	Direct manipulation support
//	Supports translation, scaling, and rotation of objects within the scene
//	Author: Jason Herold/Thoof
-----------------------------------------------------------------------------*/

var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.DirectManipulationSupport = (function() {
	var camera = null; //Camera that we're using to manipulate the instances
	
	//Keep track of some variables so we know if we're dragging
	var prevMouseDownState = false;
	var prevX = 0;
	var prevY = 0;
	var objectSelected = false;
	
	//Booleans to determine if we're dragging a corner and which one
	var draggingCorner = false;
	var draggingTop = false;
	var draggingLeft = false;
	
	var setCameraToCurrentScene = function() {
		camera = gGuiBase.SceneSupport.gCurrentScene.getFirstCamera();
	};
	
	
	var handleMouseInput = function() {
		//Get the camera
		var camera = gGuiBase.SceneSupport.gCurrentScene.getFirstCamera();
		if (camera === undefined) return;
		
		//Get mouse position in world space
		var mouseX = camera.mouseWCX();
		var mouseY = camera.mouseWCY();
		
		//If left mouse is down and we're not dragging anything
		if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && !objectSelected) {
			
			//Get instances to determine if the mouse is in a gameobject
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
				
				var selectObject = gGuiBase.SceneSupport.gCurrentScene.getSelectObject();
				var xform = gGuiBase.Core.selectedGameObject.getXform();
				selectObject = new SelectionObject(xform.getXPos(), xform.getYPos(), xform.getWidth(), xform.getHeight());
				
				gGuiBase.SceneSupport.gCurrentScene.setSelectObject(selectObject);
			} else { //Clicked on empty
				gGuiBase.Core.selectedGameObject = null;
				gGuiBase.Core.emptyDetailsTab();
			}
		}
		
		//Left mouse released -- reset some bools
		if (prevMouseDownState && (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) == false) && objectSelected) {
			if (objectSelected) {
				objectSelected = false;
				draggingCorner = false;
			}
			
			
		}

		//Drag
		if(gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && (prevX !== mouseX || prevY !== mouseY) && objectSelected && !draggingCorner) {

			var xform = gGuiBase.Core.selectedGameObject.getXform();
			
			//Set bools to determine how dragging corner should be handled
			if (mousePosOnTopLeftCorner(xform, mouseX, mouseY)) {
				draggingCorner = true;
				draggingLeft = true;
				draggingTop = true;
			} else if (mousePosOnTopRightCorner(xform, mouseX, mouseY)) {
				draggingCorner = true;
				draggingTop = true;
				draggingLeft = false;
			} else if (mousePosOnBottomLeftCorner(xform, mouseX, mouseY)) {
				draggingCorner = true;
				draggingTop = false;
				draggingLeft = true;
			} else if (mousePosOnBottomRightCorner(xform, mouseX, mouseY)) {
				draggingCorner = true;
				draggingTop = false;
				draggingLeft = false;
			} else if (mousePosInTransform(xform, mouseX, mouseY)) { //Otherwise, drag without resizing
				xform.setXPos(mouseX);
				xform.setYPos(mouseY);
			}
			
			//Update the transform details
			var detailsTab = gGuiBase.View.findTabByID("#Details");
			var detailsTransform = detailsTab.getContentObject("#TransformContent");
			detailsTransform.updateFields(gGuiBase.Core.selectedGameObject);
			detailsTab.refreshSpecificContent("#TransformContent");

		}
		
		//If we're dragging a corner and not the main body of the object instance
		if (draggingCorner) {
			var xform = gGuiBase.Core.selectedGameObject.getXform();
			
			var width = ((mouseX - xform.getXPos()) * 2);
			var height = ((mouseY - xform.getYPos()) * 2);
			
			//Ensure that our width and height don't go negative
			//If width and height are negative, the functions to check mouse position versus object position don't work
			if (draggingLeft) width = -width;
			if (!draggingTop) height = -height;
			
			if (width < 0.25) width = 0.25;
			if (height < 0.25) height = 0.25;
			
			xform.setWidth(width);
			xform.setHeight(height);
			
			var detailsTab = gGuiBase.View.findTabByID("#Details");
			var detailsTransform = detailsTab.getContentObject("#TransformContent");
			detailsTransform.updateFields(gGuiBase.Core.selectedGameObject);
			detailsTab.refreshSpecificContent("#TransformContent");
		}
		
		//Record the current state of the mouse before the next call of this function
		prevMouseDownState = gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left);
		prevX = mouseX;
		prevY = mouseY;
	};
	
	//Call the above function when mouse events happen
	window.addEventListener('mousedown', handleMouseInput);
    window.addEventListener('mouseup', handleMouseInput);
    window.addEventListener('mousemove', handleMouseInput);
	
	//Checks if the mouse position is within the object transform
	var mousePosInTransform = function(transform, mouseX, mouseY) {
		
		if ((mouseX > (transform.getXPos() - transform.getWidth()/2)) && (mouseX < (transform.getXPos() + transform.getWidth()/2)) &&
			(mouseY > (transform.getYPos() - transform.getHeight()/2)) && (mouseY < (transform.getYPos() + transform.getHeight()/2))) {
			return true;
		}
		return false;
	};
	
	//Checks if the mouse position is within a 1x1 WC space window on the top left corner of the transform
	var mousePosOnTopLeftCorner = function(transform, mouseX, mouseY) {

		if ((mouseX > (transform.getXPos() - transform.getWidth()/2)) && (mouseX < (transform.getXPos() - transform.getWidth()/2) + 1) &&
			(mouseY < (transform.getYPos() + transform.getHeight()/2)) && (mouseY > (transform.getYPos() + transform.getHeight()/2) - 1)) {
			return true;
		}
		return false;
	};
	
	//Checks if the mouse position is within a 1x1 WC space window on the top right corner of the transform
	var mousePosOnTopRightCorner = function(transform, mouseX, mouseY) {

		if ((mouseX > (transform.getXPos() + transform.getWidth()/2) - 1) && (mouseX < (transform.getXPos() + transform.getWidth()/2)) &&
			(mouseY < (transform.getYPos() + transform.getHeight()/2)) && (mouseY > (transform.getYPos() + transform.getHeight()/2) - 1)) {
			return true;
		}
		return false;
	};
	
	//Checks if the mouse position is within a 1x1 WC space window on the bottom lefts corner of the transform
	var mousePosOnBottomLeftCorner = function(transform, mouseX, mouseY) {

		if ((mouseX > (transform.getXPos() - transform.getWidth()/2)) && (mouseX < (transform.getXPos() - transform.getWidth()/2) + 1) &&
			(mouseY < (transform.getYPos() - transform.getHeight()/2) + 1) && (mouseY > (transform.getYPos() - transform.getHeight()/2))) {
			return true;
		}
		return false;
	};
	
	//Checks if the mouse position is within a 1x1 WC space window on the bottom right corner of the transform
	var mousePosOnBottomRightCorner = function(transform, mouseX, mouseY) {

		if ((mouseX > (transform.getXPos() + transform.getWidth()/2) - 1) && (mouseX < (transform.getXPos() + transform.getWidth()/2)) &&
			(mouseY < (transform.getYPos() - transform.getHeight()/2) + 1) && (mouseY > (transform.getYPos() - transform.getHeight()/2))) {
			return true;
		}
		return false;
	};
	
    var mPublic = {
       
    };
    return mPublic;
}());