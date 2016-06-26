/* Represents the contents of an object, such as name, xform, and others,
 * with some functionality so it is easy to manipulate, get, and draw.
 */
var ObjectContent = function(referencedObj, isInstance){
    
    // Content definition
    function Content(label, value) {
        this.label = label;
        this.value = value;
    }
    
    // Array to hold additional contents
    this.contents = [];
    
    // Only used for drawing: all object modifications can be done here, in ObjectContent
    this.object = referencedObj;
    
    this.isInstance = isInstance; // Boolean.  True = instance, false = object from which you create instances
        
    /*
    this.ComponentList = {};
    this.parent = $("#"+htmlParentID);
    this.panel = null;*/
    
    /*this.initialize = function() {
        if (this.object === null) {
            return;
        }
        
        // Linked references
        //this.object.mName = this.name;
        //this.xform = referencedObj.getXform();
        //this.color = referencedObj.getColor();
        //this.hexColor = referencedObj.getHexColor();
        //referencedObj.mContents = this.contents;
        
        // Now, editing the name, xform, or contents of either will edit both
        
        
        //this.panel = $('<div class="panel panel-success" ></div>');
        //var heading = $('<div class="panel-heading"></div>');               
        //var icon = $('<span class="glyphicon glyphicon-edit">Edit</span>');
               
        //this.panel.append(heading.append(icon));
        
        
    };*/
    
    // Returns a new list with the name, xform info, and all contents in that order
    this.getAllContents = function() {
        var list = [];
        var xform = this.object.getXform();
        list[0] = new Content("Name", this.object.getName());
        list[1] = new Content("XPos", xform.getXPos());
        list[2] = new Content("YPos", xform.getYPos());
        list[3] = new Content("Rotation", xform.getRotationInDegree());
        list[4] = new Content("Width", xform.getWidth());
        list[5] = new Content("Height", xform.getHeight());
        list[6] = new Content("Color", this.object.getColor());
        // There are 2 places (besides fileLoad) in view.js that use a hard-coded value of 8 for the script.  Change them if needed.
        list[7] = new Content("Edit Script (Update)", this.object.getScriptUpdate());
        list[8] = new Content("Edit Code", this.object.getCode());
        var i;
        for (i = 0; i < this.contents.length; i++) {
            // Add each content to the end of the list
            list[i + 9] = this.contents[i];
        }
        return list;
    };
    
    // Returns an object with the name, xform info, and all contents in that order.
    this.getAllContentsAsObject = function() {
        // Feb 1: this function is unused.  I'll leave it here for if I use it.
        var xform = this.object.getXform();
        var obj = {
            // Note the naming convention is different than getAllContents()'s.
            name: this.object.getName(),
            xPos: xform.getXPos(),
            yPos: xform.getYPos(),
            rotation: xform.getRotationInDegree(),
            width: xform.getWidth(),
            height: xform.getHeight(),
            color: this.object.getColor(),
            hexcolor: this.object.getHexColor(),
            scriptUpdate: xform.getXPos(),
            code: this.object.getCode(),
            contents: this.contents
        };
        return obj;
    };
    
    // Adds a label (name) + value as a content to the list
    this.appendContent = function(label, value) {
        this.contents[this.contents.length] = new Content(label, value);
    };
    
    // Removes the content from the list at a given index
    this.removeContentAtIndex = function(index) {
        if (index > -1 && index < this.contents.length) {
            this.contents = this.contents.splice(index, 1);
        }
    };
    
    // Set a new script update
    this.setScriptUpdate = function(value) {
        this.object.setScriptUpdate(value);
    };
    
    // Get script update
    this.getScriptUpdate = function() {
        this.object.getScriptUpdate();
    };
    
    // Set a new code
    this.setCode = function(value) {
        this.object.setCode(value);
    };
    
    // Set a new name
    this.setName = function(value) {
        this.object.setName(value);
    };
    
    // Get name
    this.getName = function() {
        return this.object.getName();
    };
    
    // Is it an instance?
    this.isInstance = function() {
        return this.isInstance;
    };
    
    // Get xform based on the type
    this.getXform = function() {
        var result;
        if (this.isInstance) {
            result = this.object.getXform();
        } else {
            result = this.object.getInheritedXform();
        }
        return result;
    };
    
    // Set a new color
    this.setColor = function(value) {
        this.object.setColor(value);
        
        // Doing it this way does not break the reference link
        //this.color[0] = value[0];
        //this.color[1] = value[1];
        //this.color[2] = value[2];
        //this.color[3] = value[3];
    };
    
    // Set a new hex color
    this.setHexColor = function(value) {
        this.object.setHexColor(value);
    };
    
    // Add new content at the end
    this.appendContent = function(name, value) {
        this.contents.push(new Content(name, value));
    };
    
    // Edits a content
    this.editContentAt = function(index, value) {
        this.contents[index] = value;
    };
    
    // Gets a content
    this.getContentAt = function(index) {
        return this.contents[index].value;
    };
    
    // Get color
    this.getColor = function() {
        return this.object.getColor();
    };
    
    // Get the object's bbox
    this.getBBox = function() {
        return this.object.getBBox();
    };
    
    // Removes the content from the list at a given index
    this.draw = function(camera) {
        this.object.draw(camera);
    };
     
    // Update
    this.update = function() {
        this.object.update();
    };
    
    this.runAll = function(functions) {
        this.object.runAll(functions);
    };

    //Insert calls here------------------
    //
    //
    //
    //
    //this.initialize(); <-- not using that method anymore
    
    /*
    this.createComponent = function (name){
        this.panel.append('<br>');
        this.ComponentList[name] = new EditorComponent(name,this.panel);
        this.panel.append('<br>');
    };

    this.getComponentVal = function (name){
        return this.ComponentList[name].getVal();       
    };
    
    this.updateComponent = function (name,value){
        this.ComponentList[name].update(value);       
    };
    
    this.setVisible = function(bool){
        if(bool){
            this.parent.append(this.panel); 
        }
        else{
           this.panel.remove(); 
        }  
    };
    
    this.initialize();*/
    
};

/*
var EditorComponent = function(name, parent){
    
    //private variables
    this.displayName = name;
    this.displayValue = null;

    //html JQuery object references
    this.htmlParent = parent;
    this.htmlLabel = null;
    this.htmlInput = null;

    //still JQuery objects but for the purposes of CSS 
    this.cssInputGroup = null;
    this.cssDivider = null;
    
//    the HTML looks like this! --
//    
//    '<div class="input-group">'
//        '<label class="control-label col-sm-4"></label> '                           
//        '<div class="col-sm-8" >'
//           '<input type="text" class="form-control" value=""/>'
//        '</div>'
//    '</div> '

    
    this.initialize = function(){

        this.cssInputGroup = $('<div class="input-group"></div>');
        
        this.htmlLabel = $('<label class="control-label col-sm-4"></label> ');
        this.htmlLabel.text(this.displayName);
        
        this.cssDivider = $('<div class="col-sm-8" ></div> ');
        
        this.htmlInput = $('<input type="text" class="form-control" value="" name="' + this.displayName + '"/>');
       
        this.addToParent();
        
    };
    
    this.addToParent = function(){
        this.cssInputGroup.append(this.htmlLabel);
        this.cssInputGroup.append(this.cssDivider);
        this.cssDivider.append(this.htmlInput);
        this.htmlParent.append(this.cssInputGroup);
    };
    
    this.removeFromParent = function(){
        //if you remove the parent html all children will be 
        //removed as well
        this.cssInputGroup.remove();
    };
        
    this.getVal = function(){
        return this.htmlInput.val();
    };
    
    this.update = function(newValue){
        this.displayValue = newValue;
        this.htmlInput.val(this.displayValue);
    };
    
    this.initialize();
   
};*/


