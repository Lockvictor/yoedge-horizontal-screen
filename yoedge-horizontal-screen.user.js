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

var MANGA_ASPECT_RATIO = 1.5; //漫画宽高比

var gMangaAreaRatio = 0.5; //漫画宽度占屏幕宽度的比例
var MAX_SCALE_RATIO = 1; //最大缩放比例，与屏幕等宽
var MIN_SCALE_RATIO = 0.5; //最小缩放比例，屏幕的30%
var SCALE_STEP = 0.05;

var PAGE_BUTTON_AREA_RATIO = 0.1; //顶部和底部响应翻页事件的区域比例，10%


(function () {
    'use strict';
    // 加载后调整工具栏位置
    var settingButtonFlag;
    settingButtonFlag = setInterval(function () {
        var settingButton = document.getElementById('normal-button').parentElement;
        if (settingButton !== null) {
            settingButton.style.position = 'fixed';
            clearInterval(settingButtonFlag);
        }
    }, 1000);

    // main
    var canvasObj = document.getElementsByTagName('canvas')[0];
    var containerObj = canvasObj.parentElement;

    // 调整container
    containerObj.style.width = '100%';
    containerObj.style.height = 'auto';
    containerObj.style.margin = '0';
    containerObj.style.textAlign = 'center';

    // 调整canvas
    scaleCanvas(canvasObj, 0);

    // 添加遮罩覆盖canvas的缩放和翻页
    addCanvasMask(canvasObj, containerObj);
})();


function scaleCanvas(canvasObj, increment) {
    if (increment > 0) {
        gMangaAreaRatio = (gMangaAreaRatio >= MAX_SCALE_RATIO) ? MAX_SCALE_RATIO : (gMangaAreaRatio + increment);
    } else if (increment < 0) {
        gMangaAreaRatio = (gMangaAreaRatio <= MIN_SCALE_RATIO) ? MIN_SCALE_RATIO : (gMangaAreaRatio + increment);
    }
    console.log('gMangaAreaRatio = ' + gMangaAreaRatio);
    var newWidth = screen.width * gMangaAreaRatio;
    var newHeight = newWidth * MANGA_ASPECT_RATIO;

    canvasObj.style.width = newWidth + 'px';
    canvasObj.style.height = newHeight + 'px';

    var canvasMask = document.getElementById('canvasMask');
    if (canvasMask !== null) {
        canvasMask.style.width = newWidth + 'px';
        canvasMask.style.height = newHeight + 'px';
        canvasMask.style.marginLeft = - newWidth / 2 + 'px';
    }
}


function addCanvasMask(canvasObj, containerObj) {
    var canvasWidth = screen.width * gMangaAreaRatio;
    var canvasHeight = canvasWidth * MANGA_ASPECT_RATIO;

    var canvasMask = document.createElement('div');
    canvasMask.id = 'canvasMask';
    canvasMask.style.width = canvasWidth + 'px';
    canvasMask.style.height = canvasHeight + 'px';
    canvasMask.style.zIndex = 1;
    canvasMask.style.position = 'absolute';
    canvasMask.style.top = '0';
    canvasMask.style.left = '50%';
    canvasMask.style.marginLeft = - canvasWidth / 2 + 'px';
    canvasMask.style.backgroundColor = 'rgba(211, 211, 211, 0.3)';

    //添加鼠标滚轮缩放事件
    addMousewheelEventListener(canvasObj, canvasMask);

    //添加鼠标点击翻页事件
    addPageTurningEventListener(canvasObj, canvasMask)

    containerObj.appendChild(canvasMask);
}

function addMousewheelEventListener(canvasObj, canvasMask) {
    //一般浏览器的鼠标滚轮事件
    canvasMask.addEventListener('mousewheel', function (event) {
        // console.log(event);
        if (event.deltaY < 0) {//放大
            scaleCanvas(canvasObj, SCALE_STEP);
        } else if (event.deltaY > 0) { //缩小
            scaleCanvas(canvasObj, -SCALE_STEP);
        }
        event.stopPropagation();
        event.preventDefault();
    });

    // 火狐的鼠标滚轮事件
    canvasMask.addEventListener('DOMMouseScroll', function (event) {
        // console.log(event);
        if (event.detail < 0) {//放大
            scaleCanvas(canvasObj, SCALE_STEP);
        } else if (event.detail > 0) { //缩小
            scaleCanvas(canvasObj, -SCALE_STEP);
        }
        event.stopPropagation();
        event.preventDefault();
    });
}

function addPageTurningEventListener(canvasObj, canvasMask) {
    canvasMask.addEventListener('mouseup', function (event) {
        // console.log(event);
        var canvasHeight = screen.width * gMangaAreaRatio * MANGA_ASPECT_RATIO;
        var pageButtonAreaHeight = canvasHeight * PAGE_BUTTON_AREA_RATIO;
        if (event.layerY <= pageButtonAreaHeight || event.layerY >= (canvasHeight - pageButtonAreaHeight)) {
            canvasObj.dispatchEvent(new MouseEvent(event.type, event));
        }
    });
}