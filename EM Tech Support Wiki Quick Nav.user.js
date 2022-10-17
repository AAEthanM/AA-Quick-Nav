// ==UserScript==
// @name         EM Tech Support Wiki Quick Nav
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Add shortcuts to the internal 810 Wire Technical Suppot Team for easier navigation to frequently used pages or external pages.
// @author       Ethan Millette, EMS Application Engineer
// @match        https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/*
// @icon         https://cdn.worldvectorlogo.com/logos/assa.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements*/

(function() {
    'use strict';
    var buttons = [];
    var buttonsStatic = [];
    var buttonsPerRow = 3;
    var preButtonsStatic = [ //List category buttons
        ["Home","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Home.aspx"],
        ["EMS","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Electromechanical%20Product%20Lines.aspx"],
        ["ACS","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Access%20Control%20Product%20Lines.aspx"],
        ["EACI","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/Enterprise%20Access%20Control%20Information.aspx"],
    ];
    var preButtons = [ //List main butons
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
        ["IO Home","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/"],
        ["IO Aperio","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/aperio/"],
        ["IO IWP","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/wiegand/"],
        ["IO IP Enbd","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/ip-enabled/"],
        ["IO Multi","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/multi-family/"],
        ["IO Persona","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/persona/"],
        //["",""],
    ];
    var references = {};
    var newreferences = {};


    console.log(document.cookie);

    //Adds unique ID to each button that is generated dynamically for the main buttons
    for(let i = 0; i < preButtons.length; i++) {buttons.push([preButtons[i][0],preButtons[i][1],("AAQNButton"+(i+1)).toString()]);}
    refreshCookies();

    //Constants for button spacing/properties
    var firstToggleColor = GM_getValue("isShowing") ? "color:#C40000;" : "color:#038387;";
    var navAttr = GM_getValue("isShowing") ? "display:block;" : "display:none;";
    GM_setValue("isEdit",false);
    var toggleAttr = firstToggleColor.concat("display:block;");
    const hScalingAttr = 45;
    const vScalingAttr = 25;
    const hBorder = 5;
    const leftPush = -4;
    const defAttr = "font-family:Calibri;background:#F0F0F0;box-sizing:unset;flex-wrap:none;float:left;font-size:12px;position:absolute;cursor:pointer;padding:0px;z-index:99999;min-width:0px;width:"+hScalingAttr+"px;height:"+vScalingAttr+"px;";
    const insertDiv = document.getElementById('DeltaPlaceHolderLeftNavBar');
    var s = 0; //Loop to see how many rows to create given the amount of buttons in the array
    while(s*buttonsPerRow < buttons.length) {s = s + 1;}

    //Bounding boxes/parent div for buttons
    var coverbox4 = document.createElement('div');
    coverbox4.setAttribute("id","AAQNBox4");
    coverbox4.style.cssText = 'display:block;z-index:99997;background:none;padding:8px;position:relative;top:3px;left:-4px;min-width:100%;height:5px';
    insertDiv.insertBefore(coverbox4,insertDiv.firstChild);

    var coverbox = document.createElement('div');
    coverbox.setAttribute("id","AAQNBox");
    coverbox.style.cssText = navAttr.concat('border:2px solid #038387;z-index:99998;opacity:0.8;z-index:1;background:none;padding:0px;position:relative;top:-2px;left:-4px;min-width:100%;min-height:'+(s*(vScalingAttr+1)+1)+'px');
    insertDiv.insertBefore(coverbox,insertDiv.firstChild);
    coverbox.addEventListener( 'click', function () {}, true );

    var coverbox2 = document.createElement('div');
    coverbox2.setAttribute("id","AAQNBox2");
    coverbox2.style.cssText = 'display:block;border:2px solid #038387;z-index:99998;opacity:0.8;z-index:1;background:none;padding:0px;position:relative;top:0px;left:-4px;min-width:100%;min-height:' + (2*vScalingAttr+hBorder-1) + 'px';
    insertDiv.insertBefore(coverbox2,insertDiv.firstChild);

    var coverbox3 = document.createElement('div');
    coverbox3.setAttribute("id","AAQNBox3");
    coverbox3.style.cssText = 'display:block;z-index:1;background:none;z-index:99998;padding:0px;position:relative;top:0px;left:-4px;min-width:100%;min-height:4px';
    insertDiv.insertBefore(coverbox3,insertDiv.firstChild);

    var editIndicator = document.createElement('div');
    editIndicator.setAttribute("id", "AAQNEditIndicator");
    editIndicator.innerHTML = "Edit Mode";
    editIndicator.setAttribute("style", "font-family:Calibri;color:red;font-size:13px;float:left;display:none;position:absolute;left:20px;top:0px;height:2px;cursor:pointer;");
    coverbox4.insertBefore(editIndicator,coverbox4.lastChild)
    addClick("AAQNEditIndicator",toggleEdit)

    var defaultList = document.createElement('button');
    defaultList.setAttribute("id", "AAQNSetDefaults");
    defaultList.innerHTML = "Reset Defaults";
    defaultList.setAttribute("style", defAttr.concat("font-family:Calibri;color:red;font-size:10px;float:right;display:none;position:absolute;right:12px;top:0px;width:70px;height:15px;cursor:pointer;"));
    coverbox4.insertBefore(defaultList,coverbox4.lastChild)
    defaultList.addEventListener("click", setDefaults, false);
    coverbox4.insertBefore(defaultList,coverbox4.lastChild);

    //Add Button for Toggling Visibility of Quick Nav, change colors when pressed, hide boxes
    var toggleStatus;
    if(GM_getValue("isShowing")) {
        toggleStatus = '\u2191 Toggle Show/Hide \u2191';
    } else if(!GM_getValue("isShowing")) {
        toggleStatus = '\u2193 Toggle Show/Hide \u2193';
    } else {toggleStatus = 'Toggle Show/Hide'; alert("Quick Nav Error: Bad Toggle Button Initialization, GM_isShowing not set to boolean value.")}
    makeButton(toggleStatus,"","AAQNButtonToggle",
               defAttr.concat(toggleAttr,"font-size:15px;width:99%;top:"+(vScalingAttr+2)+"px;left:-10px;"),
               false, coverbox2, "first");
    addClick("AAQNButtonToggle",toggleVisible);

    //Initialize static buttons that sit over the toggle button for category selection
    for(let i = 0; i < preButtonsStatic.length; i++) {buttonsStatic.push([preButtonsStatic[i][0],preButtonsStatic[i][1],("AAQNButton"+(preButtonsStatic[i][0])).toString()]);} //Adds unique ID to each button that is generated dynamically for static category buttons
    for(let i = 0; i < buttonsStatic.length; i++) {
        makeButton(buttonsStatic[i][0],buttonsStatic[i][1],buttonsStatic[i][2],
                   defAttr.concat("display:inline-block;width:24%;top:0px;left:"+(hScalingAttr*i+(-10))+"px"),
                   true, coverbox2, "first",)
        addClick(buttonsStatic[i][2],function() {navigateToURL(buttonsStatic[i][1])});
    }

    makeButton("","","AAQNEdit",
               //toggleEdit,
               navAttr.concat("position:absolute;background-size:14px !important;padding:7px;border:none;min-width:1px !important;min-height:1px !important;left:-10px;top:0px;background-image:url(https://www.freeiconspng.com/thumbs/edit-icon-png/edit-new-icon-22.png);"),
               false, coverbox4, "first");
    addClick("AAQNEdit",toggleEdit);

    //Main loop to instantiate the buttons that are invisible on page load, set style, color if applicable, insert in bounding box
    for(let j = 0; j < s; j++) {
        for(let i = 0; i < buttonsPerRow; i++) {
            var bColorIO = "";
            if(buttons[i+(j*buttonsPerRow)] == undefined) {break;}
            if(buttons[i+(j*buttonsPerRow)][0].toString().includes("IO ")) {bColorIO = "color:blue;";} //Account for Intelligent Openings Links, turn them blue to note moving to external page
            else {bColorIO = "color:black;";}
            makeButton(buttons[i+(j*buttonsPerRow)][0], buttons[i+(j*buttonsPerRow)][1], buttons[i+(j*buttonsPerRow)][2],
                       defAttr.concat(navAttr,bColorIO,""+
                                            "position:absolute;width:"+(0.98*coverbox2.offsetWidth/buttonsPerRow-2)+"px;"+
                                            "left:"+((0.98*coverbox2.offsetWidth/buttonsPerRow*i+leftPush)+(-6))+"px;"+
                                            "top:"+(vScalingAttr*j+j)+"px;"),
                       true, coverbox, "last");
            addClick(buttons[i+(j*buttonsPerRow)][2],() => navigateToURL(buttons[i+(j*buttonsPerRow)][1]));
            //setCookie(buttons[i+(j*buttonsPerRow)][2].toString().concat("name"),buttons[i+(j*buttonsPerRow)][0]);
            //setCookie(buttons[i+(j*buttonsPerRow)][2].toString().concat("url"),buttons[i+(j*buttonsPerRow)][1]);
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function makeButton(name, url, id, prop, isLink,loc = "", itemloc = "") {
        //references[id] = func;
        var button = document.createElement("button");
        button.type = "button";
        button.innerHTML = name;
        button.setAttribute("id", id);
        button.setAttribute("style", prop);
        if(isLink){button.addEventListener('mousedown', e => {if (e.button === 1) {window.open(url);e.preventDefault();}});} //Add middle click function
        if(loc === "") {loc = document.body.appendChild(button);} else {
            if(itemloc.includes("first")) {loc.insertBefore(button,loc.firstChild);}
            else if(itemloc.includes("last")) {loc.insertBefore(button,loc.lastChild);}
            else if(itemloc === "") {}
        }
        return null;
    }

    function addClick(id, func) {
        var button = document.getElementById(id);
        references[id] = func;
        button.addEventListener("click", func, false);
        return null;
    }

    function refreshButton(id, func) {
        var elm = document.getElementById(id);
        removeClick(id,references[id]);
        return null;
    }

    function navigateToURL(url) {
        window.location = url;
        return null;
    }

    function removeClick(id, func) {
        var elm = document.getElementById(id);
        elm.removeEventListener("click",func);
        return null;
    }

    //Function to toggle visibility when Show/Hide is pressed, change colors, hide boxes
    function toggleVisible() {
        for(let i =0; i < buttons.length; i++) {
            var navBtns = document.getElementById(buttons[i][2].toString());
            if(GM_getValue("isShowing")) {navBtns.style.display = 'none';}
            else if(!GM_getValue("isShowing")) {navBtns.style.display = 'block';}
            else {alert("Quick Nav Error: Bad Hide Sequence, GM_isShowing not set to boolean value.")}
        }

        var editButton = document.getElementById('AAQNEdit');
        var toggleButton = document.getElementById("AAQNButtonToggle");
        var testbox = document.getElementById("AAQNBox");
        var editInd = document.getElementById("AAQNEditIndicator");
        var setDef = document.getElementById("AAQNSetDefaults");

        if(GM_getValue("isShowing")) {
            toggleButton.innerHTML = '\u2193 Toggle Show/Hide \u2193';
            toggleButton.style.color = '#038387';
            GM_setValue("isShowing",false);
            coverbox.style.display = 'none';
            editButton.style.display = 'none';
            editInd.style.display = 'none';
            setDef.style.display = 'none';
        }
        else {
            toggleButton.innerHTML = '\u2191 Toggle Show/Hide \u2191';
            toggleButton.style.color = '#C40000';
            GM_setValue("isShowing",true);
            coverbox.style.display = 'block';
            editButton.style.display = 'block';
            if(GM_getValue("isEdit")) {
                editInd.style.display = 'block';
                setDef.style.display = 'block';
            }
        }
        return null;
    }

    function toggleEdit() {
        var editIndicator = document.getElementById("AAQNEditIndicator");
        var setDef = document.getElementById("AAQNSetDefaults");
        if(GM_getValue("isEdit")) { //STOP EDITING
            GM_setValue("isEdit",false);
            editIndicator.style.display = 'none';
            setDef.style.display = 'none';
            for(let j = 0; j < s; j++) {
                for(let i = 0; i < buttonsPerRow; i++) {
                    var navBtns = document.getElementById(buttons[i+(j*buttonsPerRow)][2].toString());
                    navBtns.style.background = "#F0F0F0";
                    removeClick(buttons[i+(j*buttonsPerRow)][2],references[buttons[i+(j*buttonsPerRow)][2]]);
                    //references[buttons[i+(j*buttonsPerRow)][2]] = () => navigateToURL(buttons[i+(j*buttonsPerRow)][1]);
                    refreshCookies();
                    addClick(buttons[i+(j*buttonsPerRow)][2], () => navigateToURL(buttons[i+(j*buttonsPerRow)][1]));
                }
            }
            console.log(references);
            console.log("not editing");
        }
        else { //START EDITING
            GM_setValue("isEdit",true);
            editIndicator.style.display = 'block';
            setDef.style.display = 'block';
            for(let j = 0; j < s; j++) {
                for(let i = 0; i < buttonsPerRow; i++) {
                    navBtns = document.getElementById(buttons[i+(j*buttonsPerRow)][2].toString());
                    navBtns.style.background = "red";
                    removeClick(buttons[i+(j*buttonsPerRow)][2],references[buttons[i+(j*buttonsPerRow)][2]]);
                    //references[buttons[i+(j*buttonsPerRow)][2]] = () => getNewButton(buttons[i+(j*buttonsPerRow)][2]);
                    addClick(buttons[i+(j*buttonsPerRow)][2], () => getNewButton([buttons[i+(j*buttonsPerRow)][2]]));//refreshButton(buttons[i+(j*buttonsPerRow)][2].toString(), () => getNewButton(buttons[i+(j*buttonsPerRow)][2]));
                }
            }
            console.log(references);
            console.log("editing");
        }
        return null;
    }

    function setCookie(name,value,type) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (100*365*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = name.concat(type||"") + "=" + (value || "") + expires + "; path=/";
        return null;
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        return null;
    }

    function refreshCookies() {
        for(let i = 0; i < buttons.length; i++) {
            if(getCookie(buttons[i][2].concat("name")) && getCookie(buttons[i][2].concat("url"))) {
                buttons[i][0] = getCookie(buttons[i][2].concat("name"));
                buttons[i][1] = getCookie(buttons[i][2].concat("url"));
            }
        }
        return null;
    }

    function setDefaults() {
        if(confirm("Are you sure you want to set Quick Nav to defaults?")) {
            for(let i = 0; i < buttons.length*2; i++) {
                eraseCookie(buttons[i][2]+"name");
                eraseCookie(buttons[i][2]+"url");
            }
            window.location = window.location.href;
            return null;
        }
    }

    function getNewButton(id) {
        var elm = document.getElementById(id);
        var name = prompt("Enter new title to replace " + elm.innerHTML);
        var url = prompt("Enter new URL to replace " + elm.innerHTML);

        console.log(name + "\n" + url)
        if(!name || !url) {
            alert("Quick Nav Error: Bad Button Edit, one or both new button entries were left blank. Changes were not made.");
            return;
        } else if(!isValidHttpUrl(url)){
            alert("Quick Nav Error: Bad Button Edit, invalid URL entered (must include http:// or https://). Changes were not made.");
            return;
        } else {
            console.log("complete")
            //references[id] = () => navigateToURL(url);
            elm.innerHTML = name;
            var nid = id+"name";
            var uid = id+"url"
            setCookie(nid,name)
            setCookie(uid,url)
            //refreshButton(id, () => navigateToURL(url));
            console.log(document.cookie);
        }
        return null;
    }

    function isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }
})();

//https://stackoverflow.com/questions/13286233/pass-a-javascript-function-as-parameter
//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
