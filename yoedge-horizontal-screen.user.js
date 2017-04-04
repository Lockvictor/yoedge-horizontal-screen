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

var SCALE_RATIO = 0.5; //画布宽度占屏幕宽度的比例
var WIDTH = screen.width * SCALE_RATIO;
var HEIGHT = WIDTH * 1.5;


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
    resizeCanvas(canvasObj, containerObj);

    // 构造遮罩屏蔽canvas缩放
    addMask(containerObj);
}


function resizeCanvas(canvasObj, containerObj) {
    canvasObj.style.width = WIDTH + 'px';
    canvasObj.style.height = HEIGHT + 'px';
    containerObj.style.width = '100%';
    containerObj.style.height = 'auto';
    containerObj.style.margin = '0';
    containerObj.style.textAlign = 'center';
}


function addMask(containerObj) {
    var pagerButtonWidth = 80;
    var pagerButtonHeight = 50;

    var maskList = [];
    // 通用样式
    for (let i = 0; i < 3; i++) {
        maskList[i] = document.createElement('div');
        let mask = maskList[i];
        mask.width = (WIDTH - pagerButtonWidth) / 2
        mask.style.width = mask.width + 'px';
        mask.height = HEIGHT;
        mask.style.height = mask.height + 'px';
        mask.style.zIndex = 1;
        mask.style.position = 'absolute';
        mask.style.top = '0';
        mask.style.left = '50%';
        // mask.style.backgroundColor = 'rgba(211, 211, 211, 0.3)';
    }
    // 左侧遮罩
    maskList[0].style.marginLeft = -WIDTH / 2 + 'px';
    // 中间遮罩
    maskList[1].style.marginLeft = - maskList[1].width / 2 + 'px';
    maskList[1].style.height = (HEIGHT - 2 * pagerButtonHeight) + 'px';
    maskList[1].style.top = pagerButtonHeight + 'px';
    // 右侧遮罩
    maskList[2].style.marginLeft = pagerButtonWidth / 2 + 'px';

    for (let i = 0; i < 3; i++) {
        containerObj.appendChild(maskList[i]);
    }
}