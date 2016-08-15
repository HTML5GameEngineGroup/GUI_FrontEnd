var gGuiBase = gGuiBase || { }; //Create the singleton if it hasn't already been created

gGuiBase.EditorSupport = (function() {
    var gEditorMap = {};            // Hashes mID of objects to an editor id.  Used for making the right editor show on top.
    var gZIndex = 0;                // ID for editors

    var EDITOR_OFFSETS = [30, 192, 95];
    var DETAILS_OBJECTS_OFFSETS = [150, 75, 120];
    
    var createFloatingEditor = function( GOName ) {
        console.log(GOName);
        var GO = gGuiBase.ObjectSupport.getGameObjectByID(GOName);
        var indexToAdd = gZIndex;
        var editorName = "floatingEditor" + indexToAdd;

        // Hash map used for making checking if the editor is already opened, and if so, make the right editor appear on top
        if (typeof(gEditorMap[GO.mID]) !== "undefined") {
            // Already opened!  Just make it appear on top so the user can find it.
            gZIndex++;
            $('#' + gEditorMap[GO.mID]).css('z-index', gZIndex); // Just use gZIndex to track the highest z-index value we can use
            gZIndex++;
            return;
        } else {
            // New hash
            gEditorMap[GO.mID] = editorName;
        }

        var headerName = "codeHeader" + indexToAdd;
        var bodyName = "codeBody" + indexToAdd;
        var aceName = "aceEditor" + indexToAdd;
        var okName = "codeOK" + indexToAdd;
        var cancelName = "codeCancel" + indexToAdd;
        var navBottomName = "navBarBottom" + indexToAdd;
        var objName = "";
        if (typeof(GO.mName) === 'undefined' || GO.mName === "") {
            objName = "Unnamed object";
        } else {
            objName = GO.mName;
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
        var code = gGuiBase.ObjectSupport.getGameObjectCodeByID(GO.mName);

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
        $('.floating-nav-menu')
            .css('margin', 0)
            .css('padding', 0)
            .css('background-color', 'white');
        // Add the function directly to it
        $('#' + okName).click(function() {
            // Get editor contents as a string
            var result = editor.getValue();

            // First set the code for the object only (so it's saved and the user can come back to it)
            gGuiBase.ObjectSupport.setGameObjectCodeByID(GO.mID, result);

            var msg = "";

            try {
                // Puts code into system
                eval(result);

                // ******************** start here ***************************
                var i;
                var objs = gGuiBase.ObjectSupport.getObjectList();
                var objCode = gGuiBase.ObjectSupport.getObjectCodeList();
                for (i = 0; i < objs.length; i++) {
                    if (objs[i].mName === GO.mName) {
                        eval(objCode[i]);
                    }
                }

                var sceneList = gGuiBase.SceneSupport.getSceneList();
                for (var j = 0; j < sceneList.length; j++) {

                    // First update all instances with the new name and class
                    var instances = sceneList[j].getInstanceList();
                    for (i = 0; i < instances.length; i++) {
                        var name = instances[i].mName;
                        if (name === GO.mName) {
                            var instID = instances[i].mID;
                            // Each instance needs to be re-created exactly as the old one, but as a new class
                            // They also need their name value modified
                            var rend = instances[i].getRenderable();
                            var xf = instances[i].getXform();
                            var newInstance;
                            eval("newInstance = new " + name + "(rend);");
                            newInstance.mID = instances[i].mID;
                            newInstance.mName = instances[i].mName;
                            var newXf = newInstance.getXform();
                            newXf = xf;
                            instances[i] = newInstance;
                        }
                    }
                }
                // ************** end here *****************
                msg = "Code saved!";
            } catch (error) {
                msg = "Your code contains an error.  Please review.\n\n" + error;
            }

            // Remove the editor
            codeEditor.remove();
            delete gEditorMap[GO.mID];
            alert(msg);
        });
        
        // remove editor
        $('#' + cancelName).click(function() {
            // Remove the editor
            codeEditor.remove();
            delete gEditorMap[GO.mID];
        });
    };


    var mPublic = {
        createFloatingEditor: createFloatingEditor
    };
    return mPublic;
}());