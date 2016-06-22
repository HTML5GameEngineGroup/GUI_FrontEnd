/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene, GameCore, GameObject, Camera, gCurrentScene, JSZip */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gGameCore = null;

var gLastSetName = "";          // For reverting names
var gRightClickedItem = null;   // For tracking which item was clicked from the menu
var gNextObjectID = 0;          // For making unique IDs
var gNextInstanceID = 0;        // ""
var gNextSceneID = 1;           // Since one scene is provided at the start
var gRunning = false;           // If true, the update function will be called each game loop
var gCurrentListItem = null;    // For fast adding/removing the helpful, highlighted text color in list items (removes need to do looping)
var gZIndex = 0;                // ID for editors
var gEditorMap = {};            // Hashes mID of objects to an editor id.  Used for making the right editor show on top.
var gBackup = null;           // Temp storage for game.  When done running, back it up.

var EDITOR_OFFSETS = [30, 192, 95];
var DETAILS_OBJECTS_OFFSETS = [150, 75, 120];


$(document).ready(function() {
    
    gGameCore = new GameCore();
    
    createPanelLeft();
    createPanelRight();
    createPanelBottom();
    
    // Removes the scroll bar
    $('body').addClass('disable-scroll');
    $('body').css('background-color', '#4d4948');
    $('#menuFileOpenInput').hide();
	
	var tabs2 = $("#panelBottom").tabs();
			
			//tabs2.height($(document).height() - $("#panelBottom").css("height"));
			//tabs2.height($(document).height() - $("#panelBottom").css("height"));
			$("#sortable2").sortable({
				opacity: 0.5,
				stop: function() {
					tabs2.tabs("refresh");
				},
				
				receive : function(event, ui) {
				    var linkHTML = (ui.item[0].innerHTML); //Get the moved elements <a> information
					//Get the href, which contains the tab name that we need to move
					var href = linkHTML.match(/href="([^"]*)/)[1]; 
					var divID = href.substring(1); //Remove the # since we won't be referring to it as a link

					$(href).detach().appendTo("#panelBottom");
					
					tabs2.tabs("refresh");
					return true;
				}
			});
			
		
			var tabs1 = $("#panelLeft").tabs();
			
			//tabs1.height($("#panelBottom").css("top")); //Set left panel height to the top of bottom panel
			tabs1.height($(document).height() - parseInt($("#panelBottom").css("height")) - 10);
			
			$("#sortable1").sortable({
				opacity: 0.5,
				stop: function() { //Called when any element is moved
					tabs1.tabs("refresh");
				},
				
				receive : function(event, ui) { //Called when this set of tabs gets a new element
				    var linkHTML = (ui.item[0].innerHTML); //Get the moved elements <a> html
					//Get the href, which contains the tab name that we need to move
					var href = linkHTML.match(/href="([^"]*)/)[1]; 
					var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
					
					//Remove the div from where it was and move it into this panel's div
					$(href).detach().appendTo("#panelLeft");
					
					tabs1.tabs("refresh");
					return true;
				}
					
				
			});
			
			//Right panel 
			var tabs3 = $("#panelRight").tabs();
			tabs3.height($(document).height() - parseInt($("#panelBottom").css("height")) - 10); //Set right panel height to the top of bottom panel
			
			$("#sortable3").sortable({
				opacity: 0.5,
				stop: function() {
					tabs3.tabs("refresh");
					
				},
				
				receive : function(event, ui) {
				    var linkHTML = (ui.item[0].innerHTML); //Get the moved elements <a> information
					//Get the href, which contains the tab name that we need to move
					var href = linkHTML.match(/href="([^"]*)/)[1]; 
					var divID = href.substring(1); //Remove the # since we won't be referring to it as a link

					$(href).detach().appendTo("#panelRight");
					
					tabs3.tabs("refresh");
					return true;
				}

			});
			
			//Connect the three panels so they can move tabs between each other
			$( "#sortable1, #sortable2, #sortable3").sortable({
				opacity: 0.5,
				connectWith: ".connectedSortable"
				
			});
			
			//Resizing
			$("#panelLeft").resizable({
				handles: "e"
				
			});
			$("#panelBottom").resizable({
				handles: "n",	
				resize: function(event, ui) {
					//Resize the left and right panels so they follow the bottom panel
					$("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
					$("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
					ui.position.top = $(document).height() - ui.size.height; //Works without this in firefox, not with chrome
				}
			});
			$("#panelRight").resizable({
				handles: "w",
				resize: function(event, ui) { //Fix for right panel repositioning on resize
					ui.position.left = 0;
					
				}
			});
			
			
			$( window ).resize(function() {
				$("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
				$("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
			});
			

	
    
    // Resize the window once to make everything fit
    windowResize();
});

$('#menuFileNew').click(function(event) {
    cleanUpGameCore();
    
    gCurrentScene = new ClientScene(0);
    gGameCore.getSceneList().push(gCurrentScene);
    gEngine.GameLoop.stop();
    gEngine.GameLoop.stop();
    gEngine.Core.startScene(gCurrentScene);
    
    refreshAllPanels();
});

$('#menuFileOpen').click(function(event) {
    event.preventDefault();
    $('#menuFileOpenInput').trigger('click');
});

var fileOpen = function(backup) {
    // Here is the JSZip API for reference (recommended to understand the 4 loading methods):
    // https://stuk.github.io/jszip/documentation/api_jszip.html
    // Also, here is the FileReader API:
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    
    var input;
    if (backup) {
        input = gBackup;
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
                    cleanUpGameCore();
                    // Load everything from the file
                    gRunning = false;
                    $('#menuRun').css('background-color', '#ab9b97');
                    loadMisc(files, function() {
                        loadTextures(files, function() {
                            loadObjects(files, function() {
                                loadScenes(files, function() {
                                    refreshAllPanels();
                                });
                            });
                        });
                    });
                } catch (error) {
                    alert("There were issues with loading your file.\n\nErrors:\n" + error);
                    cleanUpGameCore();
                }
            };
        } else if (backup) {
            // This is for backing up the game
            try {
                // Clears everything to an empty state
                cleanUpGameCore();
                // Load everything from the file
                gRunning = false;
                $('#menuRun').css('background-color', '#ab9b97');
                loadMisc(gBackup, function() {
                    loadTextures(gBackup, function() {
                        loadObjects(gBackup, function() {
                            loadScenes(gBackup, function() {
                                refreshAllPanels();
                            });
                        });
                    });
                });
            } catch (error) {
                alert("There were issues with loading your file.\n\nErrors:\n" + error);
                cleanUpGameCore();
            }
        } else {
            alert("Your file was not a project file.");
        }
    }
    // Clears the current file by replacing itself with a fresh file input component (e.g. a clone)
    // This allows for same-file loading, where "onchange" would normally not activate on the same file
    $("#menuFileOpenInput").replaceWith($("#menuFileOpenInput").val('').clone(true));
};

$('#menuFileSave').click(function() {
    fileSave();
});

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
    globalVarData[0] = gNextObjectID;
    globalVarData[1] = gNextInstanceID;
    globalVarData[2] = gNextSceneID;
    globalVars = JSON.stringify(globalVarData);
    misc.file("vars.json", globalVars);
    
    // Objects
    var i;
    var objectList = gGameCore.getObjectList();
    for (i = 0; i < objectList.length; i++) {
        var objectData = {};
        var obj = objectList[i];
        var xf = obj[0].getXform();
        
        objectData[0] = obj[0].mID;
        objectData[1] = obj[1];
        objectData[2] = obj[2];
        if (objectData[2] === 1) {
            // If it's a GO, get the relevant data
            objectData[3] = xf.getXPos();
            objectData[4] = xf.getYPos();
            objectData[5] = xf.getWidth();
            objectData[6] = xf.getHeight();
            objectData[7] = xf.getRotationInDegree();
            objectData[8] = obj[0].getRenderable().getColor();
            // TODO: Do it for texture
        }
        
        objects.file(obj[0].mName + ".json", JSON.stringify(objectData));
    }
    
    
    // Scenes
    var sceneList = gGameCore.getSceneList();
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
        for (j = 0; j < camList.length; j++) {
            var cam = camList[j];
            
            cameraData[0 + (j * 6)] = cam.mName;
            cameraData[1 + (j * 6)] = cam.mID;
            cameraData[2 + (j * 6)] = cam.getWCCenter();  // [x, y]
            cameraData[3 + (j * 6)] = cam.getWCWidth();
            cameraData[4 + (j * 6)] = cam.getViewport();  // [x, y, w, h]
            cameraData[5 + (j * 6)] = cam.getBackgroundColor();
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
        gBackup = files;
        return;   // Ends the function here, so it doesn't download anything when we just want to backup
    }
    
    // Download it
    files.generateAsync({type:"blob"}).then(function(blob) {
        // Use FileSaver to download it to the user's computer
        saveAs(blob, "my_project.zip");
    });
};

$('#menuRun').click(function() {
    gRunning = !gRunning;
    if (gRunning) {
        // Back up game state
        fileSave(true);
        
        $('#menuRun').css('background-color', '#c7b6b2');
        cleanUpPanelRightBody();
        if (gCurrentListItem !== null) {
            gCurrentListItem.removeClass('current-list-item');
        }
    } else {
        // Load the backed-up game state
        fileOpen(true);
        
        $('#menuRun').css('background-color', '#ab9b97');
    }
});

$(document).bind("mousedown", function(event) {
    // Upon a click outside of the menu, hide all right-click menus (allows you to immediately open a new menu elsewhere)
    // Adapted from: http://stackoverflow.com/questions/4495626/making-custom-right-click-context-menus-for-my-web-app
    if (!$(event.target).parents(".right-click-menu").length > 0) {
        $('.right-click-menu').hide();
    }
});

$(document).bind("contextmenu", function(event) {
    // Prevents all regular right-click menus from showing when right-clicking
    event.preventDefault();
});

$(document).on('contextmenu', 'li', function(event) {
    // Checks out the id of the HTML element (also same as mID) and will provide the appropriate right-click menu
    // (since another function blocks the default one)
    var id = this.id;
    if (id.startsWith("objectListItem")) {
        $('#objectsMenu').finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'}).css('z-index', gZIndex + 1);
        gRightClickedItem = $(this).attr('id');
    } else if (id.startsWith("instanceListItem")) { 
        $('#instancesMenu').finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'}).css('z-index', gZIndex + 1);
        gRightClickedItem = $(this).attr('id');
    } else if (id.startsWith("sceneListItem")) { 
        $('#scenesMenu').finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'}).css('z-index', gZIndex + 1);
        gRightClickedItem = $(this).attr('id');
    } else if (id.startsWith("cameraListItem")) { 
        $('#camerasMenu').finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'}).css('z-index', gZIndex + 1);
        gRightClickedItem = $(this).attr('id');
    }
});

$('.right-click-menu li').click(function(){
    // When a right-click menu option is clicked
    switch($(this).attr("name")) {
        case "objectsMenuDetails":
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // Basically just selects the item; gGameCore will refresh and set up the details panel anew
                    gGameCore.select(index - 1);
                }
            });
            break;
        case "objectsMenuEditCode":
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // Selects the item; gGameCore will refresh and set up the details panel anew
                    var selected = gGameCore.select(index - 1);
                    
                    createFloatingCodeEditor(selected);
                }
            });
            break;
        case "objectsMenuInstantiateToScene":
            if (gCurrentScene.mID === "sceneListItemBlank") {
                alert("You need a scene to do that!");
                break;
            }
            var inst;
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    var entry = gGameCore.getObjectAt(index - 1);
                    var obj = entry[0];
                    var name = obj.mName;
                    
                    if (entry[2] === 1) {
                        // Create
                        eval("inst = new " + name + "(new Renderable());");
                        
                        // Mimic the xform
                        var xf = inst.getXform();
                        var xf2 = obj.getXform();
                        xf.setXPos(xf2.getXPos());
                        xf.setYPos(xf2.getYPos());
                        xf.setWidth(xf2.getWidth());
                        xf.setHeight(xf2.getHeight());
                        xf.setRotationInDegree(xf2.getRotationInDegree());
                        
                        var rend = inst.getRenderable();
                        rend.setColor(obj.getRenderable().getColor());
                        
                        inst.mName = name;
                        inst.mID = "instance" + obj.mID.substring(obj.mID.indexOf("L"), obj.mID.length) + "_" + gNextInstanceID;
                        gNextInstanceID++;
                    } else if (entry[2] === 0) { // Must be 0; a class
                        eval("inst = new " + name + "();");
                        inst.mName = name;
                        // So something like, instanceListItem<number>_<unique instance number>
                        // Instances will be able to track their Class/GO by name, which is updated appropriately.  ID is just for the UI.
                        inst.mID = "instance" + obj.mID.substring(obj.mID.indexOf("L"), obj.mID.length) + "_" + gNextInstanceID;
                        gNextInstanceID++;
                    }
                    
                    // Add
                    gGameCore.addInstance(inst);
                    changeCurrentListItem(inst.mID);
                }
            });
            break;
        case "objectsMenuDelete":
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // Display warning message before deleting
                    var name = gGameCore.getObjectAt(index - 1)[0].mName;
                    if (confirm("Warning:\nThis will delete all instances of " + name + ".\n\Delete anyways?")) { // Evalutes to true and perform an action if OK is pressed, otherwise do nothing
                        
                        // If the selected item is also the item to be deleted, then clean up panel right's body
                        if (gGameCore.getSelected() !== null && gGameCore.getSelected()[0] === gGameCore.getObjectAt(index - 1)[0]) {
                            cleanUpPanelRightBody();
                        }
                        
                        gGameCore.deleteObjectAt(index - 1);
                        
                        $('#' + gRightClickedItem).remove();
                        $('#' + gRightClickedItem + 'p').remove();
                        $('#' + gRightClickedItem + 'br').remove();
                    }
                    if ($('#panelBottomInstances').hasClass('current-tab')) {
                        createPanelBottomInstancesSelect("");
                    }
                }
            });
            break;
        case "instancesMenuDetails":
            $('#panelBottomBody .panel-list-item').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // Basically just selects the item; gGameCore will refresh and set up the details panel anew
                    gGameCore.selectInstance(index);
                }
            });
            break;
        case "instancesMenuDelete":
            $('#panelBottomBody .panel-list-item').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // Delete the item; gGameCore will refresh and set up the details panel anew
                    gGameCore.deleteInstance(index);
                }
            });
            break;
        case "scenesMenuDetails":
            $('#panelBottomBody .panel-list-item').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    gGameCore.selectScene(index);
                    cleanUpPanelRightBody();
                    if (!gRunning) {
                        changeCurrentListItem(gRightClickedItem);
                        createDetailsScenes();
                    }
                }
            });
            break;
        case "scenesMenuDelete":
            $('#panelBottomBody .panel-list-item').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    gGameCore.deleteScene(index);
                }
            });
            break;
        case "camerasMenuDetails":
            $('#panelBottomBody .panel-list-item').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    gGameCore.selectCamera(index);
                }
            });
            break;
        case "camerasMenuDelete":
            $('#panelBottomBody .panel-list-item').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    gGameCore.deleteCamera(index);
                }
            });
            break;
        default:
            break;
    }
  
    // Done with the menu
    $('.right-click-menu').hide();
});

$('div').on('focusout', '.text-field', function() {
    // When you focus out of any text-field, save the contents to the appropriate place
    
    var selected = gGameCore.getSelected();
    var instanceID = "";
    var xf;
    
    if (selected !== null) {
        instanceID = selected.mID; // If this is null, we have an instance
        if (!(typeof instanceID === "undefined")) { // Instance
            xf = selected.getXform();
        } else if (selected[2] === 1){ // GO
            xf = selected[0].getXform();
        }
    }
    
    switch($(this).attr('id')) {
        case "panelRightObjectsName":   // Renaming
            gLastSetName = $(this).val();
            if (!(typeof instanceID === "undefined")) { // Instance
                break;
            }
            
            if (gLastSetName !== selected[0].mName) { // If the name is new
                if (!gGameCore.checkForNameConflict(gLastSetName)) {
                    // Create a new class with the new name
                    if (selected[2] === 1) {
                        window[gLastSetName] = function(renderableObj) {
                            GameObject.call(this, renderableObj);
                        };
                        gEngine.Core.inheritPrototype(window[gLastSetName], GameObject);
                    } else {
                        window[gLastSetName] = function() {
                            
                        };
                    }
                    
                    // Re-eval any class code
                    var i;
                    var objs = gGameCore.getObjectList();
                    for (i = 0; i < objs.length; i++) {
                        if (objs[i][0].mName === selected[0].mName) {
                            eval(objs[i][1]);
                        }
                    }
                    
                    // First update all instances with the new name and class
                    var instances = gGameCore.getInstanceList();
                    for (i = 0; i < instances.length; i++) {
                        if (instances[i].mName === selected[0].mName) {
                            // Each instance needs to be re-created exactly as the old one, but as a new class
                            // They also need their name value modified
                            var rend = instances[i].getRenderable();
                            var xf = instances[i].getXform();
                            var newInstance;
                            eval("newInstance = new " + gLastSetName + "(rend);");
                            newInstance.mID = instances[i].mID;
                            var newXf = newInstance.getXform();
                            newXf = xf;
                            instances[i] = newInstance;
                            instances[i].mName = $(this).val();
                        }
                    }
                    if ($('#panelBottomInstances').hasClass('current-tab')) {
                        createPanelBottomInstances(); // Refresh only if open currently
                    }
                    
                    // Now update the class itself, where the instances came from
                    selected[0].mName = $(this).val();
                    
                    // Don't do anything with the code!  It isn't even updated yet.
                    // The user NEEDS to update his/her own code to match the new name, then save it.
                    // That save will add it to the system.
                    
                    // Update the bottom
                    if ($('#panelBottomInstances').hasClass('current-tab')) {
                        createPanelBottomInstancesSelect(selected[0].mName);
                    }
                    
                    // Update the left panel
                    createPanelLeftObjects();
                    changeCurrentListItem(selected[0].mID);
                    
                    alert("Remember to update all your code to match the new class name.");
                } else {
                    alert("Names must be unique.");
                    // Revert the name
                    cleanUpPanelRightBody();
                    if (!gRunning) {
                        // No need to update the current list item color
                        createDetailsObjects(selected[2]);
                    }
                    gLastSetName = selected[0].mName;
                }
            }
            
            // We are not going to tamper with the code, let the user do it (if he/she doesn't, the program should NOT crash until the program is run)
            
            break;
        case "panelRightObjectsX":
            if (selected[2] === 1 || selected instanceof GameObject) {
                xf.setXPos($(this).val());
            }
            break;
        case "panelRightObjectsY":
            if (selected[2] === 1 || selected instanceof GameObject) {
                xf.setYPos($(this).val());
            }
            break;
        case "panelRightObjectsW":
            if (selected[2] === 1 || selected instanceof GameObject) {
                xf.setWidth($(this).val());
            }
            break;
        case "panelRightObjectsH":
            if (selected[2] === 1 || selected instanceof GameObject) {
                xf.setHeight($(this).val());
            }
            break;
        case "panelRightObjectsRot":
            if (selected[2] === 1 || selected instanceof GameObject) {
                xf.setRotationInDegree($(this).val());
            }
            break;
        case "panelRightObjectsColor":
            if (selected[2] === 1 || selected instanceof GameObject) {
                var enteredColor = colorStringToRGBA($(this).val());
                var rend;
                if (selected[2] === 1) {
                    rend = selected[0].getRenderable();
                } else {
                    rend = selected.getRenderable();
                }
                rend.setColor(enteredColor);

                break;
            }
            break;
        case "panelRightScenesName":
            gLastSetName = $(this).val();
            var scene = gCurrentScene;
            if (!gGameCore.checkForNameConflictScene($(this).val())) {
                if ($(this).val() === "instances") {
                    $(this).val(gLastSetName);
                    alert('You cannot name a scene "instances."');
                } else if ($(this).val() === "cameras") {
                    $(this).val(gLastSetName);
                    alert('You cannot name a scene "cameras."');
                } else {
                    scene.mName = $(this).val();
                    createPanelBottomScenes();
                }
            } else {
                $(this).val(scene.mName);
                alert("Names must be unique.");
            }
            changeCurrentListItem(scene.mID);
            break;
        case "panelRightCamerasName":
            gLastSetName = $(this).val();
            if (!gGameCore.checkForNameConflictCamera($(this).val())) {
                var cam = gGameCore.getSelectedCamera();
                cam.mName = $(this).val();
                $('#panelBottomScenes').removeClass('current-tab');
                $('#panelBottomCameras').addClass('current-tab');
                $('#panelBottomInstances').removeClass('current-tab');
                createPanelBottomCameras();
            } else {
                $(this).val(gLastSetName);
                alert("Names must be unique.");
            }
            break;
        case "panelRightCamerasX":
            // Uses interpolation.  To not use interpolation, set the cam.mCameraState.mCenter.mCurrentValue directly.
            var cam = gGameCore.getSelectedCamera();
            var center = cam.getWCCenter();
            cam.setWCCenter($(this).val(), center[1]);
            break;
        case "panelRightCamerasY":
            // Uses interpolation.  To not use interpolation, set the cam.mCameraState.mCenter.mCurrentValue directly.
            var cam = gGameCore.getSelectedCamera();
            var center = cam.getWCCenter();
            cam.setWCCenter(center[0], $(this).val());
            break;
        case "panelRightCamerasW":
            // Uses interpolation.  To not use interpolation, set the cam.mCameraState.mCenter.mCurrentValue directly.
            var cam = gGameCore.getSelectedCamera();
            cam.setWCWidth($(this).val());
            break;
        case "panelRightCamerasVPX":
            var cam = gGameCore.getSelectedCamera();
            var vp = cam.getViewport();
            var vp2 = [$(this).val(), vp[1], vp[2], vp[3]];
            cam.setViewport(vp2);
            cam.mViewport = vp2;
            break;
        case "panelRightCamerasVPY":
            var cam = gGameCore.getSelectedCamera();
            var vp = cam.getViewport();
            var vp2 = [vp[0], $(this).val(), vp[2], vp[3]];
            cam.setViewport(vp2);
            cam.mViewport = vp2;
            break;
        case "panelRightCamerasVPW":
            var cam = gGameCore.getSelectedCamera();
            var vp = cam.getViewport();
            var vp2 = [vp[0], vp[1], $(this).val(), vp[3]];
            cam.setViewport(vp2);
            cam.mViewport = vp2;
            break;
        case "panelRightCamerasVPH":
            var cam = gGameCore.getSelectedCamera();
            var vp = cam.getViewport();
            var vp2 = [vp[0], vp[1], vp[2], $(this).val()];
            cam.setViewport(vp2);
            cam.mViewport = vp2;
            break;
        case "panelRightCamerasColor":
            var enteredColor = colorStringToRGBA($(this).val());
            var cam = gGameCore.getSelectedCamera();
            cam.setBackgroundColor(enteredColor);
            break;
        default:
            break;
    }
    
});

$('div').on('click', '.text-field', function() {
    switch($(this).attr('id')) {
        // Both color fields do the same thing -- open color picker
        case "panelRightCamerasColor":
        case "panelRightObjectsColor":
            $(this).colorpicker({format:'rgba'});
            break;
        default:
            break;
    }
});

var colorStringToRGBA = function(colorPickerString) {
    // We know the format of given string must be rgba(r,g,b,a) or r,g,b,a
    var colors;
    if (colorPickerString.startsWith("rgba(")) {
        // Format was: rgba(r,g,b,a) from 0-255
        colors = colorPickerString.split("rgba(")[1].split(")")[0].split(",");
        colors[0] /= 255;
        colors[1] /= 255;
        colors[2] /= 255;
    } else {
        // Format was: r,g,b,a from 0-1
        colors = colorPickerString.split(",");
        colors[0] *= 255;
        colors[1] *= 255;
        colors[2] *= 255;
    }
    return colors;
};

var windowResize = function() {
    var initWidth = 640.0;
    var initHeight = 480.0;
    var panelWidth = 234;
    
    $('#aceEditor').width($(window).width() - EDITOR_OFFSETS[0]);
    $('#aceEditor').height($(window).height() - EDITOR_OFFSETS[1]);
    $('#codeBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    $('#panelLeftBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    $('#panelRightBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    // Vars to resize the GLCanvas with
    var availableWidth = $(window).width() - (2 * panelWidth);
    var availableHeight = $(window).height() - 48 - panelWidth;
    var width = availableWidth;
    var height = availableHeight;
    
    // Resize to the dimension with the lowest proportion
    if (availableWidth / initWidth > availableHeight / initHeight) {
        width = (height / initHeight) * initWidth;  // Resize based on height
    } else {
        height = (width / initWidth) * initHeight;  // Resize based on width
    }

    // Set the proper width and height
    $('#GLCanvas').width(width);
    $('#GLCanvas').height(height);
    
    // Keep it centered (note: 219 and 229 are the w/h of the left/bottom panels including their white space)
    $('#GLCanvasDiv').css('left', 219 + (availableWidth / 2) - (width / 2));
    $('#GLCanvasDiv').css('bottom', 229 + (availableHeight / 2) - (height / 2));
    
    // If the window is resized too thin such that the right panel has no room, just hide it
    if ($(window).width() < panelWidth * 2) {
        $('#panelRightBody').hide();
    } else {
        $('#panelRightBody').show();
    }
};

window.onresize = function(event) {
    windowResize();
};

var createFloatingCodeEditor = function(yourObject) {
    var indexToAdd = gZIndex;
    var editorName = "floatingEditor" + indexToAdd;
    
    // Hash map used for making checking if the editor is already opened, and if so, make the right editor appear on top
    if (typeof(gEditorMap[yourObject[0].mID]) !== "undefined") {
        // Already opened!  Just make it appear on top so the user can find it.
        gZIndex++;
        $('#' + gEditorMap[yourObject[0].mID]).css('z-index', gZIndex); // Just use gZIndex to track the highest z-index value we can use
        gZIndex++;
        return;
    } else {
        // New hash
        gEditorMap[yourObject[0].mID] = editorName;
    }
    
    var headerName = "codeHeader" + indexToAdd;
    var bodyName = "codeBody" + indexToAdd;
    var aceName = "aceEditor" + indexToAdd;
    var okName = "codeOK" + indexToAdd;
    var cancelName = "codeCancel" + indexToAdd;
    var navBottomName = "navBarBottom" + indexToAdd;
    var objName = "";
    if (typeof(yourObject[0].mName) === 'undefined' || yourObject[0].mName === "") {
        objName = "Unnamed object";
    } else {
        objName = yourObject[0].mName;
    }
    
    // Make the code editor as a new div in the document body
    $('body').append('<div id="' + editorName + '"></div>');
    var codeEditor = $('#' + editorName);
    codeEditor.css('box-shadow', '4px 4px 4px 4px rgba(0,0,0,0.4)');
    codeEditor.css('z-index', gZIndex);
    gZIndex++; // Done with this index now, increment it for the next use
    codeEditor.draggable({cancel: '#' + aceName});  // Make it draggable, but NOT the editor (the user may want to highlight text!)
    codeEditor.css('position', 'absolute').css('left', '0px').css('top', '0px');
    codeEditor.append('<ul class="floating-nav-menu" id="' + headerName + '">' +
            '<li class="header-text-only">Code Editor (' + objName + ')</li>' +
            '</ul>');
        
    // If you mousedown (covers both click + drag cases) the panel (e.g. you were selecting a different editor), make it appear on top!
    codeEditor.mousedown(function() {
        gZIndex++;
        codeEditor.css('z-index', gZIndex); // Just use gZIndex to track the highest z-index value we can use
        gZIndex++;
    });
       
    // Make the body of the code editor
    codeEditor.append('<ul class="floating-panel-body" id="' + bodyName + '"></ul>');
    
    // Create a separate area within the panel for the editor
    var code = yourObject[1];
    
    var editorArea = $('#' + bodyName);
    var editorDiv = $('<div id="' + aceName + '">' + code + '</div>');
    editorArea.append(editorDiv);
    
    // Set up the editor
    var editor = ace.edit(aceName);
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
    
    // Set a size for it
    editorDiv.width(800);
    editorDiv.height(600);
    editorDiv.css('position', 'relative').css('top', '0px');
    editorArea.height(664);
    
    // Add a button at the bottom
    editorArea.append('<br>');
    editorArea.append('<ul class="floating-nav-menu" id="' + navBottomName + '">' +
            '<li id="' + okName + '"><a href="#">OK</a></li>' +           // Places this on the farthest right
            '<li id="' + cancelName + '"><a href="#">Cancel</a></li>' +   // Left of the OK button
            '</ul>');
    $('#' + okName).css('float', 'right');
    $('#' + cancelName).css('float', 'right');
    
    // Add the function directly to it
    $('#' + okName).click(function() {
        // Get editor contents as a string
        var result = editor.getValue();
        
        // First set the code for the object only (so it's saved and the user can come back to it)
        yourObject[1] = result;
        
        var msg = "";

        try {
            // Puts code into system
            eval(result);
            
            // Update all instances to reference the new code (or else they'll still run old code)
            var scenes = gGameCore.getSceneList();
            var instances, i, j;
            for (i = 0; i < scenes.length; i++) {
                var instances = scenes[i].getInstanceList();
                for (j = 0; j < instances.length; j++) {
                    if (instances[j].mName === yourObject[0].mName) { // Cannot use instanceof to check the actual class name
                        if (instances[j] instanceof GameObject) { // Instanceof to check if it is a GO or class
                            // Re-create the functions (just like obj instantiation)
                            
                            // Get old values while you still can
                            var xf2 = instances[j].getXform();
                            var color = instances[j].getRenderable().getColor();
                            var id = instances[j].mID;
                            
                            // Re-create it
                            eval("instances[j] = new " + yourObject[0].mName + "(new Renderable());");
                            
                            // Mimic the xform
                            var xf = instances[j].getXform();
                            xf.setXPos(xf2.getXPos());
                            xf.setYPos(xf2.getYPos());
                            xf.setWidth(xf2.getWidth());
                            xf.setHeight(xf2.getHeight());
                            xf.setRotationInDegree(xf2.getRotationInDegree());
                        
                            var rend = instances[j].getRenderable();
                            rend.setColor(color);
                        
                            instances[j].mName = yourObject[0].mName;
                            instances[j].mID = id;
                        } else {
                            // Get old values while you still can
                            var id = instances[j].mID;
                            
                            // Re-create it
                            eval("instances[j] = new " + yourObject[0].mName + "(new Renderable());");
                        
                            instances[j].mName = yourObject[0].mName;
                            instances[j].mID = id;
                        }
                    }
                }
            }
            
            msg = "Code saved!";
        } catch (error) {
            msg = "Your code contains an error.  Please review.\n\n" + error;
        }
        
        // Remove the editor
        codeEditor.remove();
        delete gEditorMap[yourObject[0].mID];
        alert(msg);       
    });
    $('#' + cancelName).click(function() {
        // Remove the editor
        codeEditor.remove();
        delete gEditorMap[yourObject[0].mID];
    });
};

var createPanelLeft = function() {
    // Make the panel
    var panelLeft = $('#panelLeft');
    /*panelLeft.append('<ul class="nav-menu">' +
            '<li><a href="#" id="panelLeftObjects"><span class="glyphicon glyphicon-glass"></span>&nbsp Objects</a></li>' +
            '<li><a href="#" id="panelLeftTextures"><span class="glyphicon glyphicon-camera"></span>&nbsp Textures</a></li>' +
            '</ul>');
    
    // Add the function directly to it
    $('#panelLeftObjects').click(function() {
        createPanelLeftObjects();
        $('#panelLeftObjects').addClass('current-tab');
        $('#panelLeftTextures').removeClass('current-tab');
    });
    $('#panelLeftTextures').click(function() {
        createPanelLeftTextures();
        $('#panelLeftObjects').removeClass('current-tab');
        $('#panelLeftTextures').addClass('current-tab');
    });
    
    // Default tab
    $('#panelLeftObjects').addClass('current-tab');*/
    createPanelLeftObjects();
	createPanelLeftTextures();
};

var createPanelLeftObjects = function() {
    // Now add the UL for the body
    var objectsTab = $('#tab1');
        
    //$('#panelLeftObjectsBody').remove();
    
    objectsTab.append('<ul class="panel-body" id="panelLeftObjectsBody">' +
            '<li><a href="#" id="panelLeftAddGameObject">+ Object</a></li><br><br><p>' +
            '</ul>');
    
    var panelLeftBody = $('#panelLeftObjectsBody');
    var i;
    var list = gGameCore.getObjectList();
    
    for (i = 0; i < list.length; i++) {
        // Reload the contents
        panelLeftBody.append('<li class="panel-list-item" id="' + list[i][0].mID + '">' + list[i][0].mName + '</li><p id="' + list[i][0].mID + 'p"><br id="' + list[i][0].mID + 'br">');
    }
    
    //panelLeftBody.css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    if (gCurrentListItem !== null && gCurrentListItem.attr('id').startsWith("objectListItem")) {
        changeCurrentListItem(gCurrentListItem.attr('id'));
    }
    
    $('#panelLeftAddGameObject').click(function() {
        gGameCore.createDefaultObject(gNextObjectID, 1);
        panelLeftBody.append('<li class="panel-list-item" id="objectListItem' + gNextObjectID + '">GameObj' + gNextObjectID + '</li><p id="objectListItem' + gNextObjectID + 'p"><br id="objectListItem' + gNextObjectID + 'br">');
        if (!gRunning) {
            changeCurrentListItem('objectListItem' + gNextObjectID);
        }
        // Finally increment the ID
        gNextObjectID++;
    });
};

var createPanelLeftTextures = function() {
    // Now add the UL for the body
    var panelLeft = $('#tab2');
    
   
    panelLeft.append('<ul class="panel-body" id="panelLeftObjectsBody">' +
            '<li><a href="#" id="panelLeftAddTexture">+ Texture</a></li><br><br><p>' +
            '</ul>');
    
    var panelLeftBody = $('#panelLeftObjectsBody');
    var i;
    var list = gGameCore.getTextureList();
    
    /*
    for (i = 0; i < list.length; i++) {
        // Reload the contents; see how other panels do it and mimic it for texture
    }*/
    
    panelLeftBody.css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    if (gCurrentListItem !== null && gCurrentListItem.attr('id').startsWith("textureListItem")) {
        changeCurrentListItem(gCurrentListItem.attr('id'));
    }
    
    $('#panelLeftAddTexture').click(function() {
        // See other panels add items and mimic it for texture
        alert("Clicked + Texture");
    });
};

var createPanelRight = function() {
    // Make the panel
    var panelRight = $('#tab6');
    panelRight.append('<ul class="nav-menu">' +
            '<li><a id="panelRightDetails" class="current-tab"><span class="glyphicon glyphicon-cog"></span>&nbsp Details</a></li>' +
            '</ul>');
    
    cleanUpPanelRightBody();
};

var cleanUpPanelRightBody = function() {
    // REMOVES (if any) and RE-CREATES the panel right body
    
    // Remove it if it exists
    $('#panelRightBody').remove();
    
    // Add a blank body
    $('#tab6').append('<ul class="panel-body" id="panelRightBody"></ul>');
    $('#panelRightBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
};

var createDetailsObjects = function(type) {
    // Called after cleanUpPanelRightBody to set up the panel for a new object
    
    // Now add the UL for the body
    var panelRightBody = $('#panelRightBody');
    
    panelRightBody.append('<font color="black">Is GameObject? </font><input type="checkbox" id="panelRightObjectsToggleGO" onclick="toggleGO(this, ' + type + ');"><br><br>' +
            '<font color="black">Name</font><span><input type="text" class="text-field" id="panelRightObjectsName"/></span><br><br>' +
            '<font color="black">X / Y</font><span><input type="text" class="text-field" id="panelRightObjectsY"/></span>' +    // Note: Y is before X and W is before H, but after right-align, it goes in the proper order
            '<span><input type="text" class="text-field" id="panelRightObjectsX"/></span><br><br>' +
            '<font color="black">W / H</font><span><input type="text" class="text-field" id="panelRightObjectsH"/></span>' +
            '<span><input type="text" class="text-field" id="panelRightObjectsW"/></span><br><br>' +
            '<font color="black">Rot</font><span><input type="text" class="text-field" id="panelRightObjectsRot"/></span><br><br><br><br>' +
            '<font color="black">Color</font><span><input type="text" class="text-field" id="panelRightObjectsColor"/></span><br><br>' +
            '<font color="black" id="panelRightObjectsTextureText">Texture&nbsp</font><select id="panelRightObjectsTexture"><option value="TempTexture1">TempTexture1</option><option value="TempTexture2">TempTexture2</option></select>' +
            '<li><a href="#" id="panelRightObjectsAddTexture">+</a></li><br><br><br><br>'
            );
    
    // Only append code editor if it is not an instance
    if (type < 2) {
        panelRightBody.append('<li><a href="#" id="panelRightObjectsEditCode"><span class="glyphicon glyphicon-pencil"></span>&nbsp Edit Code</a></li>');
    }
    
    var selected = gGameCore.getSelected();
    
    $('#panelRightObjectsTextureText').css('float', 'left');
    $('#panelRightObjectsTexture').css('float', 'left');
    $('#panelRightObjectsAddTexture').css('float', 'right').css('height', '1px').css('line-height', '0px');
    
    $('#panelRightObjectsAddTexture').click(function() {
        alert("+ Texture clicked\nYou selected: " + $('#panelRightObjectsTexture').val());
    });
    
    // Edit code button
    $('#panelRightObjectsEditCode').click(function() {
        createFloatingCodeEditor(selected);
    });
    
    // Checkbox
    var set = false;
    if (type === 1 || type === 3) {
        set = true;
    }
    document.getElementById('panelRightObjectsToggleGO').checked = set;
    
    // Set the name
    if (type > 1) {
        gLastSetName = selected.mName; // Instances do it differently
        $('#panelRightObjectsName').attr('readonly', true); // Instances cannot rename
        $('#panelRightObjectsName').css('background-color', '#bbbbbb');
        $('#panelRightObjectsToggleGO').bind('click', false); // Instances cannot change the type on the checkbox
        $('#panelRightObjectsName').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(gLastSetName + " (instance)");
    } else {
        gLastSetName = selected[0].mName;
        $('#panelRightObjectsName').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(gLastSetName);
    }
        
    if (type === 1 || type === 3) { // GO or instance of GO
        var xf, oldColor;
        if (type === 1) {
            xf = selected[0].getXform();
            oldColor = selected[0].getRenderable().getColor();
        } else {
            xf = selected.getXform();
            oldColor = selected.getRenderable().getColor();
        }
        $('#panelRightObjectsX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getXPos());
        $('#panelRightObjectsY').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getYPos());
        $('#panelRightObjectsW').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getWidth());
        $('#panelRightObjectsH').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getHeight());
        $('#panelRightObjectsRot').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(xf.getRotationInDegree());
        var newColor = [oldColor[0] * 255, oldColor[1] * 255, oldColor[2] * 255, oldColor[3]];
        $('#panelRightObjectsColor').css('width', DETAILS_OBJECTS_OFFSETS[0] + 3 + 'px').val("rgba(" + newColor + ")");
        $('#panelRightObjectsColor').colorpicker({format:'rgba'});
    } else if (type === 0 || type === 2) { // Class or instance of Class
        $('#panelRightObjectsX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px');
        $('#panelRightObjectsY').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px');
        $('#panelRightObjectsW').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px');
        $('#panelRightObjectsH').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px');
        $('#panelRightObjectsRot').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px');
        $('#panelRightObjectsColor').css('width', DETAILS_OBJECTS_OFFSETS[0] + 3 + 'px');
        $('#panelRightObjectsColor').colorpicker({format:'rgba'});
    }
    
    $('#panelRightObjectsTexture').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px');
};

var createDetailsScenes = function() {
    // Called after cleanUpPanelRightBody to set up the panel for a new scene
    
    // Now add the UL for the body
    var panelRightBody = $('#panelRightBody');
    
    panelRightBody.append('<font color="black">Name</font><span><input type="text" class="text-field" id="panelRightScenesName"/></span>');
    $('#panelRightScenesName').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(gCurrentScene.mName);
};

var createDetailsCameras = function() {
    // Called after cleanUpPanelRightBody to set up the panel for a new camera
    
    // Now add the UL for the body
    var panelRightBody = $('#panelRightBody');
    
    panelRightBody.append('<font color="black">Name</font><span><input type="text" class="text-field" id="panelRightCamerasName"/></span><br><br><br>' +
            '<font color="black">WC</font><br><br>' +
            '<font color="black">X / Y</font><span><input type="text" class="text-field" id="panelRightCamerasY"/></span>' +    // Note: Y is before X and W is before H, but after right-align, it goes in the proper order
            '<span><input type="text" class="text-field" id="panelRightCamerasX"/></span><br><br>' +
            '<font color="black">W </font><span><input type="text" class="text-field" id="panelRightCamerasW"/></span><br><br><br>' +
            
            '<font color="black">Viewport</font><br><br>' +
            '<font color="black">X / Y</font><span><input type="text" class="text-field" id="panelRightCamerasVPY"/></span>' +
            '<span><input type="text" class="text-field" id="panelRightCamerasVPX"/></span><br><br>' +
            '<font color="black">W / H</font><span><input type="text" class="text-field" id="panelRightCamerasVPH"/></span>' +
            '<span><input type="text" class="text-field" id="panelRightCamerasVPW"/></span><br><br><br><br>' +
            '<font color="black">Color</font><span><input type="text" class="text-field" id="panelRightCamerasColor"/></span>'
            );
    
    var cam = gGameCore.getSelectedCamera();
    if (cam !== null && cam instanceof Camera) {
        var wc = cam.getWCCenter();
        var vp = cam.getViewport();
        $('#panelRightCamerasName').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(cam.mName);
        $('#panelRightCamerasX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(wc[0]);
        $('#panelRightCamerasY').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(wc[1]);
        $('#panelRightCamerasW').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(cam.getWCWidth());
        $('#panelRightCamerasVPX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(vp[0]);
        $('#panelRightCamerasVPY').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(vp[1]);
        $('#panelRightCamerasVPW').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(vp[2]);
        $('#panelRightCamerasVPH').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(vp[3]);
        var oldColor = cam.getBackgroundColor();
        var newColor = [oldColor[0] * 255, oldColor[1] * 255, oldColor[2] * 255, oldColor[3]];
        $('#panelRightCamerasColor').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val("rgba(" + newColor + ")");
        $('#panelRightCamerasColor').colorpicker({format:'rgba'});
    } else {
        cleanUpPanelRightBody(); // This is just in case no camera is selected (not possible with current design)
    }
};

var createPanelBottom = function() {
    // Make the panel
    /*var panelBottom = $('#panelBottom');
    panelBottom.append('<ul class="nav-menu">' +
            '<li><a href="#" id="panelBottomScenes"><span class="glyphicon glyphicon-picture"></span>&nbsp Scenes</a></li>' +
            '<li><a href="#" id="panelBottomCameras"><span class="glyphicon glyphicon-facetime-video"></span>&nbsp Cameras</a></li>' +
            '<li><a href="#" id="panelBottomInstances"><span class="glyphicon glyphicon-user"></span>&nbsp Instances</a></li>' +
            '</ul>');
    
    $('#panelBottomScenes').click(function() {
        $('#panelBottomScenes').addClass('current-tab');
        $('#panelBottomCameras').removeClass('current-tab');
        $('#panelBottomInstances').removeClass('current-tab');
        createPanelBottomScenes();
    });
    $('#panelBottomCameras').click(function() {
        $('#panelBottomScenes').removeClass('current-tab');
        $('#panelBottomCameras').addClass('current-tab');
        $('#panelBottomInstances').removeClass('current-tab');
        createPanelBottomCameras();
    });
    $('#panelBottomInstances').click(function() {
        $('#panelBottomScenes').removeClass('current-tab');
        $('#panelBottomCameras').removeClass('current-tab');
        $('#panelBottomInstances').addClass('current-tab');
        createPanelBottomInstances();
    });
    
    // Default
    $('#panelBottomScenes').addClass('current-tab');*/
    createPanelBottomScenes();
	createPanelBottomCameras();
	createPanelBottomInstances();
};

var createPanelBottomScenes = function() {
    
    $('#tab3').append('<ul class="panel-body" id="panelBottomBody">' +
            '<li><a href="#" id="panelBottomScenesAddScene">+ Scene</a></li></ul>');
    $('#panelBottomBody').css('position', 'fixed').css('bottom', '0').css('height', '186px').css('width', '100%').css('z-index', '-1');
    
    var list = gGameCore.getSceneList(); // These are all instances -- they are NOT inside arrays at index 0
    var i;
    for (i = 0; i < list.length; i++) {
        // Add all instances
        $('#panelBottomBody').append('<li class="panel-list-item" id="' + list[i].mID + '"> &nbsp&nbsp&nbsp' + list[i].mName + '</li>');
    }
    
    if (gCurrentListItem !== null && gCurrentListItem.attr('id').startsWith("sceneListItem")) {
        changeCurrentListItem(gCurrentListItem.attr('id'));
    }
    
    $('#panelBottomScenesAddScene').click(function() {
        gGameCore.createDefaultScene(gNextSceneID);
        gNextSceneID++;
        createPanelBottomScenes();
        if (!gRunning) {
            changeCurrentListItem(list[list.length - 1].mID);
        }
    });
};

var createPanelBottomCameras = function() {
    
    // The panel will be devoid of UI if there are no scenes
    if (gCurrentScene.mID === "sceneListItemBlank") {
        $('#tab3').append('<ul class="panel-body" id="panelBottomBody"></ul>');
        return;
    }
    
    $('#tab4').append('<ul class="panel-body" id="panelBottomBody">' +
            '<li><a href="#" id="panelBottomScenesAddCamera">+ Camera</a></li></ul>');
    $('#panelBottomBody').css('position', 'fixed').css('bottom', '0').css('height', '186px').css('width', '100%').css('z-index', '-1');
    
    var list = gGameCore.getCameraList(); // These are all instances -- they are NOT inside arrays at index 0
    var i;
    for (i = 0; i < list.length; i++) {
        // Add all instances
        $('#panelBottomBody').append('<li class="panel-list-item" id="' + list[i].mID + '"> &nbsp&nbsp&nbsp' + list[i].mName + '</li>');
    }
    
    if (gCurrentListItem !== null && gCurrentListItem.attr('id').startsWith("cameraListItem")) {
        changeCurrentListItem(gCurrentListItem.attr('id'));
    }
    
    $('#panelBottomScenesAddCamera').click(function() {
        gGameCore.createDefaultCamera(gCurrentScene.mNextCameraID);   // GC increments ID and refreshes panel
    });

};

var createPanelBottomInstances = function() {
    
    // The panel will be devoid of UI if there are no scenes
    if (gCurrentScene.mID === "sceneListItemBlank") {
        $('#tab5').append('<ul class="panel-body" id="panelBottomBody"></ul>');
        return;
    }
    
    $('#tab5').append('<ul class="panel-body" id="panelBottomBody">' +
            '<ul id="panelBottomBodySelectArea"></ul>' +
            '</ul>');
    
    var panelBottomBody = $('#panelBottomBody');
    panelBottomBody.css('position', 'fixed').css('bottom', '0').css('height', '186px').css('width', '100%').css('z-index', '-1');
    $('#panelBottomBodySelectArea').css('list-style-type', 'none').css('margin', '0').css('padding', '0');
    
    if (gGameCore.getObjectList().length < 1 || gGameCore.getSelected() === null) {
        createPanelBottomInstancesSelect("");
    } else if (gGameCore.getSelected().length === 3) {
        createPanelBottomInstancesSelect(gGameCore.getSelected()[0].mName);
    } else {
        createPanelBottomInstancesSelect(gGameCore.getSelected().mName);
    }
    
    var list = gGameCore.getInstanceList(); // These are all instances -- they are NOT inside arrays at index 0
    var i;
    for (i = 0; i < list.length; i++) {
        // Add all instances
        $('#panelBottomBody').append('<li class="panel-list-item" id="' + list[i].mID + '"> &nbsp&nbsp&nbsp' + list[i].mName + '</li>');
    }
    
    if (gCurrentListItem !== null && gCurrentListItem.attr('id').startsWith("instanceListItem")) {
        changeCurrentListItem(gCurrentListItem.attr('id'));
    }
    
};

var createPanelBottomInstancesSelect = function(defaultOption) {
    $('#panelBottomInstancesSelect').remove();
    $('#panelBottomScenesAddInstance').remove();
    $('#panelBottomBodySelectArea').append('<select id="panelBottomInstancesSelect"></select>' + 
            '<li><a href="#" id="panelBottomScenesAddInstance">+</a></li>');
    
    $('#panelBottomInstancesSelect').css('float', 'left');
    
    // Fill the drop down
    var i;
    var classes = $('#panelBottomInstancesSelect');
    var objects = gGameCore.getObjectList();
    
    if (objects.length < 1) {
        classes.append('<option value="noClass">(empty)</option>');
    } else {
        for (i = 0; i < objects.length; i++) {
            var className = objects[i][0].mName;
            classes.append('<option value="' + className + '">' + className + '</option>');
        }
    }
    
    // Set the current option
    if (defaultOption !== "") {
        $('#panelBottomInstancesSelect').val(defaultOption);
    }
     
    // + Instance button
    $('#panelBottomScenesAddInstance').click(function() {
        var name = $('#panelBottomInstancesSelect').val();
        if (name !== "noClass") {
            
            
            var inst;
            var obj;
            var itr;
            var list = gGameCore.getObjectList();
            for (itr = 0; itr < list.length; itr++) {
                if (list[itr][0].mName === name) {  // The name variable is a class name
                    obj = list[itr][0];
                }
            }
            var isGO = obj instanceof GameObject;

            
            if (isGO) {
                // Create
                eval("inst = new " + name + "(new Renderable());");
                // Mimic the xform
                var xf = inst.getXform();
                var xf2 = obj.getXform();
                xf.setXPos(xf2.getXPos());
                xf.setYPos(xf2.getYPos());
                xf.setWidth(xf2.getWidth());
                xf.setHeight(xf2.getHeight());
                xf.setRotationInDegree(xf2.getRotationInDegree());
                        
                var rend = inst.getRenderable();
                rend.setColor(obj.getRenderable().getColor());
                        
                inst.mName = name;
                inst.mID = "instance" + obj.mID.substring(obj.mID.indexOf("L"), obj.mID.length) + "_" + gNextInstanceID;
                gNextInstanceID++;
            } else { // Must be 0; a class
                eval("inst = new " + name + "();");
                inst.mName = name;
                // So something like, instanceListItem<number>_<unique instance number>
                // Instances will be able to track their Class/GO by name, which is updated appropriately.  ID is just for the UI.
                inst.mID = "instance" + obj.mID.substring(obj.mID.indexOf("L"), obj.mID.length) + "_" + gNextInstanceID;
                gNextInstanceID++;
            }
                    
            // Add
            gGameCore.addInstance(inst);
            // Also selects it
            gGameCore.setSelected(inst);
            cleanUpPanelRightBody();
            var type = 2;
            if (inst instanceof GameObject) {
                type = 3;
            }
            $('#panelBottomScenes').removeClass('current-tab');
            $('#panelBottomCameras').removeClass('current-tab');
            $('#panelBottomInstances').addClass('current-tab');
            createPanelBottomInstances();
            createPanelBottomInstancesSelect(inst.mName);
            if (!gRunning) {
                changeCurrentListItem(inst.mID);
                createDetailsObjects(type); // 2 = instance
            }
        }
    });
};

var toggleGO = function(box, type) {
    if (type > 1 || !confirm("Warning:\nChanging the type will reset the code to default.\n\Change type anyways?")) {
        // Return on instances (not allowed)
        // Otherwise, after checking for non-instance, prompt the user to check if sure it is ok to reset
        box.checked = !box.checked;
        return;
    }
    
    var selected = gGameCore.getSelected();
    var oldID = selected[0].mID + "";
    var oldName = selected[0].mName + "";
        
    // When you check the box to change an object from GO/class
    if (box.checked) {
        // Resets the code to a default code for GO
        window[oldName] = function(renderableObj) {
            GameObject.call(this, renderableObj);
        };
            
        gEngine.Core.inheritPrototype(window[oldName], window["GameObject"]);
        
        var code = getDefaultCodeGO(oldName);
        
        // Add code to system
        eval(code);
            
        // Make a default xform
        var xf = selected[0].getXform();
        xf.setXPos(20);
        xf.setYPos(60);
        xf.setWidth(5);
        xf.setHeight(5);
        selected[0].mName = oldName;
        selected[0].mID = oldID;
        selected[1] = code;
        selected[2] = 1;
    } else {
        // Resets the code to a default code for a class
        var code = getDefaultCodeClass(oldName, oldID);
        //var code = selected[1];
        //var constructor = getDefaultCodeClass(oldName, oldID);
        
        window[oldName] = function() {
            
        };
        
        eval(code);
        //eval(constructor);
        //selected[1] = constructor + "\n\n" + code;
        selected[1] = code;
        selected[2] = 0;
    }
    
    // Refresh
    cleanUpPanelRightBody();
    var newType = 0;
    if (box.checked === true) {
        newType = 1;
    }
    if (!gRunning) {
        // No need to update the current list item color
        createDetailsObjects(newType);
    }
    
    // No need to change the instances of either
    // The user could decide to have many classes if he/she so chooses
    // The xf values don't need to be changed either
};

var refreshAllPanels = function() {
    createPanelLeftObjects();
    cleanUpPanelRightBody();
    createPanelBottomScenes();
    $('#panelBottomScenes').addClass('current-tab');
    $('#panelBottomCameras').removeClass('current-tab');
    $('#panelBottomInstances').removeClass('current-tab');
};

var cleanUpGameCore = function() {
    // Close (delete) all code editor windows that are open
    for (var i in gEditorMap) {
        $('#' + gEditorMap[i]).remove();
        delete gEditorMap[i];
    }
    
    // Rest the vars (for loading)
    var objList = gGameCore.getObjectList();
    objList.splice(0, objList.length);
    var sceneList = gGameCore.getSceneList();
    sceneList.splice(0, sceneList.length);
    var textureList = gGameCore.getTextureList();
    textureList.splice(0, textureList.length);
    var selectedItem = gGameCore.getSelected();
    selectedItem = null;
    gEngine.GameLoop.stop();
    gGameCore.runBlankScene();
    
    gLastSetName = "";          // For reverting names
    gRightClickedItem = null;   // For tracking which item was clicked from the menu
    gNextObjectID = 0;          // For making unique IDs
    gNextInstanceID = 0;        // ""
    gNextSceneID = 0;           // Since one scene is provided at the start
    gRunning = false;           // If true, the update function will be called each game loop
    $('#menuRun').css('background-color', '#ab9b97');
    gCurrentListItem = null;
    
    refreshAllPanels();
};

var loadMisc = function(files, callback) {
    // Global vars
    files.folder("Misc").forEach(function(relativePath, file) {
        // Read the ZipObject item as a JSON file, and then store the information where it belongs
        files.file(file.name).async("string").then(function success(content) {
            var data = JSON.parse(content);
            gNextObjectID = data[0];
            gNextInstanceID = data[1];
            gNextSceneID = data[2];
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
    // Objects
    files.folder("Objects").forEach(function(relativePath, file) {
        // Read the ZipObject item as a JSON file, and then store the information where it belongs
        files.file(file.name).async("string").then(function success(content) {
            
            var data = JSON.parse(content);
            var obj;
            // Put code in system so it can recognize it before making objects
            eval(data[1]);
            var className = relativePath.substring(0, relativePath.lastIndexOf(".")); // Just get rid of .json
            eval("obj = new " + className + "(new Renderable());");
            var entry = [obj, data[1], data[2]];
            obj.mID = data[0];
            obj.mName = className;
            // If it is a GO
            if (data[2] === 1) {
                var xf = obj.getXform();
                xf.setXPos(data[3]);
                xf.setYPos(data[4]);
                xf.setWidth(data[5]);
                xf.setHeight(data[6]);
                xf.setRotationInDegree(data[7]);
                obj.getRenderable().setColor(data[8]);
            }
            
            // Add entry
            var list = gGameCore.getObjectList();
            list.push(entry);
            createPanelLeftObjects();
        }, function error(error) {
            throw "There were issues with loading your file.\n\nErrors:\n" + error;
        });
    });
    callback();
};

var loadScenes = function(files, callback) {
    // Scenes (scenes, cameras, and instances)
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
            
            var sceneList = gGameCore.getSceneList();
            sceneList.push(currentScene);
            gGameCore.selectScene(sceneList.length - 1); // This starts the scene
        } else {
            //files.folder("Scenes").folder(sceneName).forEach(function(relativePath2, file2) {
            files.file(file.name).async("string").then(function success(content) {
                var data = JSON.parse(content);
                var sceneName = relativePath.substring(0, relativePath.indexOf("/"));

                if (relativePath.endsWith("cameras.json")) {
                    // This file contains (unless the user modified it) the data for every camera in the scene
                    var i = 0;
                    
                    // Cameras auto-add themselves to gCurrentScene once created, so we need the scene selected first
                    var idx = gGameCore.getSceneIndexByName(sceneName);
                    gGameCore.selectScene(idx);
                    gCurrentScene.mAllCamera = [];
                    
                    while (typeof(data[i]) !== "undefined") {
                        
                        // Note: new cameras are automatically added to mAllCamera
                        var cam = new Camera(
                            vec2.fromValues(data[i + 2][0], data[i + 2][1]),    // position of the camera
                            data[i + 3],                                        // width of camera
                            data[i + 4]                                         // viewport (orgX, orgY, width, height));
                        );
                
                        // Modify the camera some more
                        gCurrentScene.mAllCamera[i / 6].setBackgroundColor(data[i + 5]);
                        gCurrentScene.mAllCamera[i / 6].mName = data[i];
                        gCurrentScene.mAllCamera[i / 6].mID = data[i + 1];
                        
                        i += 6;
                    }
                    // Select the first scene when this process is done
                    gGameCore.selectScene(0);
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
                        gGameCore.getSceneByName(sceneName).addInstance(inst);
                        i += 8;
                    }
                } else if (relativePath.endsWith(".json")) {
                    // Unless the user inserted a .json, this is the scene file
                    var theScene = gGameCore.getSceneByName(sceneName);
                    theScene.mName = relativePath.substring(0, relativePath.lastIndexOf("/"));
                    theScene.mID = data[0];
                    theScene.mNextCameraID = data[1];
                    
                    createPanelBottomScenes();
                }
            }, function error(error) {
                throw "There were issues with loading your file.\n\nErrors:\n" + error;
            });
        }        
    });
    callback();
};

var changeCurrentListItem = function(id) {
    // For highlighting the selected item in a beige color
    var component = $('#' + id);
    if (component !== null) {
        if (gCurrentListItem !== null) {
            gCurrentListItem.removeClass('current-list-item');
        }
        component.addClass('current-list-item');
        gCurrentListItem = component;
    }
};

var logArray = function(arr) {
    if (typeof(arr) === "undefined") {
        return;
    }
    // Utility function for printing the contents of an array
    var result = "[";
    var i;
    for (i = 0; i < arr.length; i++) {
        result += arr[i];
        if (i + 1 < arr.length) {
            result += ",";
        }
    }
    console.log(result + "]");
};

// Below are useful functions for the user of the game

var instantiate = function(inst) {
    // A function for instantiating to the scene
    if (gCurrentScene instanceof ClientScene) {
        gCurrentScene.addInstance(inst);
    }
};

var move = function(go, x, y) {
    // A function that can be called by the user's code to move a GO
    if (go instanceof GameObject) {
        var xf = go.getXform();
        xf.setXPos(xf.getXPos() + x);
        xf.setYPos(xf.getYPos() + y);
    }
};

var switchScene = function(name) {
    // A function that can be called by the user's code to switch scenes
    var i;
    var list = gGameCore.getSceneList();
    for (i = 0; i < list.length; i++) {
        if (list[i].mName === name) {
            gEngine.GameLoop.stop();
            gCurrentScene = list[i];
            gEngine.Core.startScene(gCurrentScene);
            if (!gRunning) {
                changeCurrentListItem(gCurrentScene.mID);
                cleanUpPanelRightBody();
                createDetailsScenes();
            }
            break;
        }
    }
};