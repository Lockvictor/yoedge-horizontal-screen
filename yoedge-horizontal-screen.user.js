// ==UserScript==
// @name        yoedge-horizontal-screen
// @namespace   https://github.com/Lockvictor
// @author      Lockvictor
// @description 实现灰机漫画网站的横屏阅读
// @match       http://smp.yoedge.com/smp-app/*
// @match       http://smp1.yoedge.com/smp-app/*
// @match       http://smp2.yoedge.com/smp-app/*
// @match       http://smp3.yoedge.com/smp-app/*
// @version     0.1
// @grant       none
// ==/UserScript==

(function () {
    'use strict';
    // 根据工具栏的有无判断漫画是否已经加载
    var settingButtonFlag;
    settingButtonFlag = setInterval(function () {
        var settingButton = document.getElementById('normal-button').parentElement;
        if (settingButton !== null) {
            settingButton.style.position = 'fixed';
            clearInterval(settingButtonFlag);
            main();
        }
    }, 1000);
})();

function main() {
    var canvasObj = document.getElementsByTagName('canvas')[0],
        containerObj = canvasObj.parentElement;

    // 调整canvas和container
    var expectedCanvasWidth = screen.width * 0.5; //画布宽度为屏幕50%时阅读效果较好

    canvasObj.style.width = expectedCanvasWidth + 'px';
    canvasObj.style.height =  expectedCanvasWidth * 1.5 + 'px';
    containerObj.style.width = '100%';
    containerObj.style.height = 'auto';
    containerObj.style.margin = '0';
    containerObj.style.textAlign = 'center';
}