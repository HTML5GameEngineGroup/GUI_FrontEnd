var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.SaveLoadSupport = (function() {
    
	$('#menuFileOpenInput').hide();
	
	$('#menuFileNew').click(function(event) {
		gGuiBase.Core.cleanUpGameCore();
		
		gGuiBase.SceneSupport.gCurrentScene = new ClientScene(0);
		gGuiBase.SceneSupport.getSceneList().push(gGuiBase.SceneSupport.gCurrentScene);
		gEngine.GameLoop.stop();
		gEngine.View.startScene(gGuiBase.SceneSupport.gCurrentScene);
		
		gGuiBase.View.refreshAllTabContent();
		gGuiBase.Core.reinitializeTabs();
	});
	
	$('#menuFileOpen').click(function(event) {
		event.preventDefault();
		$('#menuFileOpenInput').trigger('click');
	});
		
	$('#menuFileSave').click(function() {
		gGuiBase.SaveLoadSupport.fileSave();
	});
	
	$('#menuRun').click(function() {
		gGuiBase.Core.gRunning = !gGuiBase.Core.gRunning;
		if (gGuiBase.Core.gRunning) {
			//Back up game state
			fileSave(true);

			$('#menuRun').css('background-color', 'grey');
			gGuiBase.Core.emptyDetailsTab();
			gGuiBase.Core.selectedGameObject = null;
		} else {
			//Load the backed-up game state
			gGuiBase.SaveLoadSupport.fileOpen(true);

			$('#menuRun').css('background-color', 'white');
		}

		// TESTING INPUT FROM FILE
		// $('input[type=file]').change(function () {
		// 	var filePath=$('#fileUpload').val();
		// 	console.log(filePath);
		// 	console.log(document.getElementById("fileUpload").files[0]);
		// });

		//TESTING TEXTURE SWAP
		// var texName = 'assets/wall.png';
		// gGuiBase.TextureSupport.addTexture(texName);
		// var gameObjectName = gGuiBase.ObjectSupport.createDefaultObject();
		// gGuiBase.TextureSupport.addTextureToGameObject(gameObjectName, texName);
	});
		
	var fileOpen = function(backup) {
		// Here is the JSZip API for reference (recommended to understand the 4 loading methods):
		// https://stuk.github.io/jszip/documentation/api_jszip.html
		// Also, here is the FileReader API:
		// https://developer.mozilla.org/en-US/docs/Web/API/FileReader
		var input;
		if (backup) {
			input = gGuiBase.Core.gBackup;
		} else {
			input = document.getElementById("menuFileOpenInput").files[0];
		}
		
		if (input) {
			// Only accept .zip
			if (!backup && input.name.endsWith(".zip")) { // Make sure it is in a .js format
				// Read the .zip file with FileReader
				var reader = new FileReader();
				reader.readAsArrayBuffer(input); // Read as ArrayBuffer for this particular file type
				var files;
				
				// Loads files into a JSZip object to be processed
				reader.onload = function(event) {
					files = new JSZip();
					files.loadAsync(event.target.result);
				};
				
				// You can only work with the files once the asynchronous loading finishes
				// Thus, we need reader.onloadend()
				reader.onloadend = function() {
					if (!confirm("Loading a file will erase current work.  Load anyways?")) {
						return;
					}
					
					try {
						// Clears everything to an empty state
						gGuiBase.Core.cleanUpGameCore();
						// Load everything from the file
						gRunning = false;
						$('#menuRun').css('background-color', 'white');
						loadMisc(files, function() {
							loadTextures(files, function() {
								loadObjects(files, function() {
									loadScenes(files, function(){ });
								});
							});
						});
						
					} catch (error) {
						alert("There were issues with loading your file.\n\nErrors:\n" + error);
						gGuiBase.Core.cleanUpGameCore();
					}
				};
			} else if (backup) {
				// This is for backing up the game
				try {
					// Clears everything to an empty state
					gGuiBase.Core.cleanUpGameCore();
					// Load everything from the file
					gGuiBase.Core.gRunning = false;
					$('#menuRun').css('background-color', 'white');
					loadMisc(gGuiBase.Core.gBackup, function() {
						loadTextures(gGuiBase.Core.gBackup, function() {
							loadObjects(gGuiBase.Core.gBackup, function() {
								loadScenes(gGuiBase.Core.gBackup, function(){});
							});
						});
					});
				} catch (error) {
					alert("There were issues with loading your file.\n\nErrors:\n" + error);
					gGuiBase.Core.cleanUpGameCore();
				}
			} else {
				alert("Your file was not a project file.");
			}
		}
		// Clears the current file by replacing itself with a fresh file input component (e.g. a clone)
		// This allows for same-file loading, where "onchange" would normally not activate on the same file
		$("#menuFileOpenInput").replaceWith($("#menuFileOpenInput").val('').clone(true));
	};
	
	var fileSave = function(backup) {
		var files = new JSZip();
		
		// Folders
		var misc = files.folder("Misc");
		var objects = files.folder("Objects");
		var scenes = files.folder("Scenes");
		var textures = files.folder("Textures"); // Not used yet
		
		// JSON files not in folders
		var globalVars;
		
		// Global vars
		var globalVarData = {};
		globalVarData[0] = gGuiBase.ObjectSupport.mNextObjID;
		globalVarData[1] = gGuiBase.InstanceSupport.mNextInstID;
		globalVarData[2] = gGuiBase.SceneSupport.mNextSceneID;
		globalVars = JSON.stringify(globalVarData);
		misc.file("vars.json", globalVars);
		
		// Objects
		var i;
		var objectList = gGuiBase.ObjectSupport.getObjectList();
		for (i = 0; i < objectList.length; i++) {
			var objectData = {};
			var obj = objectList[i];
			var objCode = gGuiBase.ObjectSupport.getGameObjectCodeByID(obj.mName);
			var xf = obj.getXform();
			
			objectData[0] = obj.mID;
			objectData[1] = objCode; //Code
			//objectData[2] = obj[2]; // type
			
			objectData[3] = xf.getXPos();
			objectData[4] = xf.getYPos();
			objectData[5] = xf.getWidth();
			objectData[6] = xf.getHeight();
			objectData[7] = xf.getRotationInDegree();
			objectData[8] = obj.getRenderable().getColor();
				// TODO: Do it for texture
			
			objects.file(obj.mName + ".json", JSON.stringify(objectData));
		}
		
		
		// Scenes
		var sceneList = gGuiBase.SceneSupport.getSceneList();
		for (i = 0; i < sceneList.length; i++) {
			// For each scene...
			var scene = sceneList[i];
			
			// Give it a folder
			var sceneFolder = scenes.folder(scene.mName);
			
			// Make a JSON file with that scene's vars
			var sceneData = {};
			sceneData[0] = scene.mID;
			sceneData[1] = scene.mNextCameraID;
			sceneFolder.file(scene.mName + ".json", JSON.stringify(sceneData));
			
			// Now do it for each camera of each scene (all cameras in one JSON file)
			var j;
			var camList = scene.getCameraList();
			var cameraData = {};
			
			var sceneViewCamera = scene.getSceneCamera();
			cameraData[0] = sceneViewCamera.mName;
			cameraData[1] = sceneViewCamera.mID;
			cameraData[2] = sceneViewCamera.getWCCenter();  // [x, y]
			cameraData[3] = sceneViewCamera.getWCWidth();
			cameraData[4] = sceneViewCamera.getViewport();  // [x, y, w, h]
			cameraData[5] = sceneViewCamera.getBackgroundColor();
			
			for (j = 0; j < camList.length; j++) {
				var cam = camList[j];
				cameraData[0 + ((j+1) * 6)] = cam.mName;
				cameraData[1 + ((j+1) * 6)] = cam.mID;
				cameraData[2 + ((j+1) * 6)] = cam.getWCCenter();  // [x, y]
				cameraData[3 + ((j+1) * 6)] = cam.getWCWidth();
				cameraData[4 + ((j+1) * 6)] = cam.getViewport();  // [x, y, w, h]
				cameraData[5 + ((j+1) * 6)] = cam.getBackgroundColor();
				
			}

			sceneFolder.file("cameras.json", JSON.stringify(cameraData));
			
			// Finally, do it for the instances (all instances in one JSON file)
			var instanceList = scene.getInstanceList();
			var instanceData = {};
			for (j = 0; j < instanceList.length; j++) {
				var inst = instanceList[j];
				
				instanceData[0 + (j * 8)] = inst.mName;
				instanceData[1 + (j * 8)] = inst.mID;
				if (inst instanceof GameObject) {
					// If it's a GO, get the relevant data
					var xf = inst.getXform();
					instanceData[2 + (j * 8)] = xf.getXPos();
					instanceData[3 + (j * 8)] = xf.getYPos();
					instanceData[4 + (j * 8)] = xf.getWidth();
					instanceData[5 + (j * 8)] = xf.getHeight();
					instanceData[6 + (j * 8)] = xf.getRotationInDegree();
					instanceData[7 + (j * 8)] = inst.getRenderable().getColor();
					// TODO: Do it for texture
				} else {
					// Blank placeholders
					instanceData[2 + (j * 8)] = 0;
					instanceData[3 + (j * 8)] = 0;
					instanceData[4 + (j * 8)] = 0;
					instanceData[5 + (j * 8)] = 0;
					instanceData[6 + (j * 8)] = 0;
					instanceData[7 + (j * 8)] = 0;
					// TODO: Needs one more placeholder if texture is added above
				}
			}
			sceneFolder.file("instances.json", JSON.stringify(instanceData));
		}
		
		// TODO: Textures too
		
		if (backup) {
			gGuiBase.Core.gBackup = files;
			return;   // Ends the function here, so it doesn't download anything when we just want to backup
		}
		
		// Download it
		files.generateAsync({type:"blob"}).then(function(blob) {
			// Use FileSaver to download it to the user's computer
			saveAs(blob, "my_project.zip");
		});
	};
	

	var loadMisc = function(files, callback) {
		// Global vars
		files.folder("Misc").forEach(function(relativePath, file) {
			// Read the ZipObject item as a JSON file, and then store the information where it belongs
			files.file(file.name).async("string").then(function success(content) {
				var data = JSON.parse(content);
				gGuiBase.ObjectSupport.mNextObjID = data[0];
				gGuiBase.InstanceSupport.mNextInstID = data[1];
				gGuiBase.SceneSupport.mNextSceneID = data[2];
			}, function error(error) {
				throw "There were issues with loading your file.\n\nErrors:\n" + error;
			});
		});
		callback();
	};

	var loadTextures = function(files, callback) {
		// TODO (see other similar functions)
		callback();
	};

	var loadObjects = function(files, callback) {
		files.folder("Objects").forEach(function(relativePath, file) {

			// Read the ZipObject item as a JSON file, and then store the information where it belongs
			files.file(file.name).async("string").then(function success(content) {
				
				var data = JSON.parse(content);
				var obj;
				// Put code in system so it can recognize it before making objects
				eval(data[1]);
				var className = relativePath.substring(0, relativePath.lastIndexOf(".")); // Just get rid of .json
				eval("obj = new " + className + "(new Renderable());");
				//var entry = [obj, data[1], data[2]];
				obj.mID = data[0];
				obj.mName = className;

				var xf = obj.getXform();
				xf.setXPos(data[3]);
				xf.setYPos(data[4]);
				xf.setWidth(data[5]);
				xf.setHeight(data[6]);
				xf.setRotationInDegree(data[7]);
				obj.getRenderable().setColor(data[8]);

				gGuiBase.ObjectSupport.setGameObjectByID(obj.mName, obj);
				gGuiBase.ObjectSupport.setGameObjectCodeByID(obj.mName, data[1]);
				gGuiBase.Core.updateObjectSelectList();
			}, function error(error) {
				throw "There were issues with loading your file.\n\nErrors:\n" + error;
			});
		});
		callback();
	};

	var loadScenes = function(files, callback) {
		// Scenes (scenes, cameras, and instances)
		var count = 0;
		files.folder("Scenes").forEach(function(relativePath, file) {

			var currentScene;
			if (relativePath.endsWith("/")) {
				// Process each folder (technically iterates through everything but we will only do stuff if it's a folder)
				var sceneName = relativePath.substring(0, relativePath.indexOf("/"));

				// Use gCurrentScene to hold current scene info
				currentScene = new ClientScene(-1); // Number is temporary
				currentScene.mName = sceneName;
				currentScene.mID = "unset";
				currentScene.mAllCamera = [];
				currentScene.mAllObject = [];
				
				var sceneList = gGuiBase.SceneSupport.getSceneList();
				sceneList.push(currentScene);
				gGuiBase.SceneSupport.selectScene(sceneList.length - 1); // This starts the scene
				gGuiBase.Core.reinitializeSceneTab();
			} else {
				//files.folder("Scenes").folder(sceneName).forEach(function(relativePath2, file2) {
				files.file(file.name).async("string").then(function success(content) {
					var data = JSON.parse(content);
					var sceneName = relativePath.substring(0, relativePath.indexOf("/"));

					if (relativePath.endsWith("cameras.json")) {
						
						// This file contains (unless the user modified it) the data for every camera in the scene
						var i = 0;
						
						// Cameras auto-add themselves to gCurrentScene once created, so we need the scene selected first
						
						var idx = gGuiBase.SceneSupport.getSceneIndex(sceneName);
						gGuiBase.SceneSupport.selectScene(idx);
						gGuiBase.SceneSupport.gCurrentScene.mAllCamera = [];
						gGuiBase.SceneSupport.gCurrentScene.cameraObjects = [];
			
						while (typeof(data[i]) !== "undefined") {
							var cam = new Camera(
								vec2.fromValues(data[i + 2][0], data[i + 2][1]),    // position of the camera
								data[i + 3],                                        // width of camera
								data[i + 4]                                         // viewport (orgX, orgY, width, height));
							);
							
							cam.setBackgroundColor(data[i + 5]);
							cam.mName = data[i];
							cam.mID = data[i + 1];
							
							if (data[i+1] === "SceneViewCamera") {
								gGuiBase.SceneSupport.gCurrentScene.setSceneCamera(cam);
							} else {
								var cameraObject = new CameraObject(cam);
								gGuiBase.SceneSupport.gCurrentScene.cameraObjects.push(cameraObject);
								gGuiBase.SceneSupport.gCurrentScene.mAllCamera.push(cam);
							}
						
							i += 6;
						}
						// Select the first scene when this process is done
						gGuiBase.SceneSupport.selectScene(0);
					} else if (relativePath.endsWith("instances.json")) {
						// This file contains (unless the user modified it) the data for every instance in the scene
						var i = 0;
						while (typeof(data[i]) !== "undefined") {
							var inst;
							if (window[data[0]].prototype instanceof GameObject) {
								eval("inst = new " + data[i + 0] + "(new Renderable())"); // Requires Objects to have been fully processed before this
								var xf = inst.getXform();
								xf.setXPos(data[i + 2]);
								xf.setYPos(data[i + 3]);
								xf.setWidth(data[i + 4]);
								xf.setHeight(data[i + 5]);
								xf.setRotationInDegree(data[i + 6]);
								var rend = inst.getRenderable();
								rend.setColor(data[i + 7]);
							} else {
								eval("inst = new " + data[i + 0] + "()");
							}
							inst.mName = data[i + 0];
							inst.mID = data[i + 1];
							
							// Add it to the scene
							//gGameCore.getSceneByName(sceneName).addInstance(inst);
							var scene = gGuiBase.SceneSupport.getSceneByName(sceneName);
							gGuiBase.InstanceSupport.addInstance(inst, scene);
							i += 8;
						}
						// should be done adding instances refresh instances!
						gGuiBase.Core.updateInstanceSelectList();
						// gGuiBase.View.refreshAllTabContent()
					} else if (relativePath.endsWith(".json")) {
						// Unless the user inserted a .json, this is the scene file
						var theScene = gGuiBase.SceneSupport.getSceneByName(sceneName);
						theScene.mName = relativePath.substring(0, relativePath.lastIndexOf("/"));
						theScene.mID = data[0];
						theScene.mNextCameraID = data[1];
						
					}
				}, function error(error) {
					throw "There were issues with loading your file.\n\nErrors:\n" + error;
				});
			}        
		});
		callback();
	};

	var refreshView = function() {
		gGuiBase.Core.reinitializeTabs();
		gGuiBase.View.refreshAllTabContent();
	};
	
    var mPublic = {
        fileOpen: fileOpen,
		fileSave: fileSave,
		refreshView: refreshView
    };
    return mPublic;
}());