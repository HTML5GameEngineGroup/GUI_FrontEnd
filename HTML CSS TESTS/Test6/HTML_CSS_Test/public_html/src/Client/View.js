/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

//var GameCore = null;
var EDITOR_OFFSETS = [30, 192, 95];

$(document).ready(function() {
    
    console.log("made it");
    //GameCore = new GameCore();
    
    // Inheritance
    //gEngine.Core.inheritPrototype(ClientScene, Scene);
    
    //createCodeEditor();
    createPanelLeft();
    
});

$('#menuFileOpen').click(function() {
    alert("open clicked");
});

$('#menuFileSave').click(function() {
    alert("save clicked");
});

$('#menuPanel').click(function() {
    alert("panel clicked");
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
};

window.onresize = function(event) {
    windowResize();
};

var createCodeEditor = function() {
    // Make the code editor
    var codeEditor = $('#codeEditor');
    codeEditor.append('<ul class="nav-menu">' +
            '<li class="header-text-only">Code Editor</li>' +
            '</ul>');
    
    // Make the body of the code editor
    codeEditor.append('<ul class="panel-body" id="codeBody"></ul>');
    
    // Create a separate area within the panel for the editor
    var editorArea = $('#codeBody');
    var editorDiv = $('<div id="aceEditor"></div>'); // You can insert default code between the divs, but I already gave the default code to GameObject's script update variable.
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
            '<li class="li-right"><a href="#" id="codeOK">OK</a></li>' +            // Places this on the farthest right
            '<li class="li-right"><a href="#" id="codeCancel">Cancel</a></li>' +    // Left of the OK button
            '</ul>');
    
    // Add the function directly to it
    $('#codeOK').click(function() {
        alert("OK clicked");
    });
    $('#codeCancel').click(function() {
        alert("cancel clicked");
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
    
    panelLeft.append('<ul class="panel-body">' +
            '<font color="black">Name </font><input type="text" id="panelLeftObjectsName"/><br><br>' +
            '<font color="black">X &nbsp</font><input type="text" id="panelLeftObjectsX"/>' +
            '<font color="black"> Y </font><input type="text" id="panelLeftObjectsY"/><br><br>' +
            '<font color="black">W </font><input type="text" id="panelLeftObjectsW"/>' +
            '<font color="black"> H </font><input type="text" id="panelLeftObjectsH"/><br><br>' +
            '<font color="black">Rot </font><input type="text" id="panelLeftObjectsRot"/><br><br><br><br>' +
            '<font color="black">Color </font><input type="text" id="panelLeftObjectsColor"/><br><br>' +
            '<font color="black">Texture </font><select id="panelLeftObjectsTexture"><option value="TempTexture1">TempTexture1</option><option value="TempTexture2">TempTexture2</option></select>' +
            '<button type="button" id="panelLeftObjectsAddTexture">+</button>' +
            '</ul>');
    
    $('#panelLeftObjectsAddTexture').click(function() {
        alert("+ texture clicked\nyou selected: " + $('#panelLeftObjectsTexture').val());
    });
    
    /* Later we will use a for loop to loop through GameCore's texture list
     * And append it in the following format:
     * 
     * '<select id="panelLeftObjectsTexture"><option value="this is the .val() and it will the texture name">Display text here (same as value)</option></select>' +
     * Insert as many options (within the select) as you want
     */
    
    $('#panelLeftObjectsName').css('width', '153px');
    $('#panelLeftObjectsX').css('width', '80px');
    $('#panelLeftObjectsY').css('width', '81px');
    $('#panelLeftObjectsW').css('width', '80px');
    $('#panelLeftObjectsH').css('width', '80px');
    $('#panelLeftObjectsRot').css('width', '169px');
    $('#panelLeftObjectsColor').css('width', '157px');
    $('#panelLeftObjectsTexture').css('width', '120px');
    
    
    // You can get the contents with $('#panelLeftObjectsName').val() -- that's the name, as an example
};