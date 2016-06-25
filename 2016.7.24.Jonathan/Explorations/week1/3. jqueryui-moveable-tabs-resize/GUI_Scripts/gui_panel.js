/**
 * Created by MetaBlue on 6/24/16.
 */

var GuiPanel = function (PanelID, Height){
    this.PanelID = PanelID;
    this.guiTab = $(PanelID).tabs(); //Create the tabs
    if (Height !== undefined) this.guiTab.height(Height);
    $(PanelID + "Sortable").sortable({ //Make the second tab panel (bottom) sortable within itself
        opacity: 0.5, //Opacity while "sorting"
        stop: function() { //Refresh the tabs after a sort
            this.guiTab.tabs("refresh");
        },

        receive : function(event, ui) { //When we drag a tab from panel to panel, also move the content of the tab
            var linkHTML = (ui.item[0].innerHTML); //Get the moved elements <a> information
            //Get the href, which contains the tab name that we need to move
            var href = linkHTML.match(/href="([^"]*)/)[1];
            var divID = href.substring(1); //Remove the # since we won't be referring to it as a link
            $(href).detach().appendTo(PanelID); //Actually detach and move the tab
            this.guiTab.tabs("refresh");
            return true;
        }
    });
    return this;
};

GuiPanel.prototype.addTab = function ( tabName ){
    // ADD TAB THE PANELS TAB BAR
    $(this.PanelID + " ul").append(
        '<li><a href="#' + tabName + '">' + tabName + '</a></li>'
    );
    // ADD CONTENT CONTENT SHOULD GO INSIDE THIS SECTION
    $(this.PanelID).append(
        '<div id="' + tabName + '">' + tabName + ' content </div>'
    );
    this.guiTab.tabs("refresh"); // MUST BE REFRESHED
};

$( document ).ready(function() {

    // Create panels
    var panelID = "#panelBottom";
    var bottomPanel = new GuiPanel(panelID);
    bottomPanel.addTab("hi");

    panelID = "#panelLeft";
    // height of side panels is based on distance from bottom panel to the top
    var panelHeight = $(document).height() - parseInt($("#panelBottom").css("height")) - 10;
    GuiPanel(panelID, panelHeight);

    panelID = "#panelRight";
    GuiPanel(panelID, panelHeight);


    // allow tabs to be moved from each of the panels
    $( "#panelBottomSortable, #panelLeftSortable, #panelRightSortable").sortable({
        opacity: 0.5,
        connectWith: ".connectedSortable"
    });

    //Resizing -- some specific details
    $("#panelLeft").resizable({ handles: "e" });

    $("#panelBottom").resizable({
        handles: "n",
        resize: function(event, ui) {
            //Resize the left and right panels so they follow the bottom panel
            $("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
            $("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
            ui.position.top = $(document).height() - ui.size.height; //Works without this in firefox, not with chrome
        }
    });

    $("#panelRight").resizable({
        handles: "w",
        resize: function(event, ui) { //Fix for right panel repositioning on resize
            ui.position.left = 0;

        }
    });

    //On window resize
    $( window ).resize(function() {
        $("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
        $("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
    });

});