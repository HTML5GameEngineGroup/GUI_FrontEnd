/* 
 * File: View.js
 * The client code
 */

/*jslint node: true, vars: true */
/*global gEngine, ClientScene, Scene */

/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gameCore = null;

$(document).ready(function() {
    
    console.log("made it");
    gameCore = new GameCore();
    
    // Inheritance
    gEngine.Core.inheritPrototype(ClientScene, Scene);

});

