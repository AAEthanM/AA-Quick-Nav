// ==UserScript==
// @name         EM Tech Support Wiki Quick Nav
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  Add shortcuts to the internal 810 Wire Technical Suppot Team for easier navigation to frequently used pages or external pages.
// @author       Ethan Millette, EMS Application Engineer
// @downloadURL  https://github.com/AAEthanM/AA-Quick-Nav/raw/main/EM%20Tech%20Support%20Wiki%20Quick%20Nav.user.js
// @updateURL    https://github.com/AAEthanM/AA-Quick-Nav/raw/main/EM%20Tech%20Support%20Wiki%20Quick%20Nav.user.js
// @match        https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/*
// @icon         https://cdn.worldvectorlogo.com/logos/assa.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_info
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://userscripts-mirror.org/scripts/source/107941.user.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements*/

const currdate = "10/28/22";

(function() {
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Constants for later access
    const hScalingAttr = 45;
    const vScalingAttr = 30;
    const hBorder = 5;
    const leftPush = -4;
    const defAttr = "font-family:Calibri;background:#F0F0F0;box-sizing:unset;flex-wrap:none;float:left;font-size:12px;position:absolute;cursor:pointer;padding:0px;z-index:1500;min-width:0px;width:"+hScalingAttr+"px;height:"+vScalingAttr+"px;";
    const insertDiv = document.getElementById('DeltaPlaceHolderLeftNavBar');
    const buttonsPerRow = 3;
    const frequentPagesCount = 5;

    var buttons = [];
    var buttonsStatic = [];

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
        ["10 Line","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/10%20Line.aspx"],
        ["Yale 6000","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/6000%20Series.aspx"],
        ["8800FL","https://assaabloy.sharepoint.com/sites/AMER-ENG-810W/Trial%20Run%20810WIRE%20Wiki/8800FL.aspx"],

        ["IO Home","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/"],
        ["IO Aperio","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/aperio/"],
        ["IO IWP","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/wiegand/"],
        ["IO IP Enbd","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/ip-enabled/"],
        ["IO Multi","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/multi-family/"],
        ["IO Persona","https://secure.intelligentopenings.com/en/partner-area/partner-area-start/information/persona/"],
        //["",""],
    ];

    var errors = {
        "editBlank":     "Quick Nav Error: Bad Button Edit, one or both new button entries were left blank. Changes were not made.",
        "editURL":       "Quick Nav Error: Bad Button Edit, invalid URL entered (must include http:// or https://). Changes were not made.",
        "toggleSet":     "Quick Nav Error: Bad Toggle Button Initialization, GM_isShowing not set to boolean value.",
        "badHide":       "Quick Nav Error: Bad Hide Sequence, GM_isShowing not set to boolean value.",
        "WIP" :          "CAUTION: Maximum amount of buttons (for now) is 24. Please be patient while I smack my head on this some more.",
        "lastButton":    "Can not remove final button from list, changes not made...",
        "resetDefaults": "Are you sure you want to set Quick Nav to defaults?",
    }

    var references = {};
    var defButtons = [];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Functional Code, Run at Startup

    //Creation of area box, static buttons within, add event listeners for clicks
    var firstToggleColor = GM_getValue("isShowing") ? "color:#C40000;" : "color:#038387;";
    var navAttr = GM_getValue("isShowing") ? "display:block;" : "display:none;";
    GM_setValue("isEdit",false);
    var toggleAttr = firstToggleColor.concat("display:block;");
    var s = setButtonLimit();

    var coverbox4 = addDiv("AAQNBox4","cover",'border:none;padding:8px;top:3px;height:'+vScalingAttr+"px;min-width:90.5%;",insertDiv,"first","",'div');
    var coverbox = addDiv("AAQNBox","cover",navAttr.concat('height:'+resizeBox()+'px !important;'),insertDiv,"first","",'div');
    var coverbox2 = addDiv("AAQNBox2","cover",'min-height:' + (2*vScalingAttr+hBorder-1) + 'px',insertDiv,"first","",'div');
    var coverbox3 = addDiv("AAQNBox3","cover",'border:none;min-height:4px',insertDiv,"first","",'div');

    var editText = addDiv("AAQNEditText","editingButtonsText","display:none;",coverbox4,"first","Edit Mode Activated",'div');
    addClick(editText.id,toggleEdit, false);

    var vStr = "Quick Nav v" + GM_info.script.version + " " + currdate
    var versionStr = addDiv("AAQNVersion","dummy","font-size:10px;position:absolute;word-wrap:none;top:-10px;",coverbox3,"first",vStr,'div');

    makeButton("", "", "AAQNEdit", navAttr, false, coverbox3, "first","editIcon");
    addClick("AAQNEdit",toggleEdit);

    makeButton("Default","","AAQNSetDefaults","display:none;padding:0px;width:40px;",false,coverbox4,"last","defaultButton");
    addClick("AAQNSetDefaults",setDefaults);

    makeButton("","","AAQNIncButton","top:40px;left:-28px;"+
               "background-image:url(https://cdn-icons-png.flaticon.com/128/1828/1828919.png);"
               ,false,coverbox3,"last","editingButtons");
    addClick("AAQNIncButton",addButton);

    makeButton("","","AAQNDecButton","top:60px;left:-28px;"+
               "background-image:url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHXAPDoIPop7SR4oP3dc4ICRzDkrr2Y6z_p8DW6Bg&s);"
               ,false,coverbox3,"last","editingButtons");
    addClick("AAQNDecButton",remButton);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Looping code for dynamically generated buttons, visible status, ID creation

    //Adds unique ID to each button that is generated dynamically for the main buttons, adds new dimension to default array
    for(let i = 0; i < preButtons.length; i++) {
        buttons.push([preButtons[i][0],preButtons[i][1],("AAQNButton"+(i+1)).toString()]);
        defButtons.push([preButtons[i][0],preButtons[i][1],("AAQNButton"+(i+1)).toString()]);
    }

    //Adds unique ID to each static button that sit over the toggle button for category selection
    for(let i = 0; i < preButtonsStatic.length; i++) {
        buttonsStatic.push([preButtonsStatic[i][0],preButtonsStatic[i][1],("AAQNButton"+(preButtonsStatic[i][0])).toString()]);
    }

    //Adds unique ID to each button that is generated dynamically for static category buttons
    for(let i = 0; i < buttonsStatic.length; i++) {
        makeButton(buttonsStatic[i][0],buttonsStatic[i][1],buttonsStatic[i][2],
                   defAttr.concat("display:inline-block;width:24%;top:0px;left:"+(hScalingAttr*i+(-10))+"px"),
                   true, coverbox2, "first",)
        addClick(buttonsStatic[i][2],function() {navigateToURL(buttonsStatic[i][1])});
    }

    //Add Button for Toggling Visibility of Quick Nav, change colors when pressed, hide boxes
    var toggleStatus;
    if(GM_getValue("isShowing")) {
        toggleStatus = '\u2191 Toggle Show/Hide \u2191'; //Change direction of arrows depending on cascade status
    } else if(!GM_getValue("isShowing")) {
        toggleStatus = '\u2193 Toggle Show/Hide \u2193';
    } else {toggleStatus = 'Toggle Show/Hide'; alert(errors.toggleSet)}
    makeButton(toggleStatus,"","AAQNButtonToggle",
               defAttr.concat(toggleAttr,"font-size:15px;width:99%;top:"+(vScalingAttr+2)+"px;left:-10px;"),
               false, coverbox2, "first");
    addClick("AAQNButtonToggle",toggleVisible);

    //Refresh Cookies before actions take place
    refreshCookies();
    mainButtons();

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Function Access

    //Main loop to instantiate the buttons that are invisible on page load, set style, color if applicable, insert in bounding box
    function mainButtons(flag) {
        var totalButtonIndex = 0;
        for(let j = 0; j < setButtonLimit(); j++) {
            for(let i = 0; i < buttonsPerRow; i++) {
                if(totalButtonIndex >= GM_getValue("totalButtons")) {break;}
                totalButtonIndex++;
                var bColorIO = "";
                var bAttr = "";
                if(buttons[i+(j*buttonsPerRow)] == undefined) {break;}
                if(buttons[i+(j*buttonsPerRow)][0].toString().includes("IO ")) {bColorIO = "color:blue;";} //Account for Intelligent Openings Links, turn them blue to note moving to external page
                else {bColorIO = "color:black;";}
                if(flag) bAttr = defAttr.concat("color:red;"); else bAttr = defAttr;
                makeButton(buttons[i+(j*buttonsPerRow)][0], buttons[i+(j*buttonsPerRow)][1], buttons[i+(j*buttonsPerRow)][2],
                           bAttr.concat(navAttr,bColorIO,""+
                                        "position:absolute;width:"+(Math.floor(180/buttonsPerRow)-2)+"px;"+
                                        "left:"+(Math.floor(180/buttonsPerRow)*i+leftPush+(-6))+"px;"+
                                        "top:"+(vScalingAttr*j+j)+"px;"),
                           true, coverbox, "last","buttonDummy");
                addClick(buttons[i+(j*buttonsPerRow)][2], () => navigateToURL(buttons[i+(j*buttonsPerRow)][1]));
            }
        }
    }

    //Dynamically add div with function, size, location, and ID
    function addDiv(id, cls, style, loc="", itemloc="",name,type) {
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

    //Hide main buttons as a transition to updating them with new info
    function hideMainButtons() {
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

    //Create button with specifications, prop will override CSS style in cls
    function makeButton(name, url, id, prop, isLink, loc = "", itemloc = "", cls = "") {
        var button = document.createElement("button");
        button.type = "button";
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

    //Add event listener to button with desired anonymous function
    function addClick(id, func) {
        var button = document.getElementById(id);
        references[id] = func;
        button.addEventListener("click", func, false);
    }

    //Navigate to specified URL, used in anonymous functions to not be called on instantiation
    function navigateToURL(url) {
        window.location = url;
    }

    //Remove event listener from specified button
    function removeClick(id, func) {
        var elm = document.getElementById(id);
        elm.removeEventListener("click",func);
    }

    //Function to toggle visibility when Show/Hide is pressed, change colors, hide boxes
    function toggleVisible() {
        var totalButtonIndex = 0;
        var toggleButton = document.getElementById("AAQNButtonToggle");
        var setDef = document.getElementById("AAQNSetDefaults");

        for(let i =0; i < buttons.length; i++) {
            if(totalButtonIndex >= GM_getValue("totalButtons")) {break;}
            totalButtonIndex++;
            var navBtns = document.getElementById(buttons[i][2].toString());
            if(GM_getValue("isShowing")) {navBtns.style.display = 'none';}
            else if(!GM_getValue("isShowing")) {navBtns.style.display = 'block';}
            else {alert(errors.badHide)}
        }

        for(let i = 0; i < document.getElementsByClassName("editIcon").length; i++) {
            document.getElementsByClassName("editIcon")[i].style.display = "none";
        }
        if(GM_getValue("isShowing")) {
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
        } else {
            toggleButton.innerHTML = '\u2191 Toggle Show/Hide \u2191';
            toggleButton.style.color = '#C40000';
            GM_setValue("isShowing",true);
            coverbox.style.display = 'block';
            for(let i = 0; i < document.getElementsByClassName("editIcon").length; i++) {
                document.getElementsByClassName("editIcon")[i].style.display = "block";
            }
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

    //Toggle Edit Mode, color buttons for visiblity, auto-update box size based on amount of visible buttons
    function toggleEdit() {
        var totalButtonIndex = 0;
        var editText = document.getElementById("AAQNEditText");
        var setDef = document.getElementById("AAQNSetDefaults");
        var incButton = document.getElementById("AAQNIncButton");
        var decButton = document.getElementById("AAQNDecButton");
        if(GM_getValue("isEdit")) { //STOP EDITING
            GM_setValue("isEdit",false);
            editText.style.display = 'none';
            setDef.style.display = 'none';
            incButton.style.display = 'none';
            decButton.style.display = 'none';
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
            editText.style.display = 'block';
            setDef.style.display = 'block';
            incButton.style.display = 'block';
            decButton.style.display = 'block';
            for(let j = 0; j < s; j++) {
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

    //Set cookie for value access across page reloads
    function setCookie(name,value,type) {
        var expires = "";
        var date = new Date();
        date.setTime(date.getTime() + (100*365*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = name.concat(type||"") + "=" + (value || "") + expires + "; path=/";
    }

    //Get cookie value across page reloads
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
    }

    //Erase cookies when setting defaults buttons
    function eraseCookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    //Refresh Cookies to have the storage arrays access fresh data when reloading page
    function refreshCookies() {
        if(!JSON.parse(GM_getValue("masterButtons"))) {
            GM_setValue("masterButtons",JSON.stringify(buttons))
        }
        buttons = JSON.parse(GM_getValue("masterButtons"));
        for(let i = 0; i < GM_getValue("totalButtons"); i++) {
            if(getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"name") && getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"url")) {
                buttons[i][0] = getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"name");
                buttons[i][1] = getCookie(JSON.parse(GM_getValue("masterButtons"))[i][2]+"url");
            }
        }
        GM_setValue("masterButtons",JSON.stringify(buttons));
    }

    //Return button array to defaults, without using cookies for button data
    function setDefaults() {
        var test = confirm(errors.resetDefaults)
        if(test) {
            GM_setValue("masterButtons",JSON.stringify(defButtons));
            GM_setValue("totalButtons",24);
            for(let i = 0; i < buttons.length; i++) {
                eraseCookie(buttons[i][2]+"name");
                eraseCookie(buttons[i][2]+"url");
            }
            window.location = window.location.href;
        }
    }

    //Prompt for new button/change existing button details
    function getNewButton(id) {
        var elm,name,url,nid,uid;
        if(!document.getElementById(id)) {
        } else {
            elm = document.getElementById(id);
            name = prompt("Enter new title to replace " + elm.innerHTML);
            url = prompt("Enter new URL to replace " + elm.innerHTML);
            if(!name || !url) {
                alert(errors.editBlank);
                return;
            } else if(!isValidHttpUrl(url)){
                alert(errors.editURL);
                return;
            } else {
                elm.innerHTML = name;
                nid = id+"name";
                uid = id+"url"
                setCookie(nid,name)
                setCookie(uid,url)
            }
        }
    }

    //Checks if given URL is valid to be added to buttons
    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    //Increment amount of buttons
    function addButton(pmt=true,name,link) {
        if(!GM_getValue("totalButtons")) {
            GM_setValue("totalButtons",buttons.length);
        } else if(GM_getValue("totalButtons")>=buttons.length) {
            if(pmt) {
                var title = prompt("Enter Title for new Button");
                var url = prompt("Enter Link for new Button");
            } else {
                title = name;
                url = link;
            }
            if(!title || !url) {
                alert(errors.editBlank);
            } else {
                var nid = "AAQNButton"+(buttons.length+1)+"name";
                var uid = "AAQNButton"+(buttons.length+1)+"url"
                buttons.push([title,url,"AAQNButton"+(buttons.length+1)]);
                GM_setValue("masterButtons", JSON.stringify(buttons));
                setCookie(nid,title);
                setCookie(uid,url);
                GM_setValue("totalButtons",GM_getValue("totalButtons")+1);
                hideMainButtons();
                mainButtons();
                toggleEdit();
                toggleEdit();

                coverbox.style.height = resizeBox() + "px";
            }

        } else {

            GM_setValue("totalButtons",GM_getValue("totalButtons")+1);
            setButtonLimit();
            hideMainButtons();
            mainButtons();
            toggleEdit();
            toggleEdit();

            coverbox.style.height = resizeBox() + "px";
        }
    }

    //Decrement amount of buttons
    function remButton() {
        if(!GM_getValue("totalButtons")) {
            GM_setValue("totalButtons",buttons.length);
        } else if(GM_getValue("totalButtons") == 1) {
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

            hideMainButtons();
            mainButtons(true);
            toggleEdit();
            toggleEdit();

            coverbox.style.height = resizeBox() + "px";
        }
    }

    //Function to globally set how many rows of buttons there are according to how many total and how many buttons per row are visible
    function setButtonLimit() {
        s = Math.ceil(JSON.parse(GM_getValue("masterButtons").length)/buttonsPerRow);
        return s;
    }

    //Update size of bounding box to account for total amount of buttons
    function resizeBox() {
        return GM_getValue("totalButtons") ? ((vScalingAttr+1)*Math.ceil(GM_getValue("totalButtons")/buttonsPerRow))+1 : (s*(vScalingAttr+1)+1);
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
        border: 2px solid red;
        opacity: 0.8;
        border: 2px solid #038387;
        min-width: 100%;
    }

    .defaultButton {
        padding:0px;
        color:red;
        display:none;
        position:absolute;
        float:left;
        font-size:10px;
        height:15px;
        left:111px;
        top:-2px;
        min-width:30px;
        height:20px;
        min-width:fit-content;
    }
` );
