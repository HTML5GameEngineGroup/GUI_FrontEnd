/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene, GameCore */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gGameCore = null;

var gRightClickedItem = null;
var gNextObjectID = 0;
var gRunning = false;

var EDITOR_OFFSETS = [30, 192, 95];
var DETAILS_OBJECTS_OFFSETS = [150, 75, 75, 120];


$(document).ready(function() {
    
    console.log("made it");
    gGameCore = new GameCore();

    // Inheritance
    gEngine.Core.inheritPrototype(ClientScene, Scene);
    //createCodeEditor();
    //$('#codeEditor').hide();
    createPanelLeft();
    createPanelRight();
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
    
    downloadJS(this, "test-file", "test file 123");
});

var downloadJS = function (component, filename, contents) {
    //http://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
    var file = null;
    var data = new Blob([contents], {type: 'text/plain'});

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (file !== null) {
      window.URL.revokeObjectURL(file);
    }

    file = window.URL.createObjectURL(data);

    component.download = filename + ".js";  // Causes a download prompt with the filename
    component.href = file;          // The file to download
};

$('#menuRun').click(function() {
    gRunning = !gRunning;
    alert("Running: " + gRunning);
});

$(document).bind("mousedown", function(event) {
    // Upon a click outside of the menu, hide all right-click menus (allows you to immediately open a new menu elsewhere)
    // Adapted from: http://stackoverflow.com/questions/4495626/making-custom-right-click-context-menus-for-my-web-app
    if (!$(event.target).parents(".objects-menu").length > 0) {
        $(".objects-menu").hide();
    }
});

$(document).bind("contextmenu", function(event) {
    // Prevents all regular right-click menus from showing when right-clicking
    event.preventDefault();
});

$(document).on('contextmenu', 'li', function(event) {
    // Checks out the id of the item and will provide the appropriate right-click menu
    // (since another function blocks the default one)
    var id = this.id;
    if (id.startsWith("objectListItem")) {
        $(".objects-menu").finish().toggle().css({top: event.pageY + 'px', left: event.pageX + 'px'});
        gRightClickedItem = $(this).attr('id');
    }
});

$('.objects-menu li').click(function(){
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
                alert("edit code clicked");
                /*
                if ($(this).attr('id') === gRightClickedItem) {
                    // Select the object and open the code panel
                    gGameCore.select(index - 1);
                    gGameCore.setSelectedForCode(gGameCore.getObjectAt(index - 1));
                    
                    $('#codeEditor').show();
                    $('#panelLeft').hide();
                    $('#GLCanvas').hide();
                    $('#panelRight').hide();
                }*/
            });
            break;
        case "objectsMenuInstantiateToScene":
            var inst;
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    var obj = gGameCore.getObjectAt(index - 1);
                    var name = obj.mName;
                    
                    // Deep copy of the renderable, as described in http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
                    var rend = jQuery.extend(true, {}, obj.getRenderable());
                    
                    // Create
                    eval("inst = new " + name + "(rend);");
                    
                    // Mimic the xform
                    var xf = inst.getXform();
                    var xf2 = obj.getXform();
                    xf.setXPos(xf2.getXPos());
                    xf.setYPos(xf2.getYPos());
                    xf.setWidth(xf2.getWidth());
                    xf.setHeight(xf2.getHeight());
                    xf.setRotationInDegree(xf2.getRotationInDegree());
                    
                    // Add
                    gGameCore.addInstance(inst);
                }
            });
            break;
        case "objectsMenuDelete":
            $('#panelLeftObjectsBody li').each(function(index) {
                if ($(this).attr('id') === gRightClickedItem) {
                    // If the selected item is also the item to be deleted, then clean up panel right's body
                    if (gGameCore.getSelected() === gGameCore.getObjectAt(index - 1)) {
                        cleanUpPanelRightBody();
                    }
                    gGameCore.deleteObjectAt(index - 1);
                    $('#' + gRightClickedItem).remove();
                }
            });
            break;
        default:
            break;
    }
  
    // Done with the menu
    $(".objects-menu").hide();
});

$('div').on('focusout', '.text-field', function() {
    // When you focus out of any text-field, save the contents to the appropriate place
    
    var selected = gGameCore.getSelected();
    var xf = selected.getXform();
    
    switch($(this).attr('id')) {
        case "panelRightObjectsName":
            selected.mName = $(this).val();
            alert("TODO: Renaming the class isn't implemented yet -- please don't change this.");
            break;
        case "panelRightObjectsX":
            xf.setXPos($(this).val());
            break;
        case "panelRightObjectsY":
            xf.setYPos($(this).val());
            break;
        case "panelRightObjectsW":
            xf.setWidth($(this).val());
            break;
        case "panelRightObjectsH":
            xf.setHeight($(this).val());
            break;
        case "panelRightObjectsRot":
            xf.setRotationInDegree($(this).val());
            break;
        case "panelRightObjectsColor":
            alert("TODO: Color is still a WIP");
            break;
        default:
            break;
    }
    
});


var windowResize = function() {
    //var initWidth = 640.0;
    //var initHeight = 480.0;
    //var width = $(window).width() * 0.7;
    //var height = (initHeight / initWidth) * width;
    
    //$("#GLCanvas").width(width);
    //$("#GLCanvas").height(height);
    
    $('#aceEditor').width($(window).width() - EDITOR_OFFSETS[0]);
    $('#aceEditor').height($(window).height() - EDITOR_OFFSETS[1]);
    $('#codeBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    $('#panelLeftBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    $('#panelRightBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
};

window.onresize = function(event) {
    windowResize();
};

var createCodeEditor = function(className, functionName) {
    // Make the code editor
    var codeEditor = $('#codeEditor');
    codeEditor.append('<ul class="nav-menu" id="codeHeader">' +
            '<li class="header-text-only">Code Editor</li>' +
            '</ul>');
    
    // Make the body of the code editor
    codeEditor.append('<ul class="panel-body" id="codeBody"></ul>');
    
    // Create a separate area within the panel for the editor
    var code = getCode(className, functionName);
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
        
        var f1 = parseParamBody(editor.getValue());
        var f2 = window["GameObject"].prototype[functionName];
        var check = false;
        
        if (typeof f2 !== "undefined") {
            f2 = parseParamBody(f2.toString());
            check = true;
        }
        
        if (check && compareFunctions(f1[0], f1[1], f2[0], f2[1])) {
            // Do nothing.  Make sure you don't do anything else in this if/else chain.
            alert("No modification was made.\nAs such, the GameObject function, " + functionName + "() will not be overriden.");
        } else if (functionName === "createNewFunction") {
            functionName = "function1";
            window[className].prototype[functionName] = new Function(f1[0], f1[1]);
            
            // Refresh the panel body in order to see the new function
            cleanUpPanelRightBody();
            createDetailsObjects();
            
            alert("For now, your code will be saved under the name, function1.\nYou will be able to choose a name later.");
        } else if (functionName !== "constructor") {
            window[className].prototype[functionName] = new Function(f1[0], f1[1]);
            alert("Your code was successfully saved.");
        } else {
            alert("For now, editing constructors is disabled.");
            //var functions = window[className].prototype;
            //window[className] = new Function(params, entry);
            //window[className].prototype = functions;
        }
        // Remove the editor
        $('#codeHeader').remove();
        $('#codeBody').remove();
        $('#panelLeft').show();
        $('#GLCanvas').show();
        $('#panelRight').show();
    });
    $('#codeCancel').click(function() {
        // Remove the editor
        $('#codeHeader').remove();
        $('#codeBody').remove();
        $('#panelLeft').show();
        $('#GLCanvas').show();
        $('#panelRight').show();
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
            '<li><a href="#" id="panelLeftScenes">Scenes</a></li>' +
            '</ul>');
    
    // Add the function directly to it
    $('#panelLeftObjects').click(function() {
        alert("objects clicked");
    });
    $('#panelLeftTextures').click(function() {
        alert("textures clicked");
    });
    $('#panelLeftScenes').click(function() {
        alert("scenes clicked");
    });
    
    // Resize it
    panelLeft.css('width', '234px');
    
    createPanelLeftObjects();
};

var createPanelLeftObjects = function() {
    // Now add the UL for the body
    var panelLeft = $('#panelLeft');
    
    panelLeft.append('<ul class="panel-body" id="panelLeftObjectsBody">' +
            '<ul class="nav-menu" id="panelLeftAddGameObjectUL"><li><a href="#" id="panelLeftAddGameObject">+ GameObject</a></li></ul>' +
            '</ul>');
    
    var panelLeftBody = $('#panelLeftObjectsBody');
    var i;
    var list = gGameCore.getObjectList();
    
    for (i = 0; i < list.length; i++) {
        // Add objects in with a default name
        panelLeftBody.append('<li class="object-list-item" id="objectListItem' + list.get(i).mID + '">' + list.get(i).mName + '</li><p><br>');
    }
    
    $('#panelLeftAddGameObjectUL').css('width', '120px');
    panelLeftBody.css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
    
    $('#panelLeftAddGameObject').click(function() {
        gGameCore.createDefaultObject(gNextObjectID);
        panelLeftBody.append('<li class="object-list-item" id="objectListItem' + gNextObjectID + '">GameObj' + gNextObjectID + '</li><p><br>');
        gNextObjectID++;
    });
};

var createPanelRight = function() {
    // Make the panel
    var panelRight = $('#panelRight');
    panelRight.append('<ul class="nav-menu">' +
            '<li><a id="panelRightDetails">Details</a></li>' +
            '</ul>');
        
    // Resize it
    panelRight.css('width', '234px');
    
    cleanUpPanelRightBody();
    
    //createDetailsObjects();
};

var cleanUpPanelRightBody = function() {
    // REMOVES (if any) and RE-CREATES the panel right body
    
    // Remove it if it exists
    $('#panelRightBody').remove();
    
    // Add a blank body
    $('#panelRight').append('<ul class="panel-body" id="panelRightBody"></ul>');
    $('#panelRightBody').css('height', ($(window).height() - EDITOR_OFFSETS[2]) + 'px');
};

var createDetailsObjects = function() {    
    // Now add the UL for the body
    var panelRightBody = $('#panelRightBody');
    
    panelRightBody.append('<font color="black">Name</font><span><input type="text" class="text-field" id="panelRightObjectsName"/></span><br><br>' +
            '<font color="black">X / Y</font><span><input type="text" class="text-field" id="panelRightObjectsY"/></span>' +    // Note: Y is before X and W is before H, but after right-align, it goes in the proper order
            '<span><input type="text" class="text-field" id="panelRightObjectsX"/></span><br><br>' +
            '<font color="black">W / H</font><span><input type="text" class="text-field" id="panelRightObjectsH"/></span>' +
            '<span><input type="text" class="text-field" id="panelRightObjectsW"/></span><br><br>' +
            '<font color="black">Rot</font><span><input type="text" class="text-field" id="panelRightObjectsRot"/></span><br><br><br><br>' +
            '<font color="black">Color</font><span><input type="text" class="text-field" id="panelRightObjectsColor"/></span><br><br>' +
            '<font color="black" id="panelRightObjectsTextureText">Texture&nbsp</font><select id="panelRightObjectsTexture"><option value="TempTexture1">TempTexture1</option><option value="TempTexture2">TempTexture2</option></select>' +
            '<li><a href="#" id="panelRightObjectsAddTexture">+</a></li><br><br><br><br>' +
            '<select id="panelRightObjectsFunctions"></select>' +
            '<li><a href="#" id="panelRightObjectsEditCode">Edit Code</a></li>'
            );
    
    var selected = gGameCore.getSelected();
    var functions = $('#panelRightObjectsFunctions');
    var functionName;
    for (functionName in window[selected.mName].prototype) {
        functions.append('<option value="' + functionName + '">' + functionName + '</option>');
    }
    functions.append('<option value="createNewFunction">(Create New Function)</option>');
    
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
        createCodeEditor(selected.mName, $('#panelRightObjectsFunctions').val());
        $('#panelLeft').hide();
        $('#GLCanvas').hide();
        $('#panelRight').hide();
    });
    
    /* TODO: Later we will use a for loop to loop through GameCore's texture list
     * And append it in the following format:
     * 
     * '<select id="panelRightObjectsTexture"><option value="this is the .val() and it will the texture name">Display text here (same as value)</option></select>' +
     * Insert as many options (within the select) as you want
     */
    
    // Get selected, which is guaranteed to be a GameObject (if it were something else, this panel would have been cleaned up)
    var selected = gGameCore.getSelected();
    var xf = selected.getXform();
    
    $('#panelRightObjectsName').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(selected.mName);
    $('#panelRightObjectsX').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getXPos());
    $('#panelRightObjectsY').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px').val(xf.getYPos());
    $('#panelRightObjectsW').css('width', DETAILS_OBJECTS_OFFSETS[1] + 'px').val(xf.getWidth());
    $('#panelRightObjectsH').css('width', DETAILS_OBJECTS_OFFSETS[2] + 'px').val(xf.getHeight());
    $('#panelRightObjectsRot').css('width', DETAILS_OBJECTS_OFFSETS[0] + 'px').val(xf.getRotationInDegree());
    $('#panelRightObjectsColor').css('width', DETAILS_OBJECTS_OFFSETS[0] + 3 + 'px');
    $('#panelRightObjectsTexture').css('width', DETAILS_OBJECTS_OFFSETS[3] + 'px');
    
    
    // You can get the contents with $('#panelRightObjectsName').val() -- that's the name, as an example
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