// ==UserScript==
// @name         EM Tech Support Dashboard Adjuster
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Condenses the tech support dashboard to allow for smaller windows without obscuring information
// @author       You
// @downloadURL  https://github.com/AAEthanM/AA-User-Scripts/raw/main/AA%20EMTS%20Dashboard%20Adjuster.user.js
// @updateURL    https://github.com/AAEthanM/AA-User-Scripts/raw/main/AA%20EMTS%20Dashboard%20Adjuster.user.js
// @match        https://webapp.brightmetrics.com/UI-2/pages/Dashboard.aspx*
// @icon         https://cdn.worldvectorlogo.com/logos/assa.svg
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    var changesHeight = [
        ["graph8",368],
        ["chart_l83glbs1-ej9pm0fe3b",132],
        ["l83glbs1-ej9pm0fe3b",132],
        ["graph1",500],
        ["graph2",500],
        ["graph18",246],
        ["graph19",279],
    ];
    var changesTier2 = [
        "-100px", //Tier2
        "-196px", //Daily Group Stats
        "-196px", //Call Queues
        "-130px", //TPS New Haven
        "-130px", //TPS Berlin
    ];
    var changesTop = [
        ["graph18","-10px",],
        ["graph19","-93px"],
    ];
    for(let i = 0; i < 10; i++) {window.setTimeout(adjust,1000*i);}
    function adjust() {
        for(let i = 0; i < changesHeight.length; i++) {
            var heightelm = document.getElementById(changesHeight[i][0].toString());
            heightelm.style.height = changesHeight[i][1]+"px";
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
        pageContent.setAttribute("style","top:-30px;left:-30px;width:102%;");
        var colorbar = document.getElementsByClassName("c-dashboard__chart-color-bar");
        for(let i = 0; i < colorbar.length; i++) {
            colorbar[i].style.height = "0px";
        }
    }
})();
