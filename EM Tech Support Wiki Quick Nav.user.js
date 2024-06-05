// ==UserScript==
// @name         EM Tech Support Wiki Quick Nav
// @namespace    https://assaabloy.sharepoint.com/
// @version      1.5.45
// @description  Add shortcuts to the internal 810 Wire Technical Suppot Team for easier navigation to frequently used pages or external pages.
// @author       Ethan Millette, EMS Application Engineer
// @downloadURL  https://github.com/AAEthanM/AA-User-Scripts/raw/main/EM%20Tech%20Support%20Wiki%20Quick%20Nav.user.js
// @updateURL    https://github.com/AAEthanM/AA-User-Scripts/raw/main/EM%20Tech%20Support%20Wiki%20Quick%20Nav.user.js
// @match        https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/*
// @icon         https://cdn.worldvectorlogo.com/logos/assa.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_SuperValue
// @grant        GM_cookie
// @grant        GM_info
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// @noframes
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements*/

const currdate = "6/4/24";

(function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Constants for later access
    const hScalingAttr = 45.5;
    const vScalingAttr = 30;
    const hBorder = 5;
    const leftPush = -4;
    const defAttr = "font-family:Calibri;background:#F0F0F0;box-sizing:unset;flex-wrap:none;float:left;font-size:12px;position:absolute;cursor:pointer;padding:0px;z-index:1500;min-width:0px;width:"+hScalingAttr+"px;height:"+vScalingAttr+"px;";
    const insertDiv = document.getElementById('DeltaPlaceHolderLeftNavBar');
    const buttonsPerRow = 3;
    const frequentPagesCount = 5;
    const brian = "https://static.wikia.nocookie.net/surrealmemes/images/9/98/Commander_Brian.png"

    var buttons = [];
    var buttonsStatic = [];
    var references = {};
    var defButtons = [];

    //List category buttons that stay static and cant be edited
    var preButtonsStatic = [
        ["Home","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Home.aspx"],
        ["EMS","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Electromechanical%20Product%20Lines.aspx"],
        ["ACS","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Access%20Control%20Product%20Lines.aspx"],
        ["Alerts","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Product%20Alert%20Index.aspx"],
    ];

    //List of buttons in the customizable section
    var preButtons = [
        ["80 Series","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/80%20Series.aspx"],
        ["56-","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/56-.aspx"],
        ["59-","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/59-.aspx"],
        ["IN120","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/IN120-PX.aspx"],
        ["IN100","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/IN100.aspx"],
        ["8200","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/8200.aspx"],
        ["nT","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/nexTouch.aspx"],
        ["ED5000","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/ED5000.aspx"],
        ["8200 NAC","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/8200%20NAC%20info.aspx"],
        ["G1.5","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/G1.5.aspx"],
        ["KP","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/KP.aspx"],
        ["SN","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/SN.aspx"],
        ["DSR","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/DSR.aspx"],
        ["ML20900","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/ML20900.aspx"],
        ["Aperio Qs","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Aperio%20-%20Required%20Questions.aspx"],
        ["10 Line","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/10%20Line.aspx"],
        ["Yale 6000","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/6000%20Series.aspx"],
        ["8800FL","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/8800FL.aspx"],
        //["",""],
    ];

    //Table of errors to throw when applicable
    var errors = {
        "editBlank":     "Quick Nav Error: Bad Button Edit, one or both new button entries were left blank. Changes were not made.",
        "editURL":       "Quick Nav Error: Bad Button Edit, invalid URL entered (must include http:// or https://). Changes were not made.",
        "toggleSet":     "Quick Nav Error: Bad Toggle Button Initialization, GM_isShowing not set to boolean value.",
        "badHide":       "Quick Nav Error: Bad Hide Sequence, GM_isShowing not set to boolean value.",
        "WIP" :          "CAUTION: Maximum amount of buttons (for now) is 24. Please be patient while I smack my head on this some more.",
        "lastButton":    "Can not remove final button from list, changes not made...",
        "resetDefaults": "Are you sure you want to set Quick Nav to defaults?",
    }

    //Adds unique ID to each button that is generated dynamically for the main section, adds new dimension to default array
    //Button array: Title, Links, Element ID
    for(let i = 0; i < preButtons.length; i++) {
        buttons.push([preButtons[i][0],preButtons[i][1],("AAQNButton"+(i+1)).toString()]);
        defButtons.push([preButtons[i][0],preButtons[i][1],("AAQNButton"+(i+1)).toString()]);
    }

    //Reset persistent flags if an error in the JSON is found
    if(!parseJSONSafely(GM_getValue("masterButtons"))) {
        GM_setValue("masterButtons",JSON.stringify(buttons));
        GM_setValue("totalButtons",buttons.length);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Functional Code, Run at Startup
    //Creation of area box, static buttons within, add event listeners for clicks

    //Find current show/hide status and set text color, show/hide accordingly
    var firstToggleColor = GM_getValue("isShowing") ? "color:#C40000;" : "color:#038387;";
    var navAttr = GM_getValue("isShowing") ? "display:block;" : "display:none;";

    //Set default editing value to false
    GM_setValue("isEdit",false);

    var toggleAttr = firstToggleColor.concat("display:block;");
    var s = setButtonLimit();

    //Create box for link suggestions
    //Creating box4 needs to come before all others to stack the sections correctly
    var coverbox4 = addDiv("AAQNBox4","cover","border:3px solid #038387;padding:8px;top:0px;height:fit-content;min-width:91%;",insertDiv,"first","",'div');

    //Show suggestion box if set to show buttons
    if(GM_getValue("isShowing")) {coverbox4.style.display = 'block';}
    else if(!GM_getValue("isShowing")) {coverbox4.style.display = 'none';}
    else {alert(errors.badHide)}


    //if(GM_getValue("totalButtons")>buttons.length) {GM_setValue("totalButtons",buttons.length)}
    //Create box for main button section
    var coverbox = addDiv("AAQNBox","cover",navAttr.concat('height:'+resizeBox()+'px !important;'),insertDiv,"first","",'div');

    //Create box for static category buttons
    var coverbox2 = addDiv("AAQNBox2","cover",'min-height:' + (2*vScalingAttr+hBorder-1) + 'px;min-width:100%;',insertDiv,"first","",'div');

    //Create box for version info and adding current page to button list
    var coverbox3 = addDiv("AAQNBox3","cover",'border:none;min-height:20px',insertDiv,"first","",'div');

    //Create text in the link suggestion section that shows when edit mode is enabled. Add click handler to text to disable edit mode
    var editText = addDiv("AAQNEditText","editingButtonsText","top:5px;left:5px;display:none;",coverbox4,"first","Edit Mode Activated",'div');
    addClick(editText.id,toggleEdit, false);

    //Forming version text and info
    var vStr = "Quick Nav v" + GM_info.script.version + "<br></br>" + currdate
    var versionStr = addDiv("AAQNVersion","dummy","line-height:50%;display:block;margin-bottom:0em;font-size:10px;position:absolute;top:0px;",coverbox3,"first",vStr,'div');

    //Create edit icon and set click handler to toggle edit mode
    makeButton("", "", "AAQNEdit", navAttr, false, coverbox3, "first","editIcon");
    addClick("AAQNEdit",toggleEdit);

    //Create button to set the buttons to the hard-coded defaults, only when edit mode is enabled
    makeButton("Default","","AAQNSetDefaults","display:none;top:4px;width:50px;",false,coverbox4,"last","defaultButton");
    addClick("AAQNSetDefaults",setDefaults);

    //Create button to add a new custom button, add click handler
    makeButton("","","AAQNIncButton","top:40px;left:-28px;"+
               "background-image:url(https://cdn-icons-png.flaticon.com/128/1828/1828919.png);"
               ,false,coverbox3,"last","editingButtons");
    addClick("AAQNIncButton",addButton);

    //Create button to remove the last button in the list, add click handler
    makeButton("","","AAQNDecButton","top:60px;left:-28px;"+
               "background-image:url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHXAPDoIPop7SR4oP3dc4ICRzDkrr2Y6z_p8DW6Bg&s);"
               ,false,coverbox3,"last","editingButtons");
    addClick("AAQNDecButton",remButton);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Looping code for dynamically generated buttons, visible status, ID creation

    //Adds unique ID to each static button that sit over the toggle button for category selection
    for(let i = 0; i < preButtonsStatic.length; i++) {
        buttonsStatic.push([preButtonsStatic[i][0],preButtonsStatic[i][1],("AAQNButton"+(preButtonsStatic[i][0])).toString()]);
    }

    //Adds unique ID to each button that is generated dynamically for static category buttons
    for(let i = 0; i < buttonsStatic.length; i++) {
        makeButton(buttonsStatic[i][0],buttonsStatic[i][1],buttonsStatic[i][2],
                   defAttr.concat("display:inline-block;width:24.5%;top:0px;left:"+((hScalingAttr-0.5)*i-10)+"px"),
                   true, coverbox2, "first",)
        addClick(buttonsStatic[i][2],function() {navigateToURL(buttonsStatic[i][1])});
    }


    //Add Button for Toggling Visibility of Quick Nav, change colors when pressed, hide boxes
    var toggleStatus = "";

    //If buttons are set to show, set text and arrow direction when collapsing/extending
    if(GM_getValue("isShowing")) {
        toggleStatus = '\u2191 Toggle Show/Hide \u2191'; //Change direction of arrows depending on cascade status
    } else if(!GM_getValue("isShowing")) {
        toggleStatus = '\u2193 Toggle Show/Hide \u2193';
    } else {toggleStatus = 'Toggle Show/Hide'; alert(errors.toggleSet)}

    //Create button that toggles whether or not the main buttons are being shown
    makeButton(toggleStatus,"","AAQNButtonToggle",
               defAttr.concat(toggleAttr,"font-size:15px;width:99.5%;height:32px;top:"+(vScalingAttr+1)+"px;left:-10px;"),
               false, coverbox2, "first");
    var toggleButton = document.getElementById("AAQNButtonToggle");
    toggleButton.style.fontSize = "15px";
    addClick("AAQNButtonToggle",toggleVisible);

    //Refresh Cookies before actions take place
    refreshCookies();
    mainButtons();

    //ASSA ABLOY Link Counter Add-on
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Gather current URL for count storage
    var currURL = window.location.href.toString();
    //Trim the fat and get just the name of the Sharepoint page instead of the https:// etc.
    var nameURL = formatEntry(currURL.substring(82,window.location.href.toString().length-5));
    //Retrieve current link count from persistent memory
    var linksStored = GM_SuperValue.get("linksStored");
    //Sort the links by usage amount
    var linksSorted = sortLinks();
    //Filter links seen in list
    for(let j = 0; j < linksSorted.length; j++) {
        var links = JSON.parse(GM_getValue("masterButtons")).concat(buttonsStatic);
        for(let i = 0; i < links.length; i++) {
            if(links[i][1] == linksSorted[j][2]) {
                linksSorted[j][3] = true;
            }
        }
    }

    var shownButtons = [];

    for(let i = 0; i < linksSorted.length; i++) {
        if(!linksSorted[i][3]) {
            shownButtons.push([linksSorted[i][0],linksSorted[i][1],""]);
        }
    }
    console.log(linksSorted);


    var boxText;
    //Format suggestion box on the page
    var suggestionbox = addDiv("AALCSuggestionBox","",
                               "font-size:12px;position:relative;display:block;padding:0px;top:30px;left:-6px;height:"+(Math.min(frequentPagesCount,shownButtons.length)*40+80)+"px;min-width:100%;",
                               coverbox4,"last","<b><u>Suggested Buttons:</b></u><br></br>",'div');

    var suggestionTitle = addDiv("AALCSuggestionTitle","",
                                 "position:relative;top:10px;",
                                 suggestionbox,"last","",'div');

    //Make button to clear the suggested links and clear out the cookie that stores them and set click handler
    makeButton("Clear Suggested","","AALCClearStored","color:red;display:none;position:absolute;font-size:9px;left:110px;top:-10px;width:15px;height:30px;padding:0px;",false,suggestionbox,"first","");
    var clearBtn = document.getElementById("AALCClearStored");
    addClick("AALCClearStored",() => {
        deleteLinks();
    });
    var sideBarSpacing = addDiv("AALCSpacing","","height:20px;",coverbox4,"last","",'div');

    //Refresh the link suggestions if there are no main buttons seen
    if(!shownButtons.length) suggestionTitle.innerHTML = refreshFrequent();

    //Truncate the links to remove extraneous data
    var shownButtonsShortened = truncateLinks(shownButtons);

    //Loop over how many suggestions are being shown and create add/ignore buttons alongside them
    for(let i = 0; i < Math.min(frequentPagesCount,shownButtons.length); i++) {
        //Add the actual text for the suggested link
        var elmt = addDiv("AALCShown"+(i+1),"suggestionList","top:"+(40+(40*i))+"px;",suggestionbox,"last","<u>"+shownButtonsShortened[i][2]+"</u>",'div');
        addClick("AALCShown"+(i+1),() => {
            window.location = linksStored[locateEntry(linksStored,shownButtons[i][0])][2];
        });

        //Click handler for redirecting to the suggested page if the title is clicked directly
        document.getElementById("AALCShown"+(i+1)).addEventListener('mousedown', e => {
            if (e.button === 1) {
                window.open(linksStored[locateEntry(linksStored,shownButtons[i][0])][2]);
                e.preventDefault();
            }
        });

        //Add specific Add and Ignore buttons on the suggested links
        makeButton("Add","","AALCAdd"+(i+1),"top:"+(40+(40*i))+"px;right:2px;",false,suggestionbox,"last","suggestionChange");
        makeButton("Ignore","","AALCIgnore"+(i+1),"top:"+(40+(40*i))+"px;right:25px;",false,suggestionbox,"last","suggestionChange");

        //Add click handler for Add button
        addClick("AALCAdd"+(i+1),() => {
            //Create references for buttons to navigate around
            var testelm1 = document.getElementById("AALCAdd"+(i+1));
            var testelm2 = document.getElementById("AALCShown"+(i+1));
            var testelm3 = document.getElementById("AALCIgnore"+(i+1));
            //Remove suggested link text, Add button, and Ignore button when clicked
            testelm1.remove();
            testelm2.remove();
            testelm3.remove();

            shownButtons.splice(shownButtons.length,1)
            addButton(false,shownButtons[i][0],linksStored[locateEntry(linksStored,shownButtons[i][0])][2]);
            //linksSorted = sortLinks();
            suggestionTitle.innerHTML = refreshFrequent(shownButtons.length-1);
            window.location = window.location.href;
        });

        //Add click handler for Ignore button
        addClick("AALCIgnore"+(i+1),() => {
            //Create references for suggested link text, Add button, and Ignore button
            var testelm1 = document.getElementById("AALCAdd"+(i+1));
            var testelm2 = document.getElementById("AALCShown"+(i+1));
            var testelm3 = document.getElementById("AALCIgnore"+(i+1));
            //Remove suggested link text, Add button, and Ignore button when clicked
            testelm1.remove();
            testelm2.remove();
            testelm3.remove();
            shownButtons.splice(shownButtons.length,1)
            //linksSorted = sortLinks();
            suggestionTitle.innerHTML = refreshFrequent(shownButtons.length-1);

            linksStored[locateEntry(linksStored,testelm2.innerHTML.replace("<u>","").replace("</u>",""))][3] = true;
            GM_SuperValue.set("linksStored",linksStored);
            window.location = window.location.href;
        });
    }

    GM_SuperValue.set("linksStored",linksStored);

    //Create button to add the current page as a button if it hasn't been added already
    makeButton("Add Current Page","","AALCAddCurrent","font-size:20px;height:20px;top:-5px;width:100px;padding:0px;position:relative;float:right;right:-5px;display:" +
               (pageFound(JSON.parse(GM_getValue("masterButtons")),currURL)||pageFound(buttonsStatic,currURL) ? "none" : "block") +";"
               ,false,coverbox3,"first");
    var addCurrent = document.getElementById("AALCAddCurrent");
    addCurrent.style.fontSize = "12px";
    addClick("AALCAddCurrent",() => {
        addCurrentPage();
    });

    var test = document.createElement("img");
    test.setAttribute("id","BrianGriffin");
    suggestionbox.insertBefore(test,suggestionbox.lastChild);
    test.setAttribute("style", "float:left;position:absolute;padding:0px;z-index:1500;min-width:0px;width:"+hScalingAttr+"px;height:"+vScalingAttr+"px;");
    test.src = brian;

    const newspaperSpinning = [
        { transform: "rotate(0)" },
        { transform: "rotate(360deg) scale(1)" },
        { transform: "translateY(0px)" },
        { transform: "translateY(-800px)" },
    ];

    const newspaperTiming = {
        duration: 2000,
        iterations: 1,
    };

    test.addEventListener("click", () => {
        test.animate(newspaperSpinning, newspaperTiming);
        test.animate([{transform: "scale(0)"}],{duration: 1});
        Promise.all(test.getAnimations().map((animation) => animation.finished)).then(
            () => test.remove(),
        );
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Function Access

    function mainButtons(flag) { //Main loop to instantiate the buttons that are invisible on page load, set style, color if applicable, insert in bounding box
        var totalButtonIndex = 0;
        for(let j = 0; j < setButtonLimit(); j++) {
            for(let i = 0; i < buttonsPerRow; i++) {
                if(totalButtonIndex >= GM_getValue("totalButtons")) {break;}
                totalButtonIndex++;
                var bColorIO = "";
                var bAttr = "";
                if(buttons[i+(j*buttonsPerRow)] == undefined) {break;}
                if(flag) bAttr = defAttr.concat("color:red;"); else bAttr = defAttr;
                if(buttons[i+(j*buttonsPerRow)][0].length>20) buttons[i+(j*buttonsPerRow)][0] = buttons[i+(j*buttonsPerRow)][0].substring(0,20) + "..."
                makeButton(buttons[i+(j*buttonsPerRow)][0], buttons[i+(j*buttonsPerRow)][1], buttons[i+(j*buttonsPerRow)][2],
                           bAttr.concat(navAttr,bColorIO,""+
                                        "position:absolute;width:"+(Math.floor(180/buttonsPerRow)-1)+"px;"+
                                        "left:"+(Math.floor(180/buttonsPerRow)*i+leftPush+(-6))+"px;"+
                                        "top:"+(vScalingAttr*j+j)+"px;"),
                           true, coverbox, "last","buttonDummy");
                addClick(buttons[i+(j*buttonsPerRow)][2], () => navigateToURL(buttons[i+(j*buttonsPerRow)][1]));
            }
        }
    }

    function addDiv(id, cls, style, loc="", itemloc="",name,type) { //Dynamically add div with function, size, location, and ID
        var elm = document.createElement(type);
        if(name) elm.innerHTML = name;
        elm.setAttribute("id",id);
        elm.setAttribute("class",cls);
        elm.setAttribute("style",style);
        if(loc === "") {loc = document.body.appendChild(elm);} else {
            if(itemloc.includes("first")) {loc.insertBefore(elm,loc.firstChild);}
            else if(itemloc.includes("last")) {loc.insertBefore(elm,loc.lastChild);}
            else if(itemloc === "") {loc.insertBefore(elm,loc.lastChild);}
        }
        return elm;
    }

    function hideMainButtons() { //Hide main buttons as a transition to updating them with new info
        var totalButtonIndex = 0;
        var elm;
        for(let i = 0; i < JSON.parse(GM_getValue("masterButtons")).length; i++) {
            if(totalButtonIndex-1 > GM_getValue("totalButtons")) {break;}
            totalButtonIndex++;
            if(document.getElementById(buttons[i][2])) {
                elm = document.getElementById(buttons[i][2]);
            } else {break;}
            elm.remove();
        }
    }

    function makeButton(name, url, id, prop, isLink, loc = "", itemloc = "", cls = "") { //Create button with specifications, "prop" will override CSS style in cls
        var button = document.createElement("button");
        button.type = "button";
        if(name.length>14) prop+="font-size:9px;";
        button.innerHTML = name;
        button.setAttribute("id", id);
        if(cls) {
            button.setAttribute("class",cls);
        }
        button.setAttribute("style", prop);
        if(isLink){button.addEventListener('mousedown', e => {if (e.button === 1) {window.open(url);e.preventDefault();}});} //Add middle click function
        if(loc === "") {loc = document.body.appendChild(button);} else {
            if(itemloc.includes("first")) {loc.insertBefore(button,loc.firstChild);}
            else if(itemloc.includes("last")) {loc.insertBefore(button,loc.lastChild);}
            else if(itemloc === "") {}
        }
    }

    function addClick(id, func) { //Add event listener to button with desired anonymous function
        var button = document.getElementById(id);
        references[id] = func;
        button.addEventListener("click", func, false);
    }

    function navigateToURL(url) { //Navigate to specified URL, used in anonymous functions to not be called on instantiation
        window.location = url;
    }

    function removeClick(id, func) { //Remove event listener from specified button
        var elm = document.getElementById(id);
        elm.removeEventListener("click",func);
    }

    function toggleVisible() { //Function to toggle visibility when Show/Hide is pressed, change colors, hide boxes
        var totalButtonIndex = 0;
        //Find and create reference to show/hide button and set defaults button
        var toggleButton = document.getElementById("AAQNButtonToggle");
        var setDef = document.getElementById("AAQNSetDefaults");

        for(let i =0; i < buttons.length; i++) { //Iterate over how many buttons there are
            if(totalButtonIndex >= GM_getValue("totalButtons")) {break;} //break condition if the index is too high
            totalButtonIndex++; //secondary iterative increment
            var navBtns = document.getElementById(buttons[i][2].toString()); //Collect relevant buttons current in the nav section
            if(GM_getValue("isShowing")) {navBtns.style.display = 'none';} //Display the buttons
            else if(!GM_getValue("isShowing")) {navBtns.style.display = 'block';}
            else {alert(errors.badHide)}
        }

        if(GM_getValue("isShowing")) { //Hide editing buttons and change text color of visibility button text
            for(let i = 0; i < document.getElementsByClassName("editingButtons").length; i++) {
                document.getElementsByClassName("editingButtons")[i].style.display = "none";
            }
            for(let i = 0; i < document.getElementsByClassName("editingButtonsText").length; i++) {
                document.getElementsByClassName("editingButtonsText")[i].style.display = "none";
            }
            for(let i = 0; i < document.getElementsByClassName("defaultButton").length; i++) {
                document.getElementsByClassName("defaultButton")[i].style.display = "none";
            }
            toggleButton.innerHTML = '\u2193 Toggle Show/Hide \u2193';
            toggleButton.style.color = '#038387';
            GM_setValue("isShowing",false);
            coverbox.style.display = 'none';
            coverbox4.style.display = 'none';
        } else { //Hide editing buttons and change text color of visibility button text
            toggleButton.innerHTML = '\u2191 Toggle Show/Hide \u2191';
            toggleButton.style.color = '#C40000';
            GM_setValue("isShowing",true);
            coverbox.style.display = 'block';
            coverbox4.style.display = 'block';
            if(GM_getValue("isEdit")) {
                for(let i = 0; i < document.getElementsByClassName("editingButtons").length; i++) {
                    document.getElementsByClassName("editingButtons")[i].style.display = "block";
                }
                for(let i = 0; i < document.getElementsByClassName("editingButtonsText").length; i++) {
                    document.getElementsByClassName("editingButtonsText")[i].style.display = "block";
                }
                for(let i = 0; i < document.getElementsByClassName("defaultButton").length; i++) {
                    document.getElementsByClassName("defaultButton")[i].style.display = "block";
                }
            }
        }
    }

    function toggleEdit() { //Toggle Edit Mode, color buttons for visiblity, auto-update box size based on amount of visible buttons
        var totalButtonIndex = 0;

        //Find and create reference to editing buttons
        var editText = document.getElementById("AAQNEditText");
        var setDef = document.getElementById("AAQNSetDefaults");
        var incButton = document.getElementById("AAQNIncButton");
        var decButton = document.getElementById("AAQNDecButton");
        var clearBtn = document.getElementById("AALCClearStored");

        if(GM_getValue("isEdit")) { //STOP EDITING
            GM_setValue("isEdit",false);
            suggestionbox.style.height = suggestionbox.style.height-40;
            //Hide all editing related buttons
            editText.style.display = 'none';
            setDef.style.display = 'none';
            incButton.style.display = 'none';
            decButton.style.display = 'none';
            clearBtn.style.display = 'none';
            //
            for(let j = 0; j < s; j++) {
                for(let i = 0; i < buttonsPerRow; i++) {
                    if(totalButtonIndex >= GM_getValue("totalButtons")) {break;}
                    totalButtonIndex++;
                    var navBtns = document.getElementById(buttons[i+(j*buttonsPerRow)][2].toString());
                    navBtns.style.background = "#F0F0F0";
                    removeClick(buttons[i+(j*buttonsPerRow)][2],references[buttons[i+(j*buttonsPerRow)][2]]);
                    refreshCookies();
                    addClick(buttons[i+(j*buttonsPerRow)][2], () => navigateToURL(buttons[i+(j*buttonsPerRow)][1]));
                }
            }
        }
        else { //START EDITING
            GM_setValue("isEdit",true);
            suggestionbox.style.height = suggestionbox.style.height+40;
            //Show all editing related buttons
            editText.style.display = 'block';
            setDef.style.display = 'block';
            incButton.style.display = 'block';
            decButton.style.display = 'block';
            clearBtn.style.display = 'block';
            for(let j = 0; j <= s; j++) {
                for(let i = 0; i < buttonsPerRow; i++) {
                    if(totalButtonIndex >= GM_getValue("totalButtons")) {break;}
                    totalButtonIndex++;
                    navBtns = document.getElementById(buttons[i+(j*buttonsPerRow)][2].toString());
                    navBtns.style.background = "red";
                    removeClick(buttons[i+(j*buttonsPerRow)][2],references[buttons[i+(j*buttonsPerRow)][2]]);
                    addClick(buttons[i+(j*buttonsPerRow)][2], () => getNewButton([buttons[i+(j*buttonsPerRow)][2]]));
                }
            }
        }
    }

    function setCookie(name,value,type) { //Set cookie for value access across page reloads
        var expires = "";
        var date = new Date();
        //Set expiry date for cookie to be in 100 years
        date.setTime(date.getTime() + (100*365*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = name.concat(type||"") + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) { //Get cookie value across page reloads
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
    }

    function eraseCookie(name) { //Erase cookies when setting defaults buttons
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function refreshCookies() { //Refresh Cookies to have the storage arrays access fresh data when reloading page
        buttons = JSON.parse(GM_getValue("masterButtons"));
        for(let i = 0; i < JSON.parse(GM_getValue("masterButtons")).length; i++) {
            if(getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"name") && getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"url")) {
                buttons[i][0] = getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"name");
                buttons[i][1] = getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"url");
            }
        }
        GM_setValue("masterButtons",JSON.stringify(buttons));
    }

    function setDefaults() { //Return button array to defaults, without using cookies for button data
        if(confirm(errors.resetDefaults)) {
            GM_setValue("masterButtons",JSON.stringify(defButtons));
            GM_setValue("totalButtons",preButtons.length);
            for(let i = 0; i < buttons.length; i++) {
                eraseCookie(buttons[i][2]+"name");
                eraseCookie(buttons[i][2]+"url");
            }
            window.location = window.location.href; //Forcibly refresh the page
        }
    }

    function getNewButton(id) { //Prompt for new button/change existing button details
        var elm,name,url,nid,uid;
        if(document.getElementById(id)) { //Check if the button exists first
            //Create new button with user-prompted title and link
            elm = document.getElementById(id);
            name = prompt("Enter new title to replace " + elm.innerHTML);
            url = prompt("Enter new URL to replace " + elm.innerHTML);

            if(!name || !url) { //Error handling if title or link are blank
                alert(errors.editBlank);
                return;
            } else if(!isValidHttpUrl(url)){ //Error if URL is not formatted properly
                alert(errors.editURL);
                return;
            } else { //Create the button if no error
                elm.innerHTML = name;
                nid = id+"name";
                uid = id+"url"
                setCookie(nid,name)
                setCookie(uid,url)
            }
        }
    }

    function isValidHttpUrl(string) { //Checks if given URL is valid to be added to buttons
        let url;
        try { //Check if passed URL is valid
            url = new URL(string);
        } catch (_) {
            return false;
        }
        //Return if URL passes https or http formatting, fail if not
        return url.protocol === "https:" || url.protocol === "http:";
    }

    function addButton(pmt=true,name,link) { //Increment amount of buttons
        //If you are adding a button and the cookie says there's more button then there are......
        if(GM_getValue("totalButtons")>=buttons.length) {
            if(pmt) { //If a prompt is needed...
                var title = prompt("Enter Title for new Button"); //...Collect Title and Link for new button...
                var url = prompt("Enter Link for new Button");
            } else { //...else use current title and link
                title = name;
                url = link;
            }
            if(!title || !url) { //Error if the title or the link are bad
                alert(errors.editBlank);
            } else {
                //Commit list of buttons to persistent memory
                //Create reference to new button
                var nid = "AAQNButton"+(buttons.length+1)+"name";
                var uid = "AAQNButton"+(buttons.length+1)+"url"

                //Add it to the button array
                buttons.push([title,url,"AAQNButton"+(buttons.length+1)]);

                //Apply it to persistent memory
                GM_setValue("masterButtons", JSON.stringify(buttons));
                setCookie(nid,title);
                setCookie(uid,url);

                //Increment total button count in integer form (can just update based on existing persistent memory but... nah)
                GM_setValue("totalButtons",GM_getValue("totalButtons")+1);

                //Do a full button refresh
                hideMainButtons();
                mainButtons();
                //Must be called twice to properly refresh edit states
                toggleEdit();
                toggleEdit();

                //Resize box to accomodate potential new row of buttons
                coverbox.style.height = resizeBox() + "px";
            }

        } else { //......freak out and reset if the cookie says there's more button then there are...
            GM_setValue("totalButtons",GM_getValue("totalButtons")+1);
            setButtonLimit();
            hideMainButtons();
            mainButtons();

            //Must be called twice to properly refresh edit states
            toggleEdit();
            toggleEdit();

            //Resize box
            coverbox.style.height = resizeBox() + "px";
        }
    }

    function remButton() { //Decrement amount of buttons
        if(!GM_getValue("totalButtons")) { //If the cookie is not set properly,
            GM_setValue("totalButtons",buttons.length); //Fix it by setting it to current button count
        } else if(GM_getValue("totalButtons") == 1) { //Edge case error if only one button remains and the user deletes it
            alert(errors.lastButton);
        } else {
            GM_setValue("totalButtons",GM_getValue("totalButtons")-1);
            var delButton = document.getElementById("AAQNTest");
            var elm = JSON.parse(GM_getValue("masterButtons"));
            var slt = elm[GM_getValue("totalButtons")]
            var del = document.getElementById(elm[elm.length-1][2]);
            del.remove();
            elm.splice(elm.length-1,1);
            GM_setValue("masterButtons",JSON.stringify(elm));
            eraseCookie("AAQNButton" + (GM_getValue("totalButtons") + 1) + "url");
            eraseCookie("AAQNButton" + (GM_getValue("totalButtons") + 1) + "name");
            refreshCookies();

            //Must be called twice to properly refresh edit states
            //toggleEdit();
            //toggleEdit();


            coverbox.style.height = resizeBox() + "px";
        }
    }

    function truncateLinks(list) { //
        //Set page title character limit
        var lengthLimit = 40;

        for(let i = 0; i < list.length; i++) { //For all pages in suggestion list, if the title is longer than the character limit...
            if(list[i][0].length>=lengthLimit) {
                list[i][2] = list[i][0].substring(0,lengthLimit) + "..."; //...Clip it down to character limit and add ellipsis
            } else { //If it's not, don't adjust the page and use the entire page name in the array
                list[i][2] = list[i][0]
            }
        }
        return list;
    }

    function setButtonLimit() { //Function to globally set how many rows of buttons there are according to how many total and how many buttons per row are visible
        s = Math.ceil(JSON.parse(GM_getValue("masterButtons")).length/buttonsPerRow);
        return s;
    }

    function resizeBox() { //Update size of bounding box to account for total amount of buttons
        if(GM_getValue("totalButtons") != 0) {
            return ((vScalingAttr+1)*Math.ceil(GM_getValue("totalButtons")/buttonsPerRow)+1)
        } else {
            return 0
        }
        //return GM_getValue("totalButtons") ? ((vScalingAttr+1)*Math.ceil(GM_getValue("totalButtons")/buttonsPerRow)) : (s*(vScalingAttr+1)+1);
    }

    function sortLinks() { //
        //Retrieve links from persistent storage
        linksStored = GM_SuperValue.get("linksStored");
        if(!linksStored) {
            linksStored = [[nameURL,0,currURL]];
        }

        for(let i = 0; i < linksStored.length; i=i+1) {
            if(linksStored[i][0]==nameURL) {
                linksStored[i][1]++;
                break;
            } else {
                if(i==linksStored.length-1&&currURL.substring(currURL.length-5,currURL.length)==".aspx") {
                    linksStored.push([nameURL,0,currURL])
                }
            }
        }
        return linksStored.sort(function(a, b) {return b[1] - a[1];});
    }

    function refreshFrequent(amt=shownButtons.length) { //Check if there are any pages stored in the suggested links array, if not, say so
        boxText = "";
        var pageCount = Math.min(amt,frequentPagesCount);
        if(!pageCount) {
            return "No recent pages found. Navigate to buttonless pages to see suggestions.";
        } else {
            return ""
        }
    }

    function pageFound(arr,url) { //Check whether or not a given page is found in the button array
        for(let i = 0; i < arr.length; i++) {
            if(currURL == arr[i][1]) {
                return true;
            }
        }
        return false
    }

    function addCurrentPage(name, url) { //Add the current wiki page as a button, add the formatted link to the button array, refresh page to add button
        if(!pageFound(JSON.parse(GM_getValue("masterButtons")),currURL)) {
            addButton(false,document.getElementById("DeltaPlaceHolderPageTitleInTitleArea").innerText,currURL);
            linksStored.splice(locateEntry(linksStored,nameURL));
            window.location = window.location.href;
        }
    }

    function deleteLinks() { //Clear suggested links and delete entries in persistent storage
        if(confirm("Clear suggested link data? This is reset all link counts and reset all ignored links.")) {
            GM_deleteValue("linksStored");
            window.location = currURL;
        }
    }

    function formatEntry(str) { //Change special characters sequences to their formatted characters
        //White space conversion
        while(str.includes("%20")) {
            str = str.toString().replace("%20"," ");
        }
        //Backslash conversion
        while(str.includes("%27")) {
            str = str.toString().replace("%27","\'");
        }
        return str;
    }

    function locateEntry(arr, str) { //Simple search for entries in second dimension of 2D array
        for(let i = 0; i < arr.length; i++) {
            if(arr[i][0] == str) {
                return i;
            }
        }
    }

    function parseJSONSafely(str) {
        try {
            return JSON.parse(str)
        }
        catch (e) {
            // Return a default object, or null based on use case.
            return false;
        }
    }
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//CSS Styles for HTML Elements
GM_addStyle ( `
    .dummy {
    }
    .buttonDummy {
    }
    .editingButtons {
        display:none;
        position:absolute;
        width:10px;
        height:10px;
        top:0px;
        padding:7px;
        background-size:14px !important;
        border:none;
        min-width:1px !important;
        min-height:1px !important;
        cursor:pointer;
    }
    .editingButtonsText {
        display:none;
        position:absolute;
        height:10px;
        top:0px;
        left:0px;
        padding:0px;
        float:left;
        font-family:Calibri;
        color:red;
        font-size:13px;
        cursor:pointer;
        padding:0px;
    }
    .staticButtons {
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 1500;
        cursor: pointer;
        width: 100px;
    }
    .editIcon {
        position:         absolute;
        float:            left;
        background-size:  14px !important;
        padding:          7px;
        border:           none;
        min-width:        1px !important;
        min-height:       1px !important;
        left:             -28px;
        top:              5px;
        background-image: url(https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png);
    }
    .cover {
        position: relative;
        display: block;
        z-index: 1500;
        min-width: 100%;
        left:0px;
        top: 0px;
        border: 3px solid red;
        opacity: 0.8;
        border: 3px solid #038387;
        min-width: 100%;
    }
    .defaultButton {
        padding:0px;
        color:red;
        display:none;
        position:absolute;
        float:left;
        font-size:11px;
        height:15px;
        left:113px;
        top:-2px;
        min-width:30px;
        height:20px;
        min-width:fit-content;
    }
    .suggestionList {
        position: absolute;
        color: blue;
        height: 20px;
        padding: 0px;
        font-size: 10px;
        width: 65%;
        cursor: pointer;
    }
    .suggestionChange {
        min-width:15px;
        height:20px;
        padding:0px;
        position:absolute;
        float:right;
    }
` );
