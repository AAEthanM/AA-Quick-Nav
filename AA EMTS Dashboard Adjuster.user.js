// ==UserScript==
// @name         AA EMTS Dashboard Adjuster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://webapp.brightmetrics.com/UI-2/pages/Dashboard.aspx?dashtoken=3b760263-9d0b-4dfc-a4a2-0b716bafb205/3ae5c019-1390-4f1b-93dd-46f4e065cbb7
// @icon         https://cdn.worldvectorlogo.com/logos/assa.svg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
        window.setTimeout(adjust,5000);
    function adjust() {
        var chart = document.getElementById("graph8");
        chart.style.height = "368px";

        var tier2 = document.getElementById("chart_l83glbs1-ej9pm0fe3b");
        tier2.style.height = "132px";

        var tier2box = document.getElementById("l83glbs1-ej9pm0fe3b");
        tier2box.style.height = "132px";

        var tier2spacing = document.getElementsByClassName("ui-selectee");
        tier2spacing[1].style.top = "-100px";
        tier2spacing[2].style.top = "-196px"; //Daily Group Stats
        tier2spacing[3].style.top = "-196px"; //Call Queues
        tier2spacing[4].style.top = "-130px"; //TPS New Haven
        tier2spacing[5].style.top = "-130px"; //TPS Berlin

        var pageContent = document.getElementById("page-content");
        pageContent.style.top = "-30px";

        //var chartContent = document.getElementsByClassName("c-dashboard__chart-content");
        //chartContent[2].style.height = "77%";
        //chartContent[3].style.height = "77%";
        //console.log(chartContent);

        var graph1 = document.getElementById("graph1");
        var graph2 = document.getElementById("graph2");
        var graph18 = document.getElementById("graph18");
        var graph19 = document.getElementById("graph19");
        graph1.style.height = "500px";
        graph2.style.height = "500px";
        graph18.style.height = "246px";
        graph18.style.top = "-10px";
        graph18.style.position = "relative";
        graph19.style.height = "279px";
        graph19.style.top = "-93px";
        graph19.style.position = "relative";

        var colorbar = document.getElementsByClassName("c-dashboard__chart-color-bar");
        for(let i = 0; i < colorbar.length; i++) {
            colorbar[i].style.height = "0px";
        }
    }

})();