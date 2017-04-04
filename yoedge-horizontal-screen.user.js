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
    var SCALE_RATIO = 0.5; //画布宽度占屏幕宽度的比例
    var expectedCanvasWidth = screen.width * SCALE_RATIO;
    var expectedCanvasHeight = expectedCanvasWidth * 1.5;

    canvasObj.style.width = expectedCanvasWidth + 'px';
    canvasObj.style.height =  expectedCanvasHeight + 'px';
    containerObj.style.width = '100%';
    containerObj.style.height = 'auto';
    containerObj.style.margin = '0';
    containerObj.style.textAlign = 'center';


    // 构造一个遮罩屏蔽canvas缩放
    var mask = document.createElement('div');
    var MASK_MARGIN = 40; //上下各留的空白

    mask.style.width = expectedCanvasWidth + 'px';
    mask.style.height = (expectedCanvasHeight - 2 * MASK_MARGIN) + 'px';
    mask.style.zIndex = 1;
    mask.style.position = 'absolute';
    mask.style.top = MASK_MARGIN + 'px';
    mask.style.left = '50%';
    mask.style.marginLeft = -expectedCanvasWidth/2 + 'px';

    containerObj.appendChild(mask);
}