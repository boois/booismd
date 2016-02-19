/**
 * booisMarked boois@qq.com
 * <!--注释--> 	等同于html中的注释,注释后的文字将不会显示出来,可以做旁注用
 * <!--page 分页说明--> 	分页功能,分页说明可以不写
 * [表情] 	表情代码,仅做了部分微博相应的表情,具体请尝试点击表情按钮
 * .c1_文字_.c1 	样式,对文字进行着色或加样式,"_.c1 "末尾带一个空格,使用class=c1的样式,具体的表现由css来决定
 * ... 	三个英文句号表示一个空格(相当于按4下空格键)
 * 用法:
 * window.page = -1;//如果默认加载文档时就整页显示,请设置page为 -1
 * $(function () {
 *     booisMarked(2, "#md_soucre", "#content", "#nav",{"[新表情]":"http://cdn.boois.cn/emoji/weibo/xiaoku_thumb.gif"}); //0=原始markdown,1=github标准的marked,2=在marked标准上做的boois扩展
 * });
 */
MarkDownPager = function (mdCode) {
    var that = this;
    this.code = mdCode;
    this.pages = []
    this.paging = function () {
        var arr = that.code.split(/\<\!--\s*page\s*.*?--\>/gi);
        for (x in arr) {
            var text = arr[x];
            if ($.trim(text) == "") continue;
            that.pages.push(text);
        }
    }
    that.paging();
    return this;
}
MarkDownPager.prototype.getPage = function (page) {
    page = parseInt(page);
    if (page < 1) page = 1
    if (page > this.pages.length) page = this.pages.length;
    return this.pages[page - 1];
}
MarkDownPager.prototype.renderPageNav = function (id, callback) {
    if (!window.pager) alert('window.pager不存在!');
    //开始生成标签
    var page_arr = []
    for (var i = 1; i < window.pager.pages.length + 1; i++) {
        page_arr.push('<a href="javascript:void(0);" class="page_tag' + (window.page == i ? ' atv' : '') + '" page="' + i + '">' + i + '</a>')
    }
    page_arr.push('<a href="javascript:void(0);" class="page_tag' + (window.page == -1 ? ' atv' : '') + '" page="-1">全部</a>')
    $(id).html(page_arr.join(""));
    $(id).find(".page_tag").click(function () {
        $(this).siblings(".atv").removeClass("atv");
        $(this).addClass("atv");
        if (callback) callback(parseInt($(this).attr("page")));
    });
}
window.booisMarked = function (type, sourceBoxId, renderBoxId, pageBoxId, emojis) {
    /*
    0=原始markdown,1=github标准的marked,2=在marked标准上做的boois扩展
    */
    var sourceBox = sourceBoxId ? $(sourceBoxId) : $("body"); //如果没有输入来源id,则默认为body
    var renderBox = renderBoxId ? $(renderBoxId) : sourceBox; //如果没有输入renderid则默认为sourceBox
    if (sourceBox.length == 0) alert('没有找到数据容器"' + sourceBoxId + '",请用jquery的命名标准如"#id,.class"');
    if (renderBox.length == 0) alert('没有找到渲染容器"' + renderBox + '",请用jquery的命名标准如"#id,.class"');
    var val = sourceBox.val() != "" ? sourceBox.val() : sourceBox.html();
    var renderer = new marked.Renderer();
    //如果type=0或1,直接返回marked
    if (type == 0 || type == 1) {
        marked.setOptions({//TODO 能不能忽略空格？？？
            renderer: renderer,
            gfm: type == 1,
            tables: type == 1,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        })
        renderBox.html(marked(val));
        return;
    }

    var __fmt_emoji = function (val) {
        var arr = { "笑cry": "http://cdn.boois.cn/emoji/weibo/xiaoku_thumb.gif",
            "微笑": "http://cdn.boois.cn/emoji/weibo/huanglianwx_thumb.gif",
            "嘻嘻": "http://cdn.boois.cn/emoji/weibo/tootha_thumb.gif",
            "哈哈": "http://cdn.boois.cn/emoji/weibo/laugh.gif",
            "可爱": "http://cdn.boois.cn/emoji/weibo/tza_thumb.gif",
            "可怜": "http://cdn.boois.cn/emoji/weibo/kl_thumb.gif",
            "挖鼻": "http://cdn.boois.cn/emoji/weibo/wabi_thumb.gif",
            "吃惊": "http://cdn.boois.cn/emoji/weibo/cj_thumb.gif",
            "害羞": "http://cdn.boois.cn/emoji/weibo/shamea_thumb.gif",
            "闭嘴": "http://cdn.boois.cn/emoji/weibo/bz_thumb.gif",
            "挤眼": "http://cdn.boois.cn/emoji/weibo/zy_thumb.gif",
            "鄙视": "http://cdn.boois.cn/emoji/weibo/bs2_thumb.gif",
            "爱你": "http://cdn.boois.cn/emoji/weibo/lovea_thumb.gif",
            "泪": "http://cdn.boois.cn/emoji/weibo/sada_thumb.gif",
            "偷笑": "http://cdn.boois.cn/emoji/weibo/heia_thumb.gif",
            "亲亲": "http://cdn.boois.cn/emoji/weibo/qq_thumb.gif",
            "生病": "http://cdn.boois.cn/emoji/weibo/sb_thumb.gif",
            "太开心": "http://cdn.boois.cn/emoji/weibo/mb_thumb.gif",
            "白眼": "http://cdn.boois.cn/emoji/weibo/landeln_thumb.gif",
            "右哼哼": "http://cdn.boois.cn/emoji/weibo/yhh_thumb.gif",
            "左哼哼": "http://cdn.boois.cn/emoji/weibo/zhh_thumb.gif",
            "嘘": "http://cdn.boois.cn/emoji/weibo/x_thumb.gif",
            "衰": "http://cdn.boois.cn/emoji/weibo/cry.gif",
            "委屈": "http://cdn.boois.cn/emoji/weibo/wq_thumb.gif",
            "吐": "http://cdn.boois.cn/emoji/weibo/t_thumb.gif",
            "哈欠": "http://cdn.boois.cn/emoji/weibo/haqianv2_thumb.gif",
            "抱抱": "http://cdn.boois.cn/emoji/weibo/bba_thumb.gif",
            "怒": "http://cdn.boois.cn/emoji/weibo/angrya_thumb.gif",
            "疑问": "http://cdn.boois.cn/emoji/weibo/yw_thumb.gif",
            "馋嘴": "http://cdn.boois.cn/emoji/weibo/cza_thumb.gif",
            "拜拜": "http://cdn.boois.cn/emoji/weibo/88_thumb.gif",
            "思考": "http://cdn.boois.cn/emoji/weibo/sk_thumb.gif",
            "汗": "http://cdn.boois.cn/emoji/weibo/sweata_thumb.gif",
            "困": "http://cdn.boois.cn/emoji/weibo/kunv2_thumb.gif",
            "睡": "http://cdn.boois.cn/emoji/weibo/huangliansj_thumb.gif",
            "钱": "http://cdn.boois.cn/emoji/weibo/money_thumb.gif",
            "失望": "http://cdn.boois.cn/emoji/weibo/sw_thumb.gif",
            "酷": "http://cdn.boois.cn/emoji/weibo/cool_thumb.gif",
            "色": "http://cdn.boois.cn/emoji/weibo/huanglianse_thumb.gif",
            "哼": "http://cdn.boois.cn/emoji/weibo/hatea_thumb.gif",
            "鼓掌": "http://cdn.boois.cn/emoji/weibo/gza_thumb.gif",
            "晕": "http://cdn.boois.cn/emoji/weibo/dizzya_thumb.gif",
            "悲伤": "http://cdn.boois.cn/emoji/weibo/bs_thumb.gif",
            "抓狂": "http://cdn.boois.cn/emoji/weibo/crazya_thumb.gif",
            "黑线": "http://cdn.boois.cn/emoji/weibo/h_thumb.gif",
            "阴险": "http://cdn.boois.cn/emoji/weibo/yx_thumb.gif",
            "怒骂": "http://cdn.boois.cn/emoji/weibo/numav2_thumb.gif",
            "心": "http://cdn.boois.cn/emoji/weibo/hearta_thumb.gif",
            "伤心": "http://cdn.boois.cn/emoji/weibo/unheart.gif",
            "ok": "http://cdn.boois.cn/emoji/weibo/ok_thumb.gif",
            "耶": "http://cdn.boois.cn/emoji/weibo/ye_thumb.gif",
            "good": "http://cdn.boois.cn/emoji/weibo/good_thumb.gif",
            "NO": "http://cdn.boois.cn/emoji/weibo/buyao_org.gif",
            "赞": "http://cdn.boois.cn/emoji/weibo/z2_thumb.gif",
            "来": "http://cdn.boois.cn/emoji/weibo/come_thumb.gif",
            "弱": "http://cdn.boois.cn/emoji/weibo/sad_thumb.gif",
            "给力": "http://cdn.boois.cn/emoji/weibo/geiliv2_thumb.gif",
            "威武": "http://cdn.boois.cn/emoji/weibo/vw_thumb.gif",
            "蜡烛": "http://cdn.boois.cn/emoji/weibo/lazhuv2_thumb.gif"
        }
        if (emojis) {
            for (x in emojis) {
                if (val.indexOf("[" + x + "]") == -1) continue;
                var regx = new RegExp("\\[" + x + "\\]", "gi");
                val = val.replace(regx, '<em style="background-image:url(' + emojis[x] + ');" class="face"></em>');
            }
        }
        for (x in arr) {
            if (val.indexOf("[" + x + "]") == -1) continue;
            var regx = new RegExp("\\[" + x + "\\]", "gi");
            val = val.replace(regx, '<em style="background-image:url(' + arr[x] + ');" class="face"></em>');
        }
        return val;
    }
    window.is_pager = /\<\!--\s*page\s*.*?--\>/gi.test(val);
    window.pager = new MarkDownPager(val);
    if (!window.page) window.page = 1;
    var __render = function () {
        if (window.is_pager && window.page != -1) {
            val = window.pager.getPage(window.page);
        } else {
            val = window.pager.code;
        }
        val = val.replace(/\\\|/gi, "{sep}");
        val = val.replace(/\\\./gi, "{dot}");
        val = val.replace(/\\\[/gi, "{sqb}");
        val = val.replace(/\\\:/gi, "{cln}");
        val = val.replace(/\\\</gi, "&lt;");
        val = val.replace(/\\\>/gi, "&gt;");
        //val = val.replace(/\<\!--(.|\n)*?--\>/gi,"");//这句是去掉注释内容,当然不清理的话也不会显示出来
        val = val.replace(/\.([a-zA-Z0-9_]*)_(.*?)_\.\1\s/gi, '<span class="$1">$2</span>')
        marked.setOptions({
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        })
        html = marked(val);
        html = __fmt_emoji(html);
        html = html.replace(/\.\.\./gi, "&nbsp;&nbsp;&nbsp;&nbsp;");
        html = html.replace(/\[br\]/gi, "<br/>");
        html = html.replace(/\{sep\}/gi, "|");
        html = html.replace(/\{dot\}/gi, ".");
        html = html.replace(/\{sqb\}/gi, "[");
        html = html.replace(/\{cln\}/gi, ":");
        renderBox.html(html);
    }
    if (pageBoxId && window.pager.pages.length > 1) window.pager.renderPageNav(pageBoxId, function (page) {
        window.page = page;
        __render();
    });
    __render();
}