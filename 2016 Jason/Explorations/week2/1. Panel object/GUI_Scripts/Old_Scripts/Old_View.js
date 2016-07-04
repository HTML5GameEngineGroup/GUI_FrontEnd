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
// var gNextObjectID = 0;          // For making unique IDs
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

    // createPanelLeft();
    // createPanelRight();
    // createPanelBottom();
    // // Resize the window once to make everything fit
    // windowResize();
});

// this is run on right click of menu?
$(document).on('contextmenu', 'li', function(event) {
    // Checks out the id of the HTML element (also same as mID) and will provide the appropriate right-click menu
    // (since another function blocks the default one)
    var id = this.id;
    console.log("right clicked the li object i think?");
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

// this is run when you click a menu option!
$('.right-click-menu li').click(function(){
    console.log("INSIDE RIGHT CLICK MENU");
    // When a right-click menu option is clicked
    switch($(this).attr("name")) {
        case "objectsMenuDetails":
            $('#panelLeftObjectsBody li').each(function(index) {
                console.log("objectsMenuDetails");
                console.log(index);
                if ($(this).attr('id') === gRightClickedItem) {
                    // Basically just selects the item; gGameCore will refresh and set up the details panel anew
                    gGameCore.select(index - 1);
                }
            });
            break;
        case "objectsMenuEditCode":
            $('#panelLeftObjectsBody li').each(function(index) {
                console.log(index);
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

var createPanelLeft = function() {
    // Make the panel
    var panelLeft = $('#panelLeft');

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
        panelLeftBody.append(
            '<li class="panel-list-item" id="objectListItem' + gNextObjectID + '">GameObj' + gNextObjectID + '</li>' +
            '<p id="objectListItem' + gNextObjectID + 'p">' +
            '<br id="objectListItem' + gNextObjectID + 'br">');
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
            
        gEngine.View.inheritPrototype(window[oldName], window["GameObject"]);
        
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
    gCurrentListItem = null;
    
    refreshAllPanels();
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
            gEngine.View.startScene(gCurrentScene);
            if (!gRunning) {
                changeCurrentListItem(gCurrentScene.mID);
                cleanUpPanelRightBody();
                createDetailsScenes();
            }
            break;
        }
    }
};