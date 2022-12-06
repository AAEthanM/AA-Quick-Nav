// ==UserScript==
// @name         EM Tech Support Dashboard Adjuster
// @namespace    https://assaabloy.sharepoint.com/
// @version      0.17
// @description  Condenses the tech support dashboard to allow for smaller windows without obscuring information
// @author       You
// @downloadURL  https://github.com/AAEthanM/AA-User-Scripts/raw/main/AA%20EMTS%20Dashboard%20Adjuster.user.js
// @updateURL    https://github.com/AAEthanM/AA-User-Scripts/raw/main/AA%20EMTS%20Dashboard%20Adjuster.user.js
// @match        https://webapp.brightmetrics.com/UI-2/pages/*
// @icon         https://cdn.worldvectorlogo.com/logos/assa.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_notification
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements*/
(function() {
    'use strict';

    var globalFrac = [];

    var notificationDetails = {
        text: 'You are next in line for a call by idle duration! Prepare for your phone to ring soon.',
        title: 'ShoreTel Caller Queue Warning',
        timeout: 120000,
    };

    var changesHeight = [
        ["graph8","368px"],
        ["chart_l83glbs1-ej9pm0fe3b","132px"],
        ["l83glbs1-ej9pm0fe3b","132px"],
        ["graph1","500px"],
        ["graph2","500px"],
        ["graph18","246px"],
        ["graph19","279px"],
    ];
    var changesTier2 = [
        "-170px", //Tier2
        "-325px", //Daily Group Stats
        "-325px", //Call Queues
        "-270px", //TPS New Haven
        "-350px", //TPS Berlin
    ];
    var changesTop = [
        ["graph18","-10px",],
        ["graph19","-93px"],
    ];

    var agents = [
        "Alfred G",
        "Anthony R",
        "Darryl M",
        "Ethan M.",
        "Greg S",
        "Jackie G",
        "Luz G",
        "William N",
    ];

    window.setTimeout(execute,6000);
    function execute() {
        totalTasa();
        adjust();
        window.setTimeout(execute,1000);
    }


    function totalTasa() {
        var statTables = document.getElementsByClassName("c-tbl c-tbl--centered c-text-chart--board");
        var fraction = [];
        var leftTable = statTables[0];
        var leftTable1 = leftTable.children[0].children[0].children[0].children[0];
        globalFrac[0] = leftTable1;
        var leftTable1num = leftTable1.children[8].innerText;
        var leftTable1den = leftTable1.children[4].innerText;


        var leftTable2 = leftTable.children[0].children[0].children[0].children[1];
        globalFrac[1] = leftTable2;
        var leftTable2num = leftTable2.children[8].innerText;
        var leftTable2den = leftTable2.children[4].innerText;

        var leftTable3 = leftTable.children[0].children[0].children[0].children[2];
        globalFrac[2] = leftTable3;
        var leftTable3num = leftTable3.children[8].innerText;
        var leftTable3den = leftTable3.children[4].innerText;

        var leftTable4 = leftTable.children[0].children[0].children[0].children[3];
        globalFrac[3] = leftTable4;
        var leftTable4num = leftTable4.children[8].innerText;
        var leftTable4den = leftTable4.children[4].innerText;

        var leftTable1PerElm = leftTable1.children[10];
        var leftTable1PerStr = leftTable1PerElm.innerText.substring(leftTable1PerElm.innerText.length-1,0)
        var rightTable = statTables[1];

        var leftTablenum = parseInt(leftTable1num) + parseInt(leftTable2num) + parseInt(leftTable3num) + parseInt(leftTable4num);
        var leftTableden = parseInt(leftTable1den) + parseInt(leftTable2den) + parseInt(leftTable3den) + parseInt(leftTable4den);
        var leftTablefrac = (leftTablenum/leftTableden*100).toString();
        var leftTablefracStr = leftTablefrac.substring(0,leftTablefrac.indexOf(".")+4);

        if(!document.getElementById("TotalTASADisplay")) {
            var totalDisplayElm = document.createElement("div");
            totalDisplayElm.setAttribute("id","TotalTASADisplay");
            totalDisplayElm.setAttribute("style","font-size:24px;color:#000;background-color:orange;padding:10px;position:absolute;bottom:0px;left:0px;z-index:99999");
            document.body.appendChild(totalDisplayElm);
        }
        totalDisplayElm = document.getElementById("TotalTASADisplay");
        totalDisplayElm.innerHTML = "Total TASA:&nbsp;&nbsp;&nbsp;" + leftTablenum + "/" + leftTableden + "&nbsp;&nbsp;&nbsp;" + leftTablefracStr + "%";
    }

    function adjust() {
        var box = document.getElementById("chart_graph8");
        var titlesElm = box.children[0].children[0].children[0].children[0]; //Title Bar
        var titles = [];
        var namesElm = box.children[0].children[0].children[1]; //Names (.children[0].innerText is first name)
        var names = [];

        for(let i = 0; i < changesHeight.length; i++) {
            var heightelm = document.getElementById(changesHeight[i][0]);
            heightelm.style.height = changesHeight[i][1];
        }
        for(let i = 1; i <= changesTier2.length; i++) {
            var tier2spacing = document.getElementsByClassName("ui-selectee");
            tier2spacing[i].style.top = changesTier2[i-1];
        }
        for(let i = 0; i < changesTop.length; i++) {
            var topelm = document.getElementById(changesTop[i][0].toString());
            topelm.style.height = changesTop[i][1];
            topelm.style.position = "relative";
        }
        var pageContent = document.getElementById("page-content");
        pageContent.setAttribute("style","top:-30px;left:-30px;");
        var colorbar = document.getElementsByClassName("c-dashboard__chart-color-bar");
        for(let i = 0; i < colorbar.length; i++) {
            colorbar[i].style.height = "0px";
        }
        var headers = document.getElementsByClassName("c-dashboard__chart-head brightmetrics-flowgrid-drag-handle ui-draggable-handle");
        for(let i = 0; i < headers.length-2; i++) {
            headers[i].style.height = "0px";
        }

        for(let i = 0; i < titlesElm.childElementCount; i++) {
            titles.push(titlesElm.children[i].innerText);
        }
        
        for(let i = 0; i < 1; i++) {
            for(let j = 0; j < namesElm.childElementCount; j++) {
                names.push([namesElm.children[j].children[0].innerText,
                            namesElm.children[j].children[1].innerText,
                            namesElm.children[j].children[1].style.backgroundColor,
                            namesElm.children[j].children[2].innerText,
                            namesElm.children[j].children[3].innerText,
                            namesElm.children[j].children[4].innerText,
                            convertTime(namesElm.children[j].children[5].innerText),
                            namesElm.children[j].children[5].style.backgroundColor,
                            namesElm.children[j].children[6].innerText,
                            namesElm.children[j].children[7].innerText,
                            namesElm.children[j].children[8].innerText,
                            namesElm.children[j].children[9].innerText,]);
            }
        }
        var durationsSorted = sortByColumn(names,6);
        var loggedin = sortByColumn(trimLoggedOut(names),6);
        var idleonly = isolateIdle(loggedin);

        amNext(idleonly, "Anthony R");

        for(let i = 1; i < globalFrac[0].childElementCount-1; i++) {
            if(i==6) {
            } else {
                globalFrac[0].children[i].setAttribute("style","display:none");
                globalFrac[1].children[i].setAttribute("style","display:none");
                globalFrac[2].children[i].setAttribute("style","display:none");
                globalFrac[3].children[i].setAttribute("style","display:none");
            }
        }
        globalFrac[0].children[6].innerText = globalFrac[0].children[8].innerText + "/" + globalFrac[0].children[4].innerText;
        globalFrac[1].children[6].innerText = globalFrac[1].children[8].innerText + "/" + globalFrac[1].children[4].innerText;
        globalFrac[2].children[6].innerText = globalFrac[2].children[8].innerText + "/" + globalFrac[2].children[4].innerText;
        globalFrac[3].children[6].innerText = globalFrac[3].children[8].innerText + "/" + globalFrac[3].children[4].innerText;
    }

    function amNext(arr, name) {
        if(arr.length == 0) {
        } else {
            if(!GM_getValue("amINext")) {
                try {
                    if(arr[arr.length-1][0] == name) {
                        GM_setValue("amINext",true);
                        GM_notification(notificationDetails);
                        dingSound();
                    } else {
                        GM_setValue("amINext",false);
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            if(GM_getValue("amINext")) {
                if(arr[arr.length-1][0] != name) {
                    GM_setValue("amINext",false);
                }
            }
        }
    }

    function dingSound() {
        var player = document.createElement('audio');
        player.src = 'https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3';
        player.preload = 'auto';
        player.volume = 0.15;
        player.play();
    }

    function trimLoggedOut(arr) {
        var a = arr;
        while(locateEntry(arr,"Logged Out",1)) {
            a.splice(locateEntry(arr,"Logged Out",1));
        }
        return a;
    }

    function isolateIdle(arr) {
        var a = [];
        for(let i = 0; i < arr.length; i++) {
            if(arr[i][1] == "Idle") {
                a.push(arr[i]);
            }
        }
        return a;
    }

    function sortByColumn(arr, colIndex) {
         let a = arr.sort(sortFunction);
        function sortFunction(a, b) {
            if (a[colIndex] === b[colIndex]) {
                return 0;
            }
            else {
                return (a[colIndex] < b[colIndex]) ? -1 : 1;
            }
        }
        return a;
    }

    function refreshStatus(arr) {
        for(let i = 0; i < arr.length; i++) {
            var a = locateEntry(arr,agents[i],0);
            GM_setValue(agents[i]+"Status",getStatus(arr,agents[i]));
        }
    }

    function getStatus(arr, name) {
        var a = locateEntry(arr, name, 0);
        return arr[a][1];
    }

    function locateEntry(arr, str, index) {
        for(let i = 0; i < arr.length; i++) {
            if(arr[i][index] == str) {
                return i;
            }
        }
    }

    function convertTime(str) {
        var indices = [];
        for(var i=0; i<str.length; i++) {
            if (str[i] === ":") indices.push(i);
        }
        if(indices.length>1) {
            var a = str.substring(0,indices[0]);
            var b = str.substring(indices[0]+1,indices[1]);
            var c = str.substring(indices[1]+1,str.length);
            var d = (parseInt(a)*60*60)+(parseInt(b)*60)+parseInt(c);
            return d;
        } else {
            var e = str.substring(0,indices[0]);
            var f = str.substring(indices[0]+1,str.length);
            var g = parseInt(e)*60+parseInt(f);
            return g;
        }
    }

})();
