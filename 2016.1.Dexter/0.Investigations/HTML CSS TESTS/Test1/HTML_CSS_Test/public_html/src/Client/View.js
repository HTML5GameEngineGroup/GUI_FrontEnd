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

});

$("#menuFileOpen").click(function() {
    console.log("open clicked");
});

$("#menuFileSave").click(function() {
    console.log("save clicked");
});


