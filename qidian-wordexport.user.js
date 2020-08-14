// ==UserScript==
// @name         起点章节导出
// @namespace    https://www.saintic.com/
// @version      0.3
// @description  阅文作家专区已发布章节中，文章内容导出为文档。
// @author       staugur
// @match        http*://write.qq.com/booknovels/chaptermanage/CBID/*
// @icon         https://static.saintic.com/cdn/images/favicon-64.png
// @license      MIT
// @date         2018-06-07
// @modified     2018-06-15
// @github       https://github.com/staugur/scripts/blob/master/userscripts/qidian-wordexport.user.js
// @supportURL   https://github.com/staugur/scripts/issues
// ==/UserScript==

(function() {
    'use strict';
    /*
        公共接口
    */
    //字符串是否包含子串
    function isContains(str, substr) {
        //str是否包含substr
        return str.indexOf(substr) >= 0;
    }
    //判断页面中id是否存在
    function hasId(id) {
        //有此id返回true，否则返回false
        var element = document.getElementById(id);
        if (element) {
            return true
        } else {
            return false
        }
    }
    //加载js文件
    function addJS(src, cb) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = typeof cb === "function" ? cb : function() {};
    }
    /*
        主要代码
    */
    //由于@require方式引入jquery时其他组件使用异常，故引用cdn中jquery v1.10.1；加载完成后引用又拍云中其他依赖
    addJS("https://cdn.bootcss.com/jquery/1.10.1/jquery.min.js", function() {
        addJS("https://static.saintic.com/cdn/doc/FileSaver.min.js", function() {
            addJS("https://static.saintic.com/cdn/doc/jquery.wordexport.js", function() {
                setTimeout(function() {
                    if (hasId("viewChapterBox") && hasId("portamento_container") && hasId("chapterContent") && hasId("chapterTitle")) {
                        //定位
                        var ct = document.getElementById('chapterTitle');
                        var pt = document.getElementById('portamento_container').getElementsByClassName('titleBtn')[0];
                        //添加下载按钮
                        if (isContains(pt.innerText, "导出") === false) {
                            pt.insertAdjacentHTML('afterbegin', '<a id="downloadChapterBtn" class="button" href="javascript:">导出</a>')
                        }
                        //监听点击下载事件
                        document.getElementById("downloadChapterBtn").onclick = function() {
                            try {
                                $("#chapterContent").wordExport(ct.innerText);
                            } catch (e) {
                                console.error(e);
                                alert("当前文章无法导出为doc文档！");
                            }
                        };
                    }
                }, 1000);
            });
        });
    });
})();