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

var createCodeEditor = function() {
    // Make the code editor
    var codeEditor = $('#codeEditor');
    codeEditor.append('<ul class="nav-menu">' +
            '<li class="header-text-only">Code Editor</li>' +
            '</ul>');
};

var createPanelLeft = function() {
    // Make the panel
    var panelLeft = $('#panelLeft');
    panelLeft.append('<ul id="panelLeftUL"></ul>'); // Here we use id instead of class
    
    // Add items into the UL
    var panelLeftUL = $('#panelLeftUL');
    panelLeftUL.append('<li><a href="#" id="panelLeftObjects">Objects</a></li>');
    panelLeftUL.append('<li><a href="#" id="panelLeftTextures">Textures</a></li>');
    panelLeftUL.append('<li><a href="#" id="panelLeftScenes">Scenes</a></li>');
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
    
    
    
    // Now that the first row is filled with buttons,
    // anything added from here on out will "overflow" into the panel body, which is what we want!
};