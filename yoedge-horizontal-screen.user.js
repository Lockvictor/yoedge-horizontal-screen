// ==UserScript==
// @name        yoedge-horizontal-screen
// @namespace   https://github.com/Lockvictor
// @author      Lockvictor
// @description 实现灰机汉化组漫画网站（yoedge.com）的横屏阅读模式
// @homepage    https://github.com/Lockvictor/yoedge-horizontal-screen
// @updateURL   https://github.com/Lockvictor/yoedge-horizontal-screen/raw/master/yoedge-horizontal-screen.user.js
// @match       http://*.yoedge.com/smp-app/*
// @version     2.1.0
// @grant       none
// ==/UserScript==

//漫画宽高比
const MANGA_ASPECT_RATIO = 1.5;

//默认屏幕占比
const DEFAULT_SCALE_RATIO = 0.6;
//最大占比，漫画与屏幕等宽
const MAX_SCALE_RATIO = 1;
//最小占比，漫画与屏幕等高，即原来的竖屏模式
const MIN_SCALE_RATIO = window.screen.height / MANGA_ASPECT_RATIO / window.screen.width;
//屏幕占比缩放步长
const SCALE_STEP = 0.05;

//j和k快捷键滚动屏幕的比例
const SCROLLBY_RATIO = 0.2;

//漫画当前屏幕占比
let gMangaAreaRatio = DEFAULT_SCALE_RATIO;

(function () {
    'use strict';

    document.body.innerHTML = '';
    document.addEventListener('contextmenu', event => event.preventDefault());

    //获取本话的配置信息，主要包括页数和图片的url
    let configUrl = window.location.href.replace('index.html', 'smp_cfg.json');
    fetch(configUrl).then(response => response.json())
        .then(config => loadAllPage(config))
        .catch(e => alert(e));
})();

function loadAllPage(config) {
    //获取图片url和序号
    let orderList = config.pages.order;
    let imageUrlList = config.pages.page;

    //创建漫画原图的img元素
    for (let i = 0; i < orderList.length; i++) {
        let order = orderList[i];
        let img = document.createElement('img');
        img.id = 'img' + order;
        img.style.display = 'none';
        img.src = imageUrlList[order];
        document.body.appendChild(img);
    }

    let imgElementList = document.getElementsByTagName('img');

    //图片传输需要时间，直接获取会出错，采用分次加载，每次加载5张图
    let loadStartIndex = 0;
    const LOAD_STEP = 5;
    const INDEX_LIMIT = imgElementList.length;
    // console.log(`INDEX_LIMIT: ${INDEX_LIMIT}`);
    let imgSizeCheckFlag = setInterval(function () {
        let expectEndIndex = loadStartIndex + LOAD_STEP;
        let loadEndIndex = (expectEndIndex > INDEX_LIMIT)? INDEX_LIMIT : expectEndIndex;

        if (isImageOk(imgElementList, loadStartIndex, loadEndIndex)) {
            //用canvas绘制原图，实现反色块的处理
            drawImageByCanvas(orderList, imageUrlList, loadStartIndex, loadEndIndex);
            loadStartIndex = loadEndIndex;
        }
        
        if (loadStartIndex === INDEX_LIMIT) {
            clearInterval(imgSizeCheckFlag);
            for (let i = 0; i < orderList.length; i++) {
                let order = orderList[i];
                let img = document.getElementById('img' + order);
                document.body.removeChild(img);
            }
        }
        // console.log('loadStartIndex: ' + loadStartIndex);
    }, 1000);

    // 自定义缩放、滚动等快捷键
    customizeShortcut();
}

function isImageOk(imgElementList, startIndex, endIndex) {
    let isLoaded = true;
    for (let i = startIndex; i < endIndex; i++) {
        let img = imgElementList[i];
        if (!img.complete || img.naturalWidth === 0) {
            isLoaded = false;
            break;
        }
    }
    return isLoaded;
}

function drawImageByCanvas(orderList, imageUrlList, startIndex, endIndex) {
    for (let i = startIndex; i < endIndex; i++) {
        let order = orderList[i];

        let img = document.getElementById('img' + order);
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        // console.log(img);
        // console.log(`order: ${order}, width: ${width}, height: ${height}`);

        let mgcanv = document.createElement('canvas');
        mgcanv.id = 'canvas' + order;
        mgcanv.width = width;
        mgcanv.height = height;
        mgcanv.style.display = 'block';
        mgcanv.style.margin = '0 auto';
        mgcanv.style.width = numberToPercentage(gMangaAreaRatio);
        // console.log(mgcanv);

        let context = mgcanv.getContext('2d');
        context.drawImage(img, 0, 0);
        //前5张图没有反色块
        if (i > 4) {
            cleanClutter(imageUrlList[order], context, width, height);
        }
        document.body.appendChild(mgcanv);
    }
}

function cleanClutter(imageUrl, context, width, height) {
    var imageData = context.getImageData(0, 0, width, height);
    var data = imageData.data;

    var j1 = 0, j2 = 0;
    var r = width * 4, r1 = r * 110, r2 = r;
    var y1 = Math.floor(height >> 1) & 0xFFFFFFE;
    if (window.clutter == '2' && imageUrl.indexOf('.png') !== -1) {
        y1 = 100;
    }
    var x1 = Math.floor(width / 3);
    var x2 = x1 << 1;
    var y2 = y1 + 20;
    if (height > 550) {
        y2 = y1 + 60;
    }

    if (window.clutter == '2') {
        var lastOf = imageUrl.lastIndexOf('/');
        var fileName = decodeURI(imageUrl.substring(lastOf));
        if (fileName.indexOf("3") != -1) {
            y1 -= 8;
            y2 -= 11;
        } else if (fileName.indexOf("4") != -1) {
            y1 -= 6;
            y2 -= 13;
        } else if (fileName.indexOf("5") != -1) {
            y2 -= 14;
        } else if (fileName.indexOf("7") != -1) {
            y1 -= 2;
            y2 -= 3;
        } else if (fileName.indexOf("9") != -1) {
            y2 -= 13;
        } else if (fileName.indexOf("01") != -1) {
            y2 -= 11;
        } else if (fileName.indexOf("02") != -1) {
            y1 -= 12;
            y2 -= 17;
        }
        if (fileName.indexOf("4") != -1) {
            x1 -= 7;
            x2 -= 19;
        } else if (fileName.indexOf("5") != -1) {
            x1 -= 15;
            x2 -= 13;
        } else if (fileName.indexOf("6") != -1) {
            x1 -= 31;
            x2 = x1 + 76;
        } else if (fileName.indexOf("7") != -1) {
            x1 += 21;
        } else if (fileName.indexOf("8") != -1) {
            x2 -= 13;
        } else if (fileName.indexOf("01") != -1) {
            x2 = x1 + 99;
        } else if (fileName.indexOf("02") != -1) {
            x1 -= 13;
            x2 = x1 + 97;
        } else if (fileName.indexOf("03") != -1) {
            x2 = x1 + 91;
        }
    }
    var is = y1 * r + x1 * 4, i = 0;

    if (window.clutter == '2') {
        for (j1 = y1; j1 < y2; j1 += 1) {
            i = is;
            for (j2 = x1; j2 < x2; j2++) {
                data[i + 2] = data[i + 2] ^ 0xFF;
                data[i + 1] = data[i + 1] ^ 0xFF;
                data[i] = data[i] ^ 0xFF;
                i += 4;
            }
            x2--;
            is += r2;
        }
    } else {
        for (j1 = y1; j1 < y2; j1 += 1) {
            i = is;
            for (j2 = x1; j2 < x2; j2++) {
                if (data[i + 3 - r1] !== 0) {
                    data[i + 2] = data[i + 2] ^ data[i + 2 - r1];
                    data[i + 1] = data[i + 1] ^ data[i + 1 - r1];
                    data[i] = data[i] ^ data[i - r1];
                }
                i += 4;
            }
            is += r2;
        }
    }

    context.putImageData(imageData, 0, 0);
}

function scale(increment) {
    var expectedScaleRatio = gMangaAreaRatio + increment;
    if (increment > 0) {
        gMangaAreaRatio = (expectedScaleRatio >= MAX_SCALE_RATIO) ? MAX_SCALE_RATIO : expectedScaleRatio;
    } else if (increment < 0) {
        gMangaAreaRatio = (expectedScaleRatio <= MIN_SCALE_RATIO) ? MIN_SCALE_RATIO : expectedScaleRatio;
    }

    var newWidth = numberToPercentage(gMangaAreaRatio);
    canvasList = document.getElementsByTagName('canvas');
    for (var i = 0; i < canvasList.length; i++) {
        canvasList[i].style.width = newWidth;
    }
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


//=====================基础功能相关函数=====================
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