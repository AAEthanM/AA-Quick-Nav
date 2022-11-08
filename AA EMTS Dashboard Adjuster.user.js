// ==UserScript==
// @name         AA EMTS Dashboard Adjuster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @downloadURL  https://github.com/AAEthanM/AA-Quick-Nav/raw/main/AA%20EMTS%20Dashboard%20Adjuster.user.js
// @updateURL    https://github.com/AAEthanM/AA-Quick-Nav/raw/main/AA%20EMTS%20Dashboard%20Adjuster.user.js
// @match        https://webapp.brightmetrics.com/UI-2/pages/Dashboard.aspx?dashtoken=3b760263-9d0b-4dfc-a4a2-0b716bafb205/3ae5c019-1390-4f1b-93dd-46f4e065cbb7
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

    window.setTimeout(adjust,5000);
    window.setTimeout(adjust,10000);

    function adjust() {
        for(let i = 0; i < changesHeight.length; i++) {
            console.log(changesHeight[i][0]);
            var elm = document.getElementById(changesHeight[i][0].toString());
            elm.style.height = changesHeight[i][1]+"px";
        }
        for(let i = 1; i <= changesTier2.length; i++) {
            var tier2spacing = document.getElementsByClassName("ui-selectee");
            console.log(tier2spacing);
            tier2spacing[i].style.top = changesTier2[i-1];
        }

        var graph18 = document.getElementById("graph18");
        var graph19 = document.getElementById("graph19");

        graph18.style.top = "-10px";
        graph18.style.position = "relative";

        graph19.style.top = "-93px";
        graph19.style.position = "relative";

        var pageContent = document.getElementById("page-content");
        pageContent.style.top = "-30px";
        pageContent.style.left = "-30px";
        pageContent.style.width = "102.1%";

        var colorbar = document.getElementsByClassName("c-dashboard__chart-color-bar");
        for(let i = 0; i < colorbar.length; i++) {
            colorbar[i].style.height = "0px";
        }
    }

})();
