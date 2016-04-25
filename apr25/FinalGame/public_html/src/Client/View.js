/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene, GameCore, GameObject */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gGameCore = null;

var gLastSetName = "";
var gRightClickedItem = null;
var gNextObjectID = 0;
var gRunning = false;

var EDITOR_OFFSETS = [30, 192, 95];
var DETAILS_OBJECTS_OFFSETS = [150, 75, 75, 120];



$(document).ready(function() {
    
    gGameCore = new GameCore();

    // Inheritance
    gEngine.Core.inheritPrototype(ClientScene, Scene);
    
    //createCodeEditor();
    //$('#codeEditor').hide();
    createPanelLeft();
    createPanelRight();
    createPanelBottom();
    
    // Removes the scroll bar
    $('body').addClass('disable-scroll');
    $('body').css('background-color', '#4d4948');
    
    // Resize the window once to make everything fit
    windowResize();
});

$('#menuFileOpen').click(function() {
    alert("open clicked");
});

$('#menuFileSave').click(function() {
    alert("save clicked");
});

$('#menuPanel').click(function() {
    //alert(window["GameObject0"].prototype["update"]);
    /*
    console.log(window["GameObject"]); // prints just the constructor
    
    // Prints every method's code
    for(var functionName in window["GameObject"].prototype) {
        console.log(window["GameObject"].prototype[functionName]);
    }
    */
    
    //downloadJS(this, "test-file", "test file 123");

    //var x = new Class123();
    //x.hello();
    console.log(window["TestName0"].prototype["draw"]);
});


var downloadJS = function (component, filename, contents) {
    // Downloads a JS file with given filename and file contents to the user's computer
    // Code adapted from: http://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
    
    var file = null;
    var data = new Blob([contents], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (file !== null) {
      window.URL.revokeObjectURL(file);
    }

    file = window.URL.createObjectURL(data);

    component.download = filename + ".js";  // Causes a download prompt with the filename
    component.href = file;                  // The file to download
};

$('#uploadCodeObject').click(function() {

});

var uploadJS = function() {
    // The user uploads a JS file to this app, and it creates the proper classes
    // Code adapted from this guide: http://www.codeproject.com/Articles/664032/Creating-a-File-Uploader-Using-JavaScript-and-HTML
    
    // Obtain the file from the file chooser
    var file = document.getElementById("uploadCodeObject").files[0];
    if (file) {
        
        // Only add new files
        if (file.name.endsWith(".js")) { // Make sure it is in a .js format
            
            // Read the file and get the file url
            var reader = new FileReader();
            reader.readAsDataURL(file);
            
            // Callback function that is called after the file url is obtained
            reader.onload = function(url) {
                // Make a script tag in the HTML so the new file is recognizable
                var scriptEntry = document.createElement('script');
                scriptEntry.setAttribute("type", "text/javascript");
                
                // Sends over the code; it will enter the system AFTER it finishes loading
                scriptEntry.src = url.target.result;
                
                // Add the finished link into the HTML
                document.head.appendChild(scriptEntry);
            };
            
            // Need a second reader to read the file because the first one is busy
            var reader2 = new FileReader();
            reader2.readAsText(file);
            reader2.onload = function() {
                alert(reader2.result);
            };
            
        } else {
            alert("Your file must be a .js file.");
        }
    }
};

var getClassCode = function(className) {
    // Returns all the code within a class as a string
    // Note that any code that's global (i.e. not in a method) is omitted!
    
    var result = window[className];
    
    // Prints every method's code
    for(var functionName in window[className].prototype) {
        result += "\n\n" + (window[className].prototype[functionName]);
    }
    
    return result;
};

var saveClassCode = function(className, contents) {
    var data = new Blob([contents], {type: 'text/plain'});
    var file = window.URL.createObjectURL(data);
    
    // Read the file and get the file url
    var reader = new FileReader();
    reader.readAsDataURL(file);
            
    // Callback function that is called after the file url is obtained
    reader.onload = function(url) {
        // Make a script tag in the HTML so the new file is recognizable
        var scriptEntry = document.createElement('script');
        scriptEntry.setAttribute("type", "text/javascript");
        
        // Sends over the code; it will enter the system AFTER it finishes loading
        scriptEntry.src = url.target.result;
                
        // Add the finished link into the HTML
        document.head.appendChild(scriptEntry);
    };
};

$('#menuRun').click(function() {
    gRunning = !gRunning;
    alert("Running: " + gRunning);
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
        $('#objectsMenu').finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'});
        gRightClickedItem = $(this).attr('id');
    } else if (id.startsWith("instanceListItem")) { 
        $('#instancesMenu').finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'});
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
                    
                    // Now set the selectedForCode and set up the editor
                    gGameCore.setSelectedForCode(selected);
                    $('#codeHeader').remove();
                    $('#codeBody').remove();
                    createCodeEditor(selected); // This item is also selectedForCode
                    $('#panelLeft').hide();
                    $('#GLCanvas').hide();
                    $('#panelRight').hide();
                    $('#panelBottom').hide();
                }
            });
            break;
        case "objectsMenuInstantiateToScene":
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
                        
                        // TODO: Color is currently not a function
                        //var rend = inst.getRenderable();
                        //rend.setColor(obj.getColor());
                        
                        inst.mName = name;
                        inst.mID = "instance" + obj.mID.substring(obj.mID.indexOf("L"), obj.mID.length);
                    } else { // Must be 0; a class
                        eval("inst = new " + name + "();");
                        inst.mName = name;
                        // So something like, instanceListItem<number>
                        // Instances will be able to track their Class/GO by the number at the end of this mID,
                        // as well as by name (so long all instances are updated when that is changed)
                        inst.mID = "instance" + obj.mID.substring(obj.mID.indexOf("L"), obj.mID.length);
                    }
                    
                    // Add
                    gGameCore.addInstance(inst); // Also selects it
                    $('#panelBottomScenes').removeClass('current-tab');
                    $('#panelBottomCameras').removeClass('current-tab');
                    $('#panelBottomInstances').addClass('current-tab');
                    createPanelBottomInstances();
                }
            });
            break;
        case "objectsMenuDelete":
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // If the selected item is also the item to be deleted, then clean up panel right's body
                    if (gGameCore.getSelected()[0] === gGameCore.getObjectAt(index - 1)[0]) {
                        cleanUpPanelRightBody();
                    }
                    gGameCore.deleteObjectAt(index - 1);
                    $('#' + gRightClickedItem).remove();
                    $('#' + gRightClickedItem + 'p').remove();
                    $('#' + gRightClickedItem + 'br').remove();
                }
            });
            break;
        case "instancesMenuDetails":
            $('#panelBottomBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // Basically just selects the item; gGameCore will refresh and set up the details panel anew
                    gGameCore.selectInstance(index - 1);
                }
            });
            break;
        case "instancesMenuDelete":
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
    var instanceID = selected.mID; // If this is null, we have an instance
    var xf;
    if (!(typeof instanceID === "undefined")) { // Instance
        xf = selected.getXform();
    } else if (selected[2] === 1){ // GO
        xf = selected[0].getXform();
    }
    
    switch($(this).attr('id')) {
        case "panelRightObjectsName":
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
                        gEngine.Core.inheritPrototype(window[gLastSetName], window["GameObject"]);
                    } else {
                        window[gLastSetName] = function() {
                            
                        };
                    }
                    
                    // First update all instances with the new name and class
                    var i;
                    var instances = gGameCore.getInstanceList();
                    for (i = 0; i < instances; i++) {
                        if (instances[i].mName === selected[0].mName) {
                            // Each instance needs to be re-created exactly as the old one, but as a new class
                            // They also need their name value modified
                            var rend = instances[i].getRenderable();
                            var xf = instances[i].getXForm();
                            var newInstance;
                            eval("newInstance = new " + gLastSetName + "(rend);");
                            var newXf = newInstance.getXform();
                            newXf = xf;
                            instances[i] = newInstance;
                            instances[i].mName = $(this).val();
                            // No need to update the mID -- that's just a number
                        }
                    }
                    if ($('#panelBottomInstances').hasClass('current-tab')) {
                        createPanelBottomInstances(); // Refresh only if open currently
                    }
                    
                    // Now update the class itself, where the instances came from
                    selected[0].mName = $(this).val();
                    
                    // Update the UI lists in objects/instances panels with the new name
                    // TODO: This doesn't work?
                    window.onload = function() {
                        document.getElementById(selected[0].mID).text(selected[0].mName);
                    };
                    
                    // Don't do anything with the code!  It isn't even updated yet.
                    // The user NEEDS to update his/her own code to match the new name, then save it.
                    // That save will add it to the system.
                    
                    alert("Don't forget to update all your code to match the new name.");
                } else {
                    alert("That name is not unique!");
                    // Revert the name
                    cleanUpPanelRightBody();
                    createDetailsObjects(selected[2]);
                    gLastSetName = selected[0].mName;
                }
            }
            
            // We are not going to tamper with the code, let the user do it (if he/she doesn't, the program should NOT crash until the program is run)
            
            break;
        case "panelRightObjectsX":
            if (selected[2] === 1 || 3) {
                xf.setXPos($(this).val());
            }
            break;
        case "panelRightObjectsY":
            if (selected[2] === 1 || 3) {
                xf.setYPos($(this).val());
            }
            break;
        case "panelRightObjectsW":
            if (selected[2] === 1 || 3) {
                xf.setWidth($(this).val());
            }
            break;
        case "panelRightObjectsH":
            if (selected[2] === 1 || 3) {
                xf.setHeight($(this).val());
            }
            break;
        case "panelRightObjectsRot":
            if (selected[2] === 1 || 3) {
                xf.setRotationInDegree($(this).val());
            }
            break;
        case "panelRightObjectsColor":
            if (selected[2] === 1 || 3) {
                alert("TODO: Color is still a WIP");
            }
            break;
        default:
            break;
    }
    
});


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

var createCodeEditor = function(selectedForCode) {
    // Make the code editor
    var codeEditor = $('#codeEditor');
    codeEditor.append('<ul class="nav-menu" id="codeHeader">' +
            '<li class="header-text-only">Code Editor</li>' +
            '</ul>');
    
    // Make the body of the code editor
    codeEditor.append('<ul class="panel-body" id="codeBody"></ul>');
    
    // Create a separate area within the panel for the editor
    var code = selectedForCode[1];
    if (code === undefined) {
        code = "function(/* Your parameters here */) {\n\t// Your code here\n};";
    }
    
    var editorArea = $('#codeBody');
    var editorDiv = $('<div id="aceEditor">' + code + '</div>'); // You can insert default code between the divs
    editorArea.append(editorDiv);
    
    // Set up the editor
    var editor = ace.edit('aceEditor');
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
    
    // Set a size for it
    $('#aceEditor').width($(window).width() - EDITOR_OFFSETS[0]);
    $('#aceEditor').height($(window).height() - EDITOR_OFFSETS[1]);
    $('#codeBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    // Add a button at the bottom
    editorArea.append('<br>');
    editorArea.append('<ul class="nav-menu">' +
            '<li id="codeOK"><a href="#">OK</a></li>' +           // Places this on the farthest right
            '<li id="codeCancel"><a href="#">Cancel</a></li>' +   // Left of the OK button
            '</ul>');
    $('#codeOK').css('float', 'right');
    $('#codeCancel').css('float', 'right');
    
    // Add the function directly to it
    $('#codeOK').click(function() {
        
        var result = editor.getValue();
        // First set the code for the object
        selectedForCode[1] = result;
        // Then add it into the system (it will automatically overlap existing functions of the same name)
        eval(result);
        
        // Remove the editor
        $('#codeHeader').remove();
        $('#codeBody').remove();
        $('#panelLeft').show();
        $('#GLCanvas').show();
        $('#panelRight').show();
        $('#panelBottom').show();
        
        alert("Code saved!");
    });
    $('#codeCancel').click(function() {
        // Remove the editor
        $('#codeHeader').remove();
        $('#codeBody').remove();
        $('#panelLeft').show();
        $('#GLCanvas').show();
        $('#panelRight').show();
        $('#panelBottom').show();
    });
    
    // Populate the text for the current object.
    // Note that changing objects or pressing some other button to open this panel also should also populate the text.
    // 7 = the update script
    //editor.setValue(selected.getAllContents()[7].value);
};

var createPanelLeft = function() {
    // Make the panel
    var panelLeft = $('#panelLeft');
    panelLeft.append('<ul class="nav-menu">' +
            '<li><a href="#" id="panelLeftObjects">Objects</a></li>' +
            '<li><a href="#" id="panelLeftTextures">Textures</a></li>' +
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
    $('#panelLeftObjects').addClass('current-tab');
    createPanelLeftObjects();
};

var createPanelLeftObjects = function() {
    // Now add the UL for the body
    var panelLeft = $('#panelLeft');
    
    $('#panelLeftObjectsBody').remove();
    
    panelLeft.append('<ul class="panel-body" id="panelLeftObjectsBody">' +
            '<li><a href="#" id="panelLeftAddGameObject">+ Object</a></li><br><br><p>' +
            '</ul>');
    
    var panelLeftBody = $('#panelLeftObjectsBody');
    var i;
    var list = gGameCore.getObjectList();
    
    for (i = 0; i < list.length; i++) {
        // Reload the contents
        panelLeftBody.append('<li class="panel-list-item" id="' + list[i][0].mID + '">' + list[i][0].mName + '</li><p id="' + list[i][0].mID + 'p"><br id="' + list[i][0].mID + 'br">');
    }
    
    panelLeftBody.css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    $('#panelLeftAddGameObject').click(function() {
        gGameCore.createDefaultObject("GameObj" + gNextObjectID, gNextObjectID, 1);
        panelLeftBody.append('<li class="panel-list-item" id="objectListItem' + gNextObjectID + '">GameObj' + gNextObjectID + '</li><p id="objectListItem' + gNextObjectID + 'p"><br id="objectListItem' + gNextObjectID + 'br">');
        gNextObjectID++;
    });
};

var createPanelLeftTextures = function() {
    // Now add the UL for the body
    var panelLeft = $('#panelLeft');
    
    $('#panelLeftObjectsBody').remove();
    
    panelLeft.append('<ul class="panel-body" id="panelLeftObjectsBody">' +
            '<li><a href="#" id="panelLeftAddTexture">+ Texture</a></li><br><br><p>' +
            '</ul>');
    
    var panelLeftBody = $('#panelLeftObjectsBody');
    var i;
    var list = gGameCore.getTextureList();
    
    for (i = 0; i < list.length; i++) {
        // Reload the contents
        //panelLeftBody.append('<li class="panel-list-item" id="' + list[i][0].mID + '">' + list[i][0].mName + '</li><p id="' + list[i][0].mID + 'p"><br id="' + list[i][0].mID + 'br">');
    }
    
    panelLeftBody.css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    $('#panelLeftAddTexture').click(function() {
        //gGameCore.createDefaultObject("GameObj" + gNextObjectID, gNextObjectID, 1);
        //panelLeftBody.append('<li class="panel-list-item" id="objectListItem' + gNextObjectID + '">GameObj' + gNextObjectID + '</li><p id="objectListItem' + gNextObjectID + 'p"><br id="objectListItem' + gNextObjectID + 'br">');
        //gNextObjectID++;
        console.log("clicked + texture");
    });
};

var createPanelRight = function() {
    // Make the panel
    var panelRight = $('#panelRight');
    panelRight.append('<ul class="nav-menu">' +
            '<li><a id="panelRightDetails" class="current-tab">Details</a></li>' +
            '</ul>');
    
    cleanUpPanelRightBody();
};

var cleanUpPanelRightBody = function() {
    // REMOVES (if any) and RE-CREATES the panel right body
    
    // Remove it if it exists
    $('#panelRightBody').remove();
    
    // Add a blank body
    $('#panelRight').append('<ul class="panel-body" id="panelRightBody"></ul>');
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
            //'<li><input type="file" id="uploadCodeObject" name="files[]" onchange="uploadJS()"/></li><br><br>' +
            //'<li><a href="#" id="panelRightObjectsEditCode">Edit Code</a></li>'
            );
    // Only append code editor if it is not an instance
    if (type < 2) {
        panelRightBody.append('<li><a href="#" id="panelRightObjectsEditCode">Edit Code</a></li>');
    }
    
    var selected = gGameCore.getSelected();
    
    /*var functions = $('#panelRightObjectsFunctions');
    var functionName;
    for (functionName in window[selected[0].mName].prototype) {
        functions.append('<option value="' + functionName + '">' + functionName + '</option>');
    }
    functions.append('<option value="createNewFunction">(Create New Function)</option>');*/
    
    $('#panelRightObjectsTextureText').css('float', 'left');
    $('#panelRightObjectsTexture').css('float', 'left');
    $('#panelRightObjectsAddTexture').css('float', 'right').css('height', '1px').css('line-height', '0px');
    
    $('#panelRightObjectsAddTexture').click(function() {
        alert("+ texture clicked\nyou selected: " + $('#panelRightObjectsTexture').val());
    });
    
    $('#panelRightObjectsEditCode').click(function() {
        // Because you can only click this button when the details panel is open,
        // the selected object must also be the one chosen for code
        gGameCore.setSelectedForCode(selected);
        //var code = getCode(selected.mName, $('#panelRightObjectsFunctions').val());
        
        //$('#codeEditor').show();
        $('#codeHeader').remove();
        $('#codeBody').remove();
        //createCodeEditor(selected[0].mName, $('#panelRightObjectsFunctions').val());
        createCodeEditor(selected); // This item is also selectedForCode
        $('#panelLeft').hide();
        $('#GLCanvas').hide();
        $('#panelRight').hide();
        $('#panelBottom').hide();
    });
    
    /* TODO: Later we will use a for loop to loop through GameCore's texture list
     * And append it in the following format:
     * 
     * '<select id="panelRightObjectsTexture"><option value="this is the .val() and it will the texture name">Display text here (same as value)</option></select>' +
     * Insert as many options (within the select) as you want
     */
    
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
        var xf;
        if (type === 1) {
            xf = selected[0].getXform();
        } else {
            xf = selected.getXform();
        }
        $('#panelRightObjectsX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getXPos());
        $('#panelRightObjectsY').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px').val(xf.getYPos());
        $('#panelRightObjectsW').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getWidth());
        $('#panelRightObjectsH').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px').val(xf.getHeight());
        $('#panelRightObjectsRot').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(xf.getRotationInDegree());
    } else if (type === 0 || type === 2) { // Class or instance of Class
        $('#panelRightObjectsX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px');
        $('#panelRightObjectsY').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px');
        $('#panelRightObjectsW').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px');
        $('#panelRightObjectsH').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px');
        $('#panelRightObjectsRot').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px');
    }
    
    $('#panelRightObjectsColor').css('width', DETAILS_OBJECTS_OFFSETS[0] + 3 + 'px');
    $('#panelRightObjectsTexture').css('width', DETAILS_OBJECTS_OFFSETS[3] + 'px');

    
    // You can get the contents with $('#panelRightObjectsName').val() -- that's the name, as an example
};

var createPanelBottom = function() {
    // Make the panel
    var panelBottom = $('#panelBottom');
    panelBottom.append('<ul class="nav-menu">' +
            '<li><a href="#" id="panelBottomScenes">Scenes</a></li>' +
            '<li><a href="#" id="panelBottomCameras">Cameras</a></li>' +
            '<li><a href="#" id="panelBottomInstances">Instances</a></li>' +
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
    $('#panelBottomScenes').addClass('current-tab');
    createPanelBottomScenes();
};

var createPanelBottomScenes = function() {
    $('#panelBottomBody').remove(); // If it exists, because we need a brand new one
    
    $('#panelBottom').append('<ul class="panel-body" id="panelBottomBody">' +
            '<li><a href="#" id="panelBottomScenesAddScene">+ Scene</a></li></ul>');
    $('#panelBottomBody').css('position', 'fixed').css('bottom', '0').css('height', '186px').css('width', '100%').css('z-index', '-1');
    
    $('#panelBottomScenesAddScene').click(function() {
        alert("Clicked + scene");
    });

};

var createPanelBottomCameras = function() {
    $('#panelBottomBody').remove(); // If it exists, because we need a brand new one
    
    $('#panelBottom').append('<ul class="panel-body" id="panelBottomBody">' +
            '<li><a href="#" id="panelBottomScenesAddCamera">+ Camera</a></li></ul>');
    $('#panelBottomBody').css('position', 'fixed').css('bottom', '0').css('height', '186px').css('width', '100%').css('z-index', '-1');
    
    $('#panelBottomScenesAddCamera').click(function() {
        alert("Clicked + camera");
    });

};

var createPanelBottomInstances = function() {
    $('#panelBottomBody').remove(); // If it exists, because we need a brand new one
    
    $('#panelBottom').append('<ul class="panel-body" id="panelBottomBody">' +
            '<li><a href="#" id="panelBottomScenesAddInstance">+</a></li></ul>');
    
    var panelBottomBody = $('#panelBottomBody');
    panelBottomBody.css('position', 'fixed').css('bottom', '0').css('height', '186px').css('width', '100%').css('z-index', '-1');
    
    var i;
    var list = gGameCore.getInstanceList(); // These are all instances -- they are NOT inside arrays at index 0
    
    for (i = 0; i < list.length; i++) {
        // Add all instances
        panelBottomBody.append('<li class="panel-list-item" id="' + list[i].mID + '">' + list[i].mName + '</li>');
    }
        
    $('#panelBottomScenesAddInstance').click(function() {
        alert("Clicked + instance");
    });
};

var toggleGO = function(box, type) {
    if (type > 1) {
        // Instance alert, this isn't allowed
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
    createDetailsObjects(newType);
    
    // No need to change the instances of either
    // The user could decide to have many classes if he/she so chooses
    // The xf values don't need to be changed either
};

var getCode = function(className, functionName) {

    return window[className].prototype[functionName];
    
    /*
    console.log(window["GameObject"]); // prints just the constructor
    
    // Prints every method's code
    for(var functionName in window["GameObject"].prototype) {
        console.log(window["GameObject"].prototype[functionName]);
    }*/
};

var parseParamBody = function(entry) {
    // Parses code to get the params and body
    // Start processing the code for parameters and body
    var header = entry.substring(entry.indexOf("(") + 1, entry.indexOf("{")); // Just the parameter section
    header = header.substring(0, header.indexOf(")")); // Cut off the last ) as well
        
    // Gets rid of most of the unnecessary comments made through the new Function process
    if (header.endsWith("\n/**/")) {
        header = header.substring(0, header.lastIndexOf("\n/**/"));
    }
        
    // Finally acquire an array with all the parameters
    var params = header.split(",");
        
    // Now trim entry to just the body
    var body = entry.substring(entry.indexOf("{") + 1, entry.lastIndexOf("}"));
        
    // Finally get rid of extra new lines
    while (body.endsWith("\n")) {
        body = body.substring(0, body.lastIndexOf("\n"));
    }
    while (body.startsWith("\n")) {
        body = body.substring(1, body.length);
    }
    
    var result = [params, body];
    return result;
};

var compareFunctions = function(p1, b1, p2, b2) {
    // Compares sets of parameters and bodies for 2 functions and returns the result
    // Use parseParamBody() to obtain params (p1 and p2) and bodies (b1 and b2)
    
    var result = true;
    
    if (p1.length === p2.length) {
        // Are the params the same?
        var i;
        for (i = 0; i < p1.length; i++) {
            if (p1[i] !== p2[i]) {
                result = false;
            }
        }
        
        // Are the bodies the same?
        if (b1 !== b2) {
            result = false;
        }
    }
    
    // Done
    return result;
};