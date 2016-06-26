//$(document).ready(function(){


//These global variable are bad practice I did it to make it easier to learn
//with the intention of removing them 

//this is a reference to the currently selected list item on the left hand side
//in html
var selectedListItem = null;

//this is the actual game object from the game engine. Is is accociated with the 
//above list item for updating when the user makes changes
//var selectedGameObj = null;
// these two objects are panels on the right side. You can swap between the two
// depending on which type of object is selected. 

// Selected item.  Could be a PGO or a GO.
var selected = null;

var objEditPanel = null;
var cameraEditPanel = null;
var jsEditPanel = null;
var functionEditPanel = null;
var codeEditPanel = null;
var chooseFunctionPanel = null; // For choosing a function

var editor = null;
var editorFunction = null;
var editorCode = null;
var editorScript = null; // This is the editor used for creating functions the proper way

var functions = '// Note: Refer to this object with the "self"\n\nvar function1 = function() {\n\t// Your code here\n};';


var GlobalCamera = null;

//Below are JQuery events that get called from user-html interaction
//$(html element).eventType(function to be called)
//----------------------------------------------------------------------------

//play button on the top, right now it doesn't do anything
$( "#playbtn" ).click(function() {
    GlobalPlay = !GlobalPlay;
    //gEngine.GameLoop.stop();
    
    var i;
    for(i = 0; i < GlobalPrefabList.length; i++){
        var instances = GlobalPrefabList[i].getInstances();
        var j;
        for (j = 0; j < instances.length; j++) {
            instances[j].play();
        }
    }
});

$( "#menubtn" ).click(function() {

    $(this).append(
            '<a href="#" class="list-group-item">'
            + defaultObjectName +
            '</a>'
            );
});

//creates a game engine object and dynamically adds html so it displays it 
//in the list
$( "#newobject" ).click(function() {
    // Clicking on this button only shows it, since it implies you want to see it.
    // Toggling show/hide is in panel menu.
    if (!objEditPanel.getVisible()) {
        objEditPanel.setVisible(true);
        $("#panelEditObject").hide();
        $("#panelEditObject").slideDown(300);
    }
    var defaultObjectName = 'GameObj' + GlobalPrefabList.length;
    createDefaultGameObj(defaultObjectName);
    
    $( "#objectlist" ).append(
            '<a href="#" class="list-group-item">'
            + defaultObjectName +
            '</a>'
            );

});

//swaps the panel from the game object type to the camera type
$( "#cameraEdit" ).click(function() {
    // Clicking on this button only shows it, since it implies you want to see it.
    // Toggling show/hide is in panel menu.
    if (!cameraEditPanel.getVisible()) {
        cameraEditPanel.setVisible(true);
        $("#panelEditCamera").hide();
        $("#panelEditCamera").slideDown(300);
    }
});

/*
$("#panelbar li").hover(function() {
        $('ul', this).stop().show();
    }, function() {
        $('ul', this).stop().hide();
    }
);*/

/*
//TODO: DOESN'T WORK
$( "#panelEditObjectClose" ).click(function() {
    // Hide it
    console.log("DEBUG: CLOSE BUTTON");
    if (objEditPanel.getVisible()) {
        objEditPanel.setVisible(false);
    }
});

//TODO: DOESN'T WORK
$( "#panelEditCameraClose" ).click(function() {
    // Hide it
    console.log("DEBUG: CLOSE BUTTON");
    if (cameraEditPanel.getVisible()) {
        cameraEditPanel.setVisible(false);
    }
});
*/

//------------------------------------------------------------
// Menu section
//------------------------------------------------------------

// From file menu
$( "#fileSave" ).click(function() {
    
    // Our data store
    var data = {};
    
    // Store the counter at index 0
    data[0] = GlobalCounter;
    // Store the objectlist html code
    data[1] = $('#objectlist').html();
    data[2] = functions;
    
    // Store all the objects as their getAllContents() ARRAYS, offsetting the index by 3
    for(i = 0; i < Global_ObjectList.length; i++){
        data[i + 3] = Global_ObjectList[i].getAllContents();
    }    
    localStorage.setItem('your_game', JSON.stringify(data));
   
    // Let the user know that the save has completed successfully
    alert("Saved successfully.");
});

// From file menu
$( "#fileLoad" ).click(function() {
    
    // Ensure global obj list is empty
    GlobalPrefabList = [];
    
    // Get the data
    var data = JSON.parse(localStorage.getItem('your_game'));
    // First get the counter and objectlist html back
    GlobalCounter = data[0];
    $('#objectlist').html(data[1]);
    functions = data[2];
    
    // Get the ARRAYS back (note they are offset by 2), and convert them back into ObjectContents
    var i;
    for (i = 3; i < Object.keys(data).length; i++) {
        var array = data[i];
        // TODO: In the future you need to save a string/numerical ID (so modify fileSave, fileLoad, and ObjContent's getAllContents() method)
        // to represent the type of renderable so you know what to instantiate GameObject (just below) with
        var restoredContent = new ObjectContent(new GameObject(new Renderable()));
        restoredContent.setName(array[0].value);
        var xf = restoredContent.getXform();
        xf.setXPos(array[1].value);
        xf.setYPos(array[2].value);
        xf.setRotationInDegree(array[3].value);
        xf.setWidth(array[4].value);
        xf.setHeight(array[5].value);
        restoredContent.setColor(array[6].value);
        restoredContent.setHexColor(array[7].value);
        restoredContent.setScriptUpdate(array[8].value);
        restoredContent.setCode(array[9].value);
        var j;
        for (j = 10; j < array.length; j++) {
            restoredContent.appendContent(array[j].label, array[j].value);
        }
        Global_ObjectList.push(restoredContent);
    }
});

// From panel menu
$( "#panelEditObjectMenu" ).click(function() {
    // Toggles show/hide
    if (objEditPanel.getVisible()) {
        objEditPanel.setVisible(false);
    } else {
        objEditPanel.setVisible(true);
        $("#panelEditObject").hide();
        $("#panelEditObject").slideDown(300);
    }
});

// From panel menu
$( "#panelEditCameraMenu" ).click(function() {
    // Toggles show/hide
    if (cameraEditPanel.getVisible()) {
        cameraEditPanel.setVisible(false);
    } else {
        cameraEditPanel.setVisible(true);
        $("#panelEditCamera").hide();
        $("#panelEditCamera").slideDown(300);
    }
});

// From panel menu
$( '#panelEditScriptUpdate' ).click(function() {
    // Toggles show/hide
    if (jsEditPanel.getVisible()) {
        // Hide
        jsEditPanel.setVisible(false);
        $('#scriptEditor').remove();
        $('#scriptUpdateOK').remove();
    } else {
        // Show
        jsEditPanel.setVisible(true);
        $('#panelEditJS').hide();
        $('#panelEditJS').slideDown(300);
        
        // Create a separate area within the panel for the editor
        var editorArea = $('#panelEditJS');
        var editorDiv = $('<div id="scriptEditor"></div>'); // You can insert default code between the divs, but I already gave the default code to GameObject's script update variable.
        editorArea.append(editorDiv);
        
        // Set up the editor
        editor = ace.edit('scriptEditor');
        editor.setTheme('ace/theme/monokai');
        editor.getSession().setMode('ace/mode/javascript');
        
        // Set a size for it
        $('#scriptEditor').width(250);
        $('#scriptEditor').height(250);
                
        // Add a button at the bottom
        editorArea.append('<br>');
        var button = $('<button type="button" id="scriptUpdateOK">OK</button>');
        button.click(function() {
            if (selected === null) {
                alert("You need to have a game object selected to do this.");
            } else {
                selected.setScriptUpdateSuccess(true);
                alert("Your update function has been set.");
                selected.setScriptUpdate(editor.getValue());
            }
        });
        editorArea.append(button);
        
        // Populate the text for the current object.
        // Note that changing objects or pressing some other button to open this panel also should also populate the text.
        // 7 = the update script
        editor.setValue(selected.getAllContents()[7].value);
    }
});

// From panel menu
$( '#panelEditFunctionMenu' ).click(function() {
    // Toggles show/hide
    if (functionEditPanel.getVisible()) {
        // Hide
        functionEditPanel.setVisible(false);
        $('#functionEditor').remove();
        $('#functionOK').remove();
    } else {
        // Show
        functionEditPanel.setVisible(true);
        $('#panelEditFunction').hide();
        $('#panelEditFunction').slideDown(300);
        
        // Create a separate area within the panel for the editor
        var editorArea = $('#panelEditFunction');
        var editorDiv = $('<div id="functionEditor"></div>'); // You can insert default code between the divs, but I already gave the default code to GameObject's script update variable.
        editorArea.append(editorDiv);
        
        // Set up the editor
        editorFunction = ace.edit('functionEditor');
        editorFunction.setTheme('ace/theme/monokai');
        editorFunction.getSession().setMode('ace/mode/javascript');
        
        // Set a size for it
        $('#functionEditor').width(400);
        $('#functionEditor').height(250);
                
        // Add a button at the bottom
        editorArea.append('<br>');
        var button = $('<button type="button" id="functionOK">OK</button>');
        button.click(function() {
            if (selected === null) {
                alert("You need to have a game object selected to do this.");
            } else {
                alert("Your function(s) have been set.");
                functions = editorFunction.getValue();
            }
        });
        editorArea.append(button);
        
        // Populate the text for the current object.
        editorFunction.setValue(functions);
    }
});

// From panel menu
$( '#panelEditCodeMenu' ).click(function() {
    // Toggles show/hide
    if (codeEditPanel.getVisible()) {
        // Hide
        codeEditPanel.setVisible(false);
        $('#codeEditor').remove();
        $('#codeOK').remove();
    } else {
        // Show
        codeEditPanel.setVisible(true);
        $('#panelEditCode').hide();
        $('#panelEditCode').slideDown(300);
        
        // Create a separate area within the panel for the editor
        var editorArea = $('#panelEditCode');
        var editorDiv = $('<div id="codeEditor"></div>'); // You can insert default code between the divs, but I already gave the default code to GameObject's script update variable.
        editorArea.append(editorDiv);
        
        // Set up the editor
        editorCode = ace.edit('codeEditor');
        editorCode.setTheme('ace/theme/monokai');
        editorCode.getSession().setMode('ace/mode/javascript');
        
        // Set a size for it
        $('#codeEditor').width(400);
        $('#codeEditor').height(250);
                
        // Add a button at the bottom
        editorArea.append('<br>');
        var button = $('<button type="button" id="codeOK">OK</button>');
        button.click(function() {
            if (selected === null) {
                alert("You need to have a game object or instance selected to do this.");
            } else {
                selected.setCodeSuccess(true);
                alert("Your code has been set.");
                selected.setCode(editorCode.getValue());
            }
        });
        editorArea.append(button);
        
        // Populate the text for the current object.
        // Note that changing objects or pressing some other button to open this panel also should also populate the text.
        // 8 = code
        editorCode.setValue(selected.getAllContents()[8].value);
    }
});

// From panel menu
$( '#panelChooseFunctionMenu' ).click(function() {
    // Toggles show/hide
    if (chooseFunctionPanel.getVisible()) {
        // Hide
        chooseFunctionPanel.setVisible(false);
        $('#panelChooseFunction').remove();
        $('#functionNameOK').remove();
        $('#functionScriptOK').remove();
        $('#scriptEditor').remove();
    } else {
        // Show
        chooseFunctionPanel.setVisible(true);
        
        $('#panelChooseFunction').hide();
        $('#panelChooseFunction').slideDown(300);
        
        // Create a separate area within the panel for the editor
        var editorArea = $('#panelChooseFunction');
        
        //
        var text = $('<textarea id="functionField"></textarea>');
        var functionNameOK = $('<button type="button" id="functionNameOK">Create/Edit</button>');
        editorArea.append(text);
        functionNameOK.click(function() {
            // Remove it if it's already there
            $('#functionScriptOK').remove();
            $('#scriptEditor').remove();
            
            var textValue = text.val();
            
            if (selected === null || selected instanceof GameObject) {
                alert("You need to have a prefab selected to do this.");
            } else if (selected instanceof Prefab) { // Which it must be
                // Create the function only if it's a new one (thus, it exists -- we can pull it up later)
                if (typeof selected[textValue] === "undefined") {
                    // Behaviors that occur upon clicking "Create/Edit" button on a Prefab for a NEW FUNCTION NAME:
                    
                    // Make new function
                    //selected[textValue] = new Function();
                    selected[textValue] = new WrappedFunction();
                    
                    // Add to function names list
                    selected.getFunctionNames().push(textValue);
                    
                    // Give all instances of this prefab a reference to that function
                    var i;
                    var instances = selected.getInstances();
                    for (i = 0; i < instances.length; i++) {
                        instances[i][textValue] = selected[textValue];
                        //console.log("DEBUG:\n" + instances[i][textValue].toString());
                    }
                }
                // Make the editor and pull up the function (which is now guaranteed to exist)
                var editorDiv;
                if (selected[textValue] instanceof WrappedFunction) {
                    editorDiv = $('<div id="scriptEditor">' + selected[textValue].getSource() + '</div>');
                } else {
                    editorDiv = $('<div id="scriptEditor">' + selected[textValue] + '</div>');
                }
                editorArea.append(editorDiv);
        
                // Set up the editor
                editorScript = ace.edit('scriptEditor');
                editorScript.setTheme('ace/theme/monokai');
                editorScript.getSession().setMode('ace/mode/javascript');
        
                // Set a size for it
                $('#scriptEditor').width(400);
                $('#scriptEditor').height(250);

                // Add a button at the bottom
                editorArea.append('<br>');
                var button = $('<button type="button" id="functionScriptOK">OK</button>');
                button.click(function() {
                    if (selected === null) {
                        alert("You need to have a prefab or instance selected to do this.");
                    } else {
                        // Get the value and do some substring work to get rid of repeated function headers
                        var value = editorScript.getValue();
                        var substring = value.substring(value.indexOf('{') + 2, value.lastIndexOf('}') - 1);
                        var i;
                        
                        // Get the prefab
                        var prefab;
                        if (selected instanceof Prefab) {
                            prefab = selected;
                        } else {
                            prefab = selected.getPrefab();
                        }
                            
                        // Give to prefab
                        //TODO!  CHANGE THIS SO THAT YOU MODIFY THE FUNCTION INSTEAD OF MAKE A NEW ONE, TO PRESERVE OTHER REFERENCES TO THIS FUNCTION
                        //prefab[textValue] = new Function(substring); // None of the instances' references will be able to follow this...thus, we have to give to all instances
                        if (prefab[textValue] instanceof WrappedFunction) {
                            // For new functions, it is fast; it updates all the references automatically
                            prefab[textValue].setSource(value);
                        } else {
                            // Basically it loops for all existing functions, which sucks
                            prefab[textValue] = new Function(substring);
                            var instances = prefab.getInstances();
                            for (i = 0; i < instances.length; i++) {
                                instances[i][textValue] = prefab[textValue];
                            }
                        }
                        
                        // Give to its instances
                        /*var instances = prefab.getInstances();
                        for (i = 0; i < instances.length; i++) {
                            //instances[i][textValue] = new Function(substring);
                            //instances[i][textValue] = prefab[textValue];
                            //console.log("DEBUG:\n" + instances[i][textValue].toString());
                        }*/
                        
                        alert("Your script has been set.");
                        $('#functionScriptOK').remove();
                        $('#scriptEditor').remove();
                        
                        // You can now call the function with selected[some_function_name]() or selected.some_function_name()
                    }
                });
                editorArea.append(button);
            }
        });
        editorArea.append(functionNameOK);
    }
});

//------------------------------------------------------------
// End of menus section
//------------------------------------------------------------

// TODO: DOESN'T WORK
/*
var highlightOn = function() {
    $(this).addClass('highlight-drag');
};
var highlightOff = function() {
    $(this).removeClass('highlight-drag');
};
$("#panelEditCamera").on('mousedown', highlightOn());
$("#panelEditObject").on('mousedown', highlightOn());
$("#panelEditCamera").on('mousedown', highlightOff());
$("#panelEditObject").on('mousedown', highlightOff());
*/

//$('li').on('click', '')

//This is probably the most confusing function

//Event gets called when any html <div> element gets clicked
//it further filters based on having a child html element that is of type <a>
//with a css class that is a list-group-item

// This function is for clicking any Prefab list item from the list, under the +GameObj button.
$( 'div' ).on('click', 'a.list-group-item', function() {

    //in JQuery you get access to the html item based on the 'this' keyword
    //in this case we get the DOM element that was clicked on
    
    /*
    if(selectedListItem === this){
        //dont do anything if we clicked on an already selected item
        return;
    }*/
    
    //remove all html elements with the css class of .delete
    $('.delete').remove();
    
    $('#createNewInstance').remove();   // remove any new instance buttons as well, we will create a new one
    
    
    //make it so the text boxes are no longer grayed out
    $("input").prop('disabled', false);
    //change the style of the deselected item to the generic list item style
    $(selectedListItem).attr('class','list-group-item' );
    
    
    //swap to the newly selected item
    selectedListItem = this;
    
    //we know we have selected a game object, make sure the camera panel isn't
    //showing
    cameraEditPanel.setVisible(false);
    objEditPanel.setVisible(true);
    
    // Make the create new instance button
    $(selectedListItem).append('<div class="delete">');
    var button = $('<button type="button" id="createNewInstance"><span class="glyphicon glyphicon-duplicate"></span></button>');
    button.click(function() {
        if (selected instanceof Prefab) {
            // The button is removed when selected changes to an instance,
            // but just to be sure for later, this will be checked (b/c new GO requires a PGO).
            //selected.createNewInstance();
            createDefaultInstance();
            //var newInstance = new GameObject(selected);
           // GlobalInstanceList[GlobalInstanceList.length] = newInstance;
            alert("A new instance has been created.");
        }
    });
    $(selectedListItem).append(button);
    // Feel free to make more buttons right here (just remove them by id above, AND in the changeInstanceTo function)
    $(selectedListItem).append('</div>');
    
    //we now are getting the game object that will be updated if the
    //user changes anything in the edit panel
    //the game object and the list item are connected by the name 
    
    changeSelected(findPrefabByName($(selectedListItem).text().trim()));
    
    //changed the style of the newly selected item to show that it is different
    //from the rest
    $(this).attr('class','list-group-item list-group-item-info' );
    
    //get the game object attributes and update the edit view
    if(selected !== null){
        updateEditView(selected.getAllContents());
    }
});


//update game object from edit view after the user has changed 
//any of it's values

//this event gets called after a textbox (html input) has been selected
//and then deselected

//Example: the user clicked the textbox and then hit tab, the event will get
//called after the tab because it has been "focused out" 

//Notice I'm using the .on syntax for dynamic html
$( 'div' ).on('focusout','.form-control', function() {
    
    if(selected !== null) {

        //get all of the values from the panel
        var enteredName = objEditPanel.getComponentVal('Name');
        var enteredX = objEditPanel.getComponentVal('XPos');
        var enteredY = objEditPanel.getComponentVal('YPos');
        var enteredRot = objEditPanel.getComponentVal('Rotation');
        var enteredW = objEditPanel.getComponentVal('Width');
        var enteredH = objEditPanel.getComponentVal('Height');
        if ($(this).attr('name') === "Color") {
            $(this).colorpicker({format:'rgba'});
        };
        var enteredColor = colorStringToRGBA(objEditPanel.getComponentVal('Color'));
        //disabled
        //var enteredScriptUpdate = objEditPanel.getComponentVal('Edit Script (Update)');
        
        var xform = selected.getXform();
        
        //update the selected game object based on the new values
        //it updates the value even if nothing changed 
        xform.setXPos(enteredX);
        xform.setYPos(enteredY);
        xform.setRotationInDegree(enteredRot);
        xform.setWidth(enteredW);
        xform.setHeight(enteredH);
        
        if (selected instanceof Prefab) {
            selected.setName(enteredName);
            selected.setColor(enteredColor);
            // Set this color for all the children
            /* no need to now with the inheritance
            var i;
            for (i = 0; i < GlobalInstanceList.length; i++) {
                if (GlobalInstanceList[i].getParent() === selected) {
                    GlobalInstanceList[i].setColor(enteredColor);
                }
            }*/
        }
        
        
        //----------------------
        //disabled: this works, but now, edit object will no longer edit scripts
        //
        //selectedContent.setScriptUpdate(enteredScriptUpdate);
        //----------------------
        
        //update the html display name
        //on the left hand panel
        //+ONLY IF IT IS A PGO
        if (selected instanceof Prefab) {
            $(selectedListItem).text(enteredName);
        }

    }
    
});

//color picker object sends an event every time its color is changed 
//This is no longer being used but shows how easy it is to use JQuery widgets
$('#colorPicker').colorpicker().on('changeColor.colorpicker', function(event){
    console.log("entry");
    var color = event.color.toRGB();
    var hexColor = event.color.toHex(); //required for setting the colorpicker value
    
    var red = color['r']/255;
    var green = color['g']/255;
    var blue = color['b']/255;
    var alpha = selected.getColor()[3];

     if(selected !== null){
         selected.setColor([red,green,blue,alpha]);
         //selected.setHexColor(hexColor);
     }
    
});
// End JQuery Events-----------------------------------------------------------

//gets the camera from my game an registers it globally for the 
//Game engine GUI 
var registerMainCamera = function(aCamera){
    GlobalCamera = aCamera;
};

// Make a new PGO
var createDefaultGameObj = function (defaultName){
    var prefab = new Prefab(defaultName);
    prefab.setColor([1,0,0,1]);

    
    selected = prefab;
    
    GlobalPrefabList[GlobalPrefabList.length] = prefab;
    //GlobalInstanceList[GlobalInstanceList.length] = new GameObject(pgo);
    
    createDefaultInstance();
    
    // Update counters
    /*GlobalIndex = Global_ObjectList.length; // TODO make us select that item & change findbyname -> find by idx
    GlobalCounter++;    // Can update before or after adding to list, doesn't matter
    
    Global_ObjectList[Global_ObjectList.length] = selectedContent;
    Global_InstanceList[Global_InstanceList.length] = new ObjectContent(selectedGameObject, true);*/
};

var createDefaultInstance = function() {
    if (selected instanceof Prefab) {
        var instance = selected.createNewInstance();
        instance.getXform().setPosition(20, 60);
        instance.getXform().setSize(5,5);
        instance.getXform().setRotationInDegree(20);
        var i;
        var names = selected.getFunctionNames();
        for (i = 0; i < names.length; i++) {
            instance[names[i]] = selected[names[i]];
        }
    }
};

var findPrefabByName = function(name){
    var i;
    for(i = 0; i < GlobalPrefabList.length; i++){
        if(GlobalPrefabList[i].getName() === name){
            return GlobalPrefabList[i];
        }
    }
    return null;
};


// NO LONGER USED 
/*
var findObjectByName = function(name){
    var i;
    
    //The current way selectedContent objects are found.  Later we want to change this to "by unique id (E.g. by original name)" or "by index".
    for(i = 0; i < Global_ObjectList.length; i++){
        if(Global_ObjectList[i].getName() === name){
            return Global_ObjectList[i];
        }
    }
    return null;
};

var findObjectAt = function(index){
    var result = null;
    if (index < Global_ObjectList.length) {
        result = Global_ObjectList[index];
    }
    return result;
};*/

function precise_round(num,decimals){
    var sign = num >= 0 ? 1 : -1;
    return (Math.round((num*Math.pow(10,decimals))+(sign*0.001))/Math.pow(10,decimals)).toFixed(decimals);
}

//this only updates the edit view if a game object is selected
//I need to make it more generic so any panel type can be selected and 
//updated with this function
var updateEditView = function(/*name,x,y,rotation,w,h,color*/ contentList){
    var i;
    for (i = 0; i < contentList.length; i++) {
        objEditPanel.updateComponent(contentList[i].label, contentList[i].value);
    }
    
    // Populate the text for the current object.
    // Note that changing objects or pressing some other button to open this panel also should also populate the text.
    // 8 = the update script
    if (editor !== null) {
        editor.setValue(contentList[7].value);
    }
    if (editorCode !== null) {
        editorCode.setValue(contentList[8].value);
    }
};

var windowResize = function() {
    var initWidth = 640.0;
    var initHeight = 480.0;
    var width = $(window).width() * 0.7;
    var height = (initHeight / initWidth) * width;
    
    $("#GLCanvas").width(width);
    $("#GLCanvas").height(height);
};

window.onresize = function(event) {
    windowResize();
};

//this gets called after the webpage has finished loading
$(document).ready(function(){
    initialzeView();
    $("#panelEditCamera").draggable();
    $("#panelEditObject").draggable();
    $("#panelEditJS").draggable();
    $("#panelEditFunction").draggable();
    $("#panelEditCode").draggable();
    $("#panelChooseFunction").draggable();


    $("#GLCanvas").draggable();
    windowResize();
    $("#panelEditObject").width(250);
    $("#panelEditCamera").width(250);
    $("#panelEditJS").width(250);
    $("#panelEditFunction").width(400);
    $("#panelEditCode").width(400);
});

//I'm bacially using this as a constructor
var initialzeView = function(){
    
    //these panels attach to the html ID 'panelStub'
    //go look for it in the index.html
    objEditPanel = new EditorPanel('panelEditObject', 'Edit Object');
    
    objEditPanel.createComponent('Name');
    objEditPanel.createComponent('XPos');
    objEditPanel.createComponent('YPos');
    objEditPanel.createComponent('Rotation');
    objEditPanel.createComponent('Width');
    objEditPanel.createComponent('Height');
    objEditPanel.createComponent('Color');
    objEditPanel.setVisible(true);
    
    
    cameraEditPanel = new EditorPanel('panelEditCamera', 'Edit Camera');
    cameraEditPanel.createComponent('example');
    cameraEditPanel.createComponent('not hooked up');
    cameraEditPanel.setVisible(false);
    
    jsEditPanel = new EditorPanel('panelEditJS', 'JavaScript Editor');
    jsEditPanel.setVisible(false);
    
    functionEditPanel = new EditorPanel('panelEditFunction', 'Function Editor');
    functionEditPanel.setVisible(false);
    
    codeEditPanel = new EditorPanel('panelEditCode', 'Code Editor');
    codeEditPanel.setVisible(false);
    
    chooseFunctionPanel = new EditorPanel('panelChooseFunction', 'Choose Function');
    chooseFunctionPanel.setVisible(false);
    
    //not really being used anymore I got it working in an earlier version
    //google bootstrap color picker for documentation on the widget
    $(function(){
        $('#colorPicker').colorpicker({format:'rgba'});
    });
    
    //this "grays out" any html input objects on init
    //we dont want the user to be able to edit something when nothing is 
    //currently selected
    $("input").prop('disabled', true);
};

var colorStringToRGBA = function(colorPickerString) {
    // We know the format of given string must be rgba(r,g,b,a) or r,g,b,a
    var colors;
    if (colorPickerString.startsWith("rgba(")) {
        // Format was: rgba(r,g,b,a)
        colors = colorPickerString.split("rgba(")[1].split(")")[0].split(",");
        colors[0] /= 255;
        colors[1] /= 255;
        colors[2] /= 255;
    } else {
        // Format was: r,g,b,a
        colors = colorPickerString.split(",");
    }
    return colors;
};

var deleteObject = function(index) {
    //TODO delete an object from the list and reduce the globalindex if necessary
};

var changeInstanceTo = function(i, j) {
    changeSelected(GlobalPrefabList[i].getInstances()[j]);

    updateEditView(selected.getAllContents());
    $('#createNewInstance').remove();
};

var changeSelected = function(newSelected) {
    if (newSelected !== selected) {
        $('#functionScriptOK').remove();
        $('#scriptEditor').remove();
    }
    selected = newSelected;
};