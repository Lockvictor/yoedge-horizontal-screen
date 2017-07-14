// ==UserScript==
// @name        yoedge-horizontal-screen
// @namespace   https://github.com/Lockvictor
// @author      Lockvictor
// @description 实现灰机汉化组漫画网站（yoedge.com）的横屏阅读模式
// @homepage    https://github.com/Lockvictor/yoedge-horizontal-screen
// @updateURL   https://github.com/Lockvictor/yoedge-horizontal-screen/raw/master/yoedge-horizontal-screen.user.js
// @match       http://*.yoedge.com/smp-app/*
// @version     2.0.0
// @grant       none
// ==/UserScript==

const MANGA_ASPECT_RATIO = 1.5; //漫画宽高比

const DEFAULT_SCALE_RATIO = 0.6; //默认缩放比例
const MAX_SCALE_RATIO = 1; //最大缩放比例，漫画与屏幕等宽
//最小缩放比例，漫画与屏幕等高，即原来的竖屏模式
const MIN_SCALE_RATIO = window.screen.height / MANGA_ASPECT_RATIO / window.screen.width;
const SCALE_STEP = 0.05;

const SCROLLBY_RATIO = 0.2; //快捷键滚动屏幕比例

var gMangaAreaRatio = DEFAULT_SCALE_RATIO; //漫画宽度占屏幕宽度的比例


(function () {
    'use strict';

    //获取本话的配置信息，主要包括页数和图片的url
    var configString = get("smp_cfg.json");
    // console.log(configString);
    var config = JSON.parse(configString);

    //对图片的序号排序
    var orderList = config.pages.order;
    var pageList = config.pages.page;

    //用图片替换canvas
    document.body.innerHTML = '';

    orderList.forEach(function (element) {
        var imgEle = document.createElement('img');
        imgEle.setAttribute('src', pageList[element]);
        imgEle.style.display = 'block';
        imgEle.style.width = numberToPercentage(gMangaAreaRatio);
        imgEle.style.margin = '0 auto';
        document.body.appendChild(imgEle);
    }, this);

    // 自定义缩放、滚动等快捷键
    customizeShortcut();
})();


function get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
}

function customizeShortcut() {
    // 漫画缩放、滚动、翻页
    // 缩放和滚动都可以持续响应，注册到keydown
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case '=':
                scale(SCALE_STEP);
                break;
            case '-':
                scale(-SCALE_STEP);
                break;
            case '0':
                gMangaAreaRatio = DEFAULT_SCALE_RATIO;
                scale(0);
                break;
            case 'j':
                smoothyScrollBy(0, screen.width * gMangaAreaRatio * MANGA_ASPECT_RATIO * SCROLLBY_RATIO);
                break;
            case 'k':
                smoothyScrollBy(0, -screen.width * gMangaAreaRatio * MANGA_ASPECT_RATIO * SCROLLBY_RATIO);
                break;
            case 'h':
                smoothyScrollTo(0, 0);
                break;
            case 'l':
                smoothyScrollTo(0, document.body.scrollHeight);
                break;
            default:
                break;
        }
    });

    // 跳转下一话是单次响应，注册到keyup
    document.addEventListener('keyup', function (event) {
        switch (event.key) {
            case 'n':
                smp.toolbar.nextApp();
                break;
            default:
                break;
        }
    });
}


function scale(increment) {
    var expectedScaleRatio = gMangaAreaRatio + increment;
    if (increment > 0) {
        gMangaAreaRatio = (expectedScaleRatio >= MAX_SCALE_RATIO) ? MAX_SCALE_RATIO : expectedScaleRatio;
    } else if (increment < 0) {
        gMangaAreaRatio = (expectedScaleRatio <= MIN_SCALE_RATIO) ? MIN_SCALE_RATIO : expectedScaleRatio;
    }

    var newWidth = numberToPercentage(gMangaAreaRatio);
    imgElementList = document.getElementsByTagName('img');
    for (var i = 0; i < imgElementList.length; i++) {
        imgElementList[i].style.width = newWidth;
    }
}

function smoothyScrollBy(offsetX, offsetY) {
    try {
        window.scrollBy({ top: offsetY, left: offsetX, behavior: 'smooth' });
    } catch (error) {
        window.scrollBy(offsetX, offsetY);
    }
}

function smoothyScrollTo(x, y) {
    try {
        window.scrollTo({ top: y, left: x, behavior: 'smooth' });
    } catch (error) {
        window.scrollTo(x, y);
    }
}

function numberToPercentage(value) {
    return Math.floor(100 * value) + '%';
}