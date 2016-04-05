/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

//var GameCore = null;

$(document).ready(function() {
    
    console.log("made it");
    //GameCore = new GameCore();
    
    // Inheritance
    //gEngine.Core.inheritPrototype(ClientScene, Scene);
    
    createCodeEditor();
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
    $('#aceEditor').width($(window).width() - 30);
    $('#aceEditor').height($(window).height() - 192);
    $('#codeBody').css('height', ($(window).height() - 95) + 'px');
};

window.onresize = function(event) {
    windowResize();
};

var createCodeEditor = function() {
    var info = "In this test:\n-Code Editor panel, bottom bar, and editor itself added\n-They are resizable and fit to the screen\n-Bottom bar uses right-alignment";
    // Make the code editor
    var codeEditor = $('#codeEditor');
    codeEditor.append('<ul class="nav-menu">' +
            '<li class="header-text-only">Code Editor</li>' +
            '</ul>');
    
    // Make the body of the code editor
    codeEditor.append('<ul class="panel-body" id="codeBody"></ul>');
    
    // Create a separate area within the panel for the editor
    var editorArea = $('#codeBody');
    var editorDiv = $('<div id="aceEditor">' + info + '</div>'); // You can insert default code between the divs, but I already gave the default code to GameObject's script update variable.
    editorArea.append(editorDiv);
    
    // Set up the editor
    var editor = ace.edit('aceEditor');
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/javascript');
        
    // Set a size for it
    $('#aceEditor').width($(window).width() - 30);
    $('#aceEditor').height($(window).height() - 192);
    $('#codeBody').css('height', ($(window).height() - 95) + 'px');
       
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

    // Now add the UL for the body
    panelLeft.append('<ul class="panel-body"></ul>'); // Insert anything into here or give it an id and insert stuff into that id

};