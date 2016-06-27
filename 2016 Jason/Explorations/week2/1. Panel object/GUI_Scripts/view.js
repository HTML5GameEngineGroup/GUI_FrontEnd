/**
 * Created by MetaBlue on 6/26/16.
 */
$( document ).ready(function() {
    var panelGroup = new GuiPanelGroup();
    // Create panels
    var panelID = "#panelBottom";

    var bottomPanel = new GuiPanel(panelID, panelGroup, GuiPanelType.BOTTOM);
    bottomPanel.addNewTab("hi");
    // var tab2 = new GuiPanelTab("bye");
    // bottomPanel.addTab(tab2);
    // tab2.appendContent("<p> hi there sucka </p>");

    panelID = "#panelLeft";
    // height of side panels is based on distance from bottom panel to the top
    var panelHeight = $(document).height() - parseInt($("#panelBottom").css("height")) - 10;
    var leftPanel = new GuiPanel(panelID, panelGroup ,GuiPanelType.LEFT, panelHeight);
    panelID = "#panelRight";
    var rightPanel = new GuiPanel(panelID, panelGroup, GuiPanelType.RIGHT, panelHeight);
    leftPanel.moveTabToThisPanel("hi");

    $("#panelRight").css("height", window.innerHeight - parseInt($("#panelBottom").css("height")) - 5);

    $("#panelLeft").css("height", window.innerHeight - parseInt($("#panelBottom").css("height")) - 5);
    /*
     //Resizing -- some specific details
     $("#panelLeft").resizable({ handles: "e" 

     });

     $("#panelBottom").resizable({
     handles: "n",
     resize: function(event, ui) {
     //Resize the left and right panels so they follow the bottom panel
     $("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
     $("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 5);
     $("#tab1").css("height", $(document).height() - parseInt($("#panelBottom").css("height")) - 55);
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
     //$("#panelBottom").css("top", $(document).height() - $("$panelBottom").height());
     // $("#panelRight").css("height", $(document).height() - parseInt($("#panelBottom").css("top")) - 5);
     //$("#panelLeft").css("height", $(document).height() - parseInt($("#panelBottom").css("top")) - 5);
     });
     */
});