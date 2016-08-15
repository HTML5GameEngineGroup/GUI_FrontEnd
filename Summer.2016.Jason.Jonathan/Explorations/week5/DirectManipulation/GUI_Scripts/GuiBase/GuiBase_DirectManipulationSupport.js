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
	var prevXPixel = 0;
	var prevYPixel = 0;
	var objectSelected = false;
	var cameraSelected = false;
	var currentCameraObject = null;
	
	var preventInteraction = false;
	//Booleans to determine if we're dragging a corner and which one
	var draggingCorner = false;
	var draggingTop = false;
	var draggingLeft = false;
	var draggingRotate = false;
	var draggingCamera = false;
	
	var draggingTopCamera = false;
	var draggingBotCamera = false;
	var draggingLeftCamera = false;
	var draggingRightCamera = false;
	var draggingCameraEdge = false;
	
	var handleMouseInput = function() {
		if (!preventInteraction) {
			//Get the camera
			var camera = gGuiBase.SceneSupport.gCurrentScene.getSceneCamera();
			if (camera === undefined || camera === null) return;
			
			//Get mouse position in world space
			var mouseX = camera.mouseWCX();
			var mouseY = camera.mouseWCY();
			
			//If left mouse is down and we're not dragging anything
			if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && !objectSelected && !cameraSelected) {
				
				//Get instances to determine if the mouse is in a gameobject
				var instances = gGuiBase.SceneSupport.gCurrentScene.getInstanceList();
				var selectedGameObject = gGuiBase.Core.selectedGameObject;
				var mouseInXform = false;
				var i = 0;
				for (i = 0; i < instances.length; i++) {
					var xform = instances[i].getXform();
					mouseInXform = mousePosInTransform(xform, mouseX, mouseY);
					if (mouseInXform) break;
					mouseInXform = mousePosOnRotationSquare(xform, mouseX, mouseY);
					if (mouseInXform) break;
					
					//Workaround
					gGuiBase.Core.selectedGameObject = instances[i];
					var selectObject = new SelectionObject(xform.getXPos(), xform.getYPos(), xform.getWidth(), xform.getHeight());
					selectObject.update();
					mouseInXform = selectObject.mousePosOnTopLeftCorner(xform, mouseX, mouseY)
					if (mouseInXform) break;
					mouseInXform = selectObject.mousePosOnTopRightCorner(xform, mouseX, mouseY)
					if (mouseInXform) break;
					mouseInXform = selectObject.mousePosOnBottomLeftCorner(xform, mouseX, mouseY)
					if (mouseInXform) break;
					mouseInXform = selectObject.mousePosOnBottomRightCorner(xform, mouseX, mouseY)
					if (mouseInXform) break;
					
				}
				gGuiBase.Core.selectedGameObject = selectedGameObject; //Workaround
				
				var mouseInCameraIcon = false;
				var cameras = gGuiBase.SceneSupport.gCurrentScene.getCameraObjectList();
				var j = 0;
				for (j = 0; j < cameras.length; j++) {
					mouseInCameraIcon = mouseInCameraObject(cameras[j], mouseX, mouseY);
					if (mouseInCameraIcon) break;
					
					if (cameras[j] === currentCameraObject) {
						mouseInCameraIcon = cameras[j].mouseOnTopBox(mouseX, mouseY);
						if (mouseInCameraIcon) break;
						mouseInCameraIcon = cameras[j].mouseOnBotBox(mouseX, mouseY);
						if (mouseInCameraIcon) break;
						mouseInCameraIcon = cameras[j].mouseOnLeftBox(mouseX, mouseY);
						if (mouseInCameraIcon) break;
						mouseInCameraIcon = cameras[j].mouseOnRightBox(mouseX, mouseY);
						if (mouseInCameraIcon) break;
					}
				}
				
				
				if (mouseInCameraIcon) {
					if (currentCameraObject !== null) { 
						currentCameraObject.toggleDrawBorder(false);
						currentCameraObject = null;
					}
					gGuiBase.Core.selectDetailsCamera(cameras[j].cameraRef.mName);
					currentCameraObject = cameras[j];
					cameraSelected = true;
					
					cameras[j].toggleDrawBorder(true);
					
				} else if (mouseInXform) {
					gGuiBase.Core.selectInstanceDetails(instances[i].mID);
					objectSelected = true;
					
					var selectObject = gGuiBase.SceneSupport.gCurrentScene.getSelectObject();
					var xform = gGuiBase.Core.selectedGameObject.getXform();
					selectObject = new SelectionObject(xform.getXPos(), xform.getYPos(), xform.getWidth(), xform.getHeight());
					
					gGuiBase.SceneSupport.gCurrentScene.setSelectObject(selectObject);
					
					var rotationObject = gGuiBase.SceneSupport.gCurrentScene.getRotationObject();
					rotationObject = new RotationObject(xform.getXPos(), xform.getYPos(), xform.getWidth(), xform.getHeight(), xform.getRotationInRad());
					
					gGuiBase.SceneSupport.gCurrentScene.setRotationObject(rotationObject);
				
				} else { //Clicked on empty
					gGuiBase.Core.selectedGameObject = null;
					gGuiBase.Core.selectedCamera = null;
					if (currentCameraObject !== null) { 
						currentCameraObject.toggleDrawBorder(false);
						currentCameraObject = null;
					}
					gGuiBase.Core.emptyDetailsTab();
				}
			}
			
			//Left mouse released -- reset some bools
			if (prevMouseDownState && (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) == false) && (objectSelected || cameraSelected)) {
				//if (objectSelected) {
					objectSelected = false;
					cameraSelected = false;
					draggingCorner = false;
					draggingRotate = false;
					draggingCamera = false;
					draggingCameraEdge = false;
					draggingLeftCamera = false;
					draggingRightCamera = false;
					draggingTopCamera = false;
					draggingBotCamera = false;
				//} 
			}

			//Drag
			if(gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && (prevX !== mouseX || prevY !== mouseY) && (objectSelected) && !draggingCorner && !draggingRotate && !draggingCamera) {

				var xform = gGuiBase.Core.selectedGameObject.getXform();
				var selectObject = gGuiBase.SceneSupport.gCurrentScene.getSelectObject();
				//Set bools to determine how dragging corner should be handled
				if (mousePosOnRotationSquare(xform, mouseX, mouseY)) {
					draggingRotate = true;
				
				} else if (selectObject.mousePosOnTopLeftCorner(xform, mouseX, mouseY)) {
					draggingCorner = true;
					draggingLeft = true;
					draggingTop = true;
				} else if (selectObject.mousePosOnTopRightCorner(xform, mouseX, mouseY)) {
					draggingCorner = true;
					draggingTop = true;
					draggingLeft = false;
				} else if (selectObject.mousePosOnBottomLeftCorner(xform, mouseX, mouseY)) {
					draggingCorner = true;
					draggingTop = false;
					draggingLeft = true;
				} else if (selectObject.mousePosOnBottomRightCorner(xform, mouseX, mouseY)) {
					draggingCorner = true;
					draggingTop = false;
					draggingLeft = false;
				} else { //Otherwise, drag without resizing
					xform.setXPos(mouseX);
					xform.setYPos(mouseY);
					
				}
				
				
				//Update the transform details
				var detailsTab = gGuiBase.View.findTabByID("#Details");
				var detailsTransform = detailsTab.getContentObject("#TransformContent");
				detailsTransform.updateFields(gGuiBase.Core.selectedGameObject);
				detailsTab.refreshSpecificContent("#TransformContent");

			} else if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && (prevX !== mouseX || prevY !== mouseY) && cameraSelected && !draggingCamera && !draggingCameraEdge) {
				if (currentCameraObject !== null) {
					if (currentCameraObject.mouseOnTopBox(mouseX, mouseY)) {
						draggingCameraEdge = true;
						draggingTopCamera = true;
					} else if (currentCameraObject.mouseOnBotBox(mouseX, mouseY)) {
						draggingCameraEdge = true;
						draggingBotCamera = true;
					} else if (currentCameraObject.mouseOnLeftBox(mouseX, mouseY)) {
						draggingCameraEdge = true;
						draggingLeftCamera = true;
					} else if (currentCameraObject.mouseOnRightBox(mouseX, mouseY)) {
						draggingCameraEdge = true;
						draggingRightCamera = true;
					} else {
						currentCameraObject.cameraRef.setWCCenter(mouseX, mouseY);
					}
					
					var detailsTab = gGuiBase.View.findTabByID("#Details");
					var detailsTransform = detailsTab.getContentObject("#CameraTransformContent");
					detailsTransform.updateFields(currentCameraObject.cameraRef);
					detailsTab.refreshSpecificContent("#CameraTransformContent");
				}
				
			//Drag the camera
			} else if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && (prevX !== mouseX || prevY !== mouseY) && !draggingCorner && !draggingRotate) {
				draggingCamera = true;
				//Not dragging fast enough
				/*var cameraCenter = camera.getWCCenter();
				
				var dx = (mouseX - prevX) + cameraCenter[0];
				var dy = (mouseY - prevY) + cameraCenter[1];
				
				var mouseXPixel = gEngine.Input.getMousePosX();
				var mouseYPixel = gEngine.Input.getMousePosY();
				
				var cameraPositionPixel = vec3.fromValues(cameraCenter[0], cameraCenter[1], 0);
				cameraPositionPixel = camera.wcPosToPixel(cameraPositionPixel);
				
				var dx = (mouseXPixel - prevXPixel) * 3 + cameraPositionPixel[0];
				var dy = (mouseYPixel - prevYPixel) * 3 + cameraPositionPixel[1];
				
				dx = camera.positionWCX(dx);
				dy = camera.positionWCY(dy);
				
				camera.setWCCenter(dx, dy);*/
			}
			
			//If we're dragging a corner and not the main body of the object instance
			if (draggingCorner) {
				var xform = gGuiBase.Core.selectedGameObject.getXform();
				var selectObject = gGuiBase.SceneSupport.gCurrentScene.getSelectObject();
				
				var x = xform.getXPos();
				var y = xform.getYPos();
				var w = xform.getWidth();
				var h = xform.getHeight();
				var r = xform.getRotationInRad();
				
				var mousePos = vec2.fromValues(mouseX, mouseY);
				
				//Apply inverse rotation to fit the object & mouse position to the x/y axis
				mousePos = rotatePoint(x, y, -r, mousePos);
				
				var dx = mousePos[0] - x;
				var dy = mousePos[1] - y;
				
				var width = dx * 2;
				var height = dy * 2;
				
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
			} else if (draggingRotate) {
				var xform = gGuiBase.Core.selectedGameObject.getXform();
				var dx = mouseX - xform.getXPos();
				var dy = mouseY - xform.getYPos();
				
				var angle = Math.atan2(dy, dx);
				var angleInDegree = angle * 180 / Math.PI;
			
				if (angleInDegree < 0) { //Don't use negative degree because the slider is 0-360
					angleInDegree += 360;
				}
				xform.setRotationInDegree(angleInDegree);
				
				var detailsTab = gGuiBase.View.findTabByID("#Details");
				var detailsTransform = detailsTab.getContentObject("#TransformContent");
				detailsTransform.updateFields(gGuiBase.Core.selectedGameObject);
				detailsTab.refreshSpecificContent("#TransformContent");
			} else if (draggingCameraEdge) {
				var cameraCenter = currentCameraObject.cameraRef.getWCCenter();
				var dx = mouseX - cameraCenter[0];
				var dy = mouseY - cameraCenter[1];
				
				var width = dx * 2;
				
				if (draggingTopCamera || draggingBotCamera) {
					width = dy * 2;
				}
				
				if (draggingLeftCamera || draggingBotCamera) width = -width;
				
				if (width < 0) width = 0;
				
				currentCameraObject.cameraRef.setWCWidth(width);
				
				var detailsTab = gGuiBase.View.findTabByID("#Details");
				var detailsTransform = detailsTab.getContentObject("#CameraTransformContent");
				detailsTransform.updateFields(currentCameraObject.cameraRef);
				detailsTab.refreshSpecificContent("#CameraTransformContent");
				
			}
			
			//Record the current state of the mouse before the next call of this function
			prevMouseDownState = gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left);
			prevX = mouseX;
			prevY = mouseY;
			prevXPixel = gEngine.Input.getMousePosX();
			prevYPixel = gEngine.Input.getMousePosY();
		}
	};
	
	//Handle zooming in and out using up and down arrows
	var handleKeyboardInput = function() {
		var camera = gGuiBase.SceneSupport.gCurrentScene.getSceneCamera();
		if (camera === undefined || camera === null) return;
		
		if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up)) {
			camera.zoomBy(0.5);
		} else if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down)) {
			camera.zoomBy(1.5);
		}
	};
	
	setInterval(handleKeyboardInput, 10);
	
	//Call the above function when mouse events happen
	window.addEventListener('mousedown', handleMouseInput);
    window.addEventListener('mouseup', handleMouseInput);
    window.addEventListener('mousemove', handleMouseInput);
	
	//Checks if the mouse position is within the object transform
	var mousePosInTransform = function(xform, mouseX, mouseY) {
		//Since it's not selected, have to calculate the positions here instead of in SelectionObject
		var x = xform.getXPos();
		var y = xform.getYPos();
		var w = xform.getWidth();
		var h = xform.getHeight();
		var r = xform.getRotationInRad();
		var radius = Math.sqrt((w/2)*(w/2) + (h/2)*(h/2));
		
		var angleToTopRight = Math.atan2(h/2, w/2)
		var angleToTopLeft = Math.PI - angleToTopRight;
		var angleToBotLeft = Math.PI + angleToTopRight;
		var angleToBotRight = -angleToTopRight;
		
		var topLeftX = Math.cos(r + (angleToTopLeft)) * radius + x;
		var topLeftY = Math.sin(r + (angleToTopLeft)) * radius + y;
		
		var topRightX = Math.cos(r + angleToTopRight) * radius + x;
		var topRightY = Math.sin(r + angleToTopRight) * radius + y;
		
		var botLeftX = Math.cos(r + (angleToBotLeft)) * radius + x;
		var botLeftY = Math.sin(r + (angleToBotLeft)) * radius + y;
		
		var botRightX = Math.cos(r + (angleToBotRight)) * radius + x;
		var botRightY = Math.sin(r + (angleToBotRight)) * radius + y;
		
		var topLeft = vec2.fromValues(topLeftX, topLeftY);
		var topRight = vec2.fromValues(topRightX, topRightY);
		var botLeft = vec2.fromValues(botLeftX, botLeftY);
		var botRight = vec2.fromValues(botRightX, botRightY);
		var mousePos = vec2.fromValues(mouseX, mouseY);
		
		//Apply inverse rotation to fit the object & mouse position to the x/y axis
		mousePos = rotatePoint(x, y, -r, mousePos);
		topLeft = rotatePoint(x, y, -r, topLeft);
		topRight = rotatePoint(x, y, -r, topRight);
		botLeft = rotatePoint(x, y, -r, botLeft);
		botRight = rotatePoint(x, y, -r, botRight);

		/*if ((mouseX > (transform.getXPos() - transform.getWidth()/2)) && (mouseX < (transform.getXPos() + transform.getWidth()/2)) &&
			(mouseY > (transform.getYPos() - transform.getHeight()/2)) && (mouseY < (transform.getYPos() + transform.getHeight()/2))) {
			return true;
		}*/
		if ((mousePos[0] > topLeft[0]) && (mousePos[0] < topRight[0]) &&
			(mousePos[1] > botLeft[1]) && (mousePos[1] < topLeft[1])) {
			return true;
		}
		
		
		return false;
	};
	
	var mousePosOnRotationSquare = function(transform, mouseX, mouseY) {
		var camera = gGuiBase.SceneSupport.gCurrentScene.getSceneCamera();
		var camW = camera.getWCWidth();
		var boxSize = camW / 50 * 0.75;
		
		var x = transform.getXPos();
		var y = transform.getYPos();
		var w = transform.getWidth();
		var h = transform.getHeight();
		var r = transform.getRotationInRad();
	
		var radius = Math.sqrt((w*w) + (h*h)) / 2;
		var endPointX = Math.cos(r) * radius + x;
		var endPointY = Math.sin(r) * radius + y;
		
		var distance = Math.sqrt(Math.pow((mouseX - endPointX), 2) + Math.pow((mouseY - endPointY), 2));
		if (distance < boxSize) return true;
		return false;
		
	};
	
	var mouseInCameraObject = function(cameraObject, mouseX, mouseY) {
		var camera = cameraObject.cameraRef;
		
		var x = camera.getWCCenter()[0];
		var y = camera.getWCCenter()[1];
		var width = cameraObject.CAMERA_ICON_WIDTH;

		return mouseInBound(mouseX, mouseY, x, y, width);
	};
	
	var mouseInBound = function (mouseX, mouseY, x, y, width) {
		
		
		if ((mouseX > (x - width / 2)) && (mouseX < (x + width / 2)) &&
			(mouseY < (y + width / 2)) && (mouseY > (y - width / 2))) {
			return true;
		}
		return false;
	};
	
	var rotatePoint = function (originX, originY, angle, point) {
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		
		point[0] -= originX;
		point[1] -= originY;
		
		var xnew = point[0] * c - point[1] * s;
		var ynew = point[0] * s + point[1] * c;
		
		point[0] = xnew + originX;
		point[1] = ynew + originY;
		
		return point;
	};
	
	var setPreventInteraction = function(prevent) {
		preventInteraction = prevent;
		objectSelected = false;
		cameraSelected = false;
		draggingCorner = false;
		draggingRotate = false;
		draggingCamera = false;
		draggingCameraEdge = false;
		draggingLeftCamera = false;
		draggingRightCamera = false;
		draggingTopCamera = false;
		draggingBotCamera = false;
	};
	
    var mPublic = {
       mouseInBound: mouseInBound,
	   rotatePoint: rotatePoint,
	   currentCameraObject: currentCameraObject,
	   setPreventInteraction: setPreventInteraction
    };
    return mPublic;
}());