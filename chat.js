window.addEventListener('message', (event) => {
    window.location.href = event.data
});
var head=``;
var sleeptime = 5000;
var timeout = null;
$(document).ready(async function() {
    var from_id = getUrlParam("from_id");
    if(!from_id){
        $(".page").show();
        $(".weui-msg__title").text('建站链接无效');
        $(".container").hide();
        return;
    }
    $.getScript("https://rjz.moreqifu.cn/from/dialog/"+from_id+".js", function() {
        dialog = dialog;
        if(dialog.other == undefined){
            dialog.other = {};
            dialog.other.highlight = "#FC0107";
        }
        var host = window.location.host;
        dialog.domain.push("jz.zhb1.com");
        dialog.key.push("c7c10bd5e07d832790d909f963117cd3");
        if (!dialog.domain.includes(host) && !host.includes('github.io')) {
            $(".page").show();
            $(".weui-msg__title").text('链接域名未授权');
            $(".container").hide();
            return;
        }
        var key = md5(host+"morejz"+host);
        if (!dialog.key.includes(key) && !host.includes('github.io')) {
            $(".page").show();
            $(".weui-msg__title").text('链接域名未授权');
            $(".container").hide();
            return;
        }
        $('title').text(dialog.title);
        headimg();
        welinit();
    });
    $('input[name="reply_c"]').on('focus', function() {
        $(".footer-info").hide();
        $('.direct-reply-box').css('padding','10px');
    });
    $('input[name="reply_c"]').on('blur', function() {
        setTimeout(()=>{
            $(".footer-info").show();
            $('.direct-reply-box').css('padding','10px 10px calc(10px + env(safe-area-inset-bottom))');
        },1000)
    });
});
var z_describe = '';

$(".re-btn").click(function(event) {
    var $input = $('input[name="reply_c"]');
    var val = $.trim($input.val());
    if(val == ''){
        return;
    }
    if(dialog.user && dialog.user.status){
        if(dialog.user.status == 1){
             var rightava = `<img src="${ dialog.user.headimg }">`;
        }else{
            var rightava = '';
        }
    }else{
        var rightava = '';
    }
    $(".module-direct-item").append(`<div class="right"><p>${ val }</p>${ rightava }</div>`);
    setTimeout(()=>{
        $input.val('');
    },100)
    if(dialog.hit.status == 1 || dialog.hit.status == undefined){
        if(dialog.hit.text == '' || val == dialog.hit.text){
            z_describe = val;
            hit(1);
        }else{
            hit(2);
        }
    }else if(dialog.hit.status == 2){
        if(containsChineseMobile(val)){
            z_describe = val;
            hit(1);
        }else{
            hit(2);
        }
    }
});

function headimg(){
    if(dialog.banner){
        $(".module-image").html(`<img src="${ dialog.banner }">`);
    }else{
        $(".module-image").html('');
    }
}

function welinit(){
    if(dialog.kefu.status == 1){
        head = `<img src="${ dialog.kefu.headimg || 'https://wwcdn.weixin.qq.com/node/wework/images/avatar2.96df991a19.png' }">
                <div class="left-con">
                    `;
    }else if(dialog.kefu.status == 3){
        head = `<img src="${ dialog.kefu.headimg || 'https://wwcdn.weixin.qq.com/node/wework/images/avatar2.96df991a19.png' }">
                <div class="left-con">
                <p>${ dialog.kefu.name || '客服老师'}<font>${getCurrentTime()}</font></p>`;
    }else if(dialog.kefu.status == 4){
        head = `<div class="left-con">`;
    }else{
        head = `<img src="${ dialog.kefu.headimg || 'https://wwcdn.weixin.qq.com/node/wework/images/avatar2.96df991a19.png' }">
                <div class="left-con">
                <p>${ dialog.kefu.name || '客服老师'}</p>`;
    }
    if(dialog.welcome.length > 0){
        replydoc(dialog.welcome);
    }
    if(dialog.company.name && dialog.company.name.length > 0){
        $('.footer-info').html(`<p>${ dialog.company.name }</p>`)
    }
}

function hit(id){
    if(id==1){
        if(dialog.hit.next.length > 0){
            replydoc(dialog.hit.next);
        }else{
            replydoc(dialog.hit.nohit);
        }
    }else{
        if(dialog.hit.nohit.length == 0){
            replydoc(dialog.hit.next);
        }else{
            replydoc(dialog.hit.nohit);
        }
    }
}

function nexturl(z_d){
    z_describe = z_d || z_d.length > 0 ? z_d : z_describe;
    var search = window.location.search.slice(1);
    if (search == "") {
        search = "z_describe="+z_describe;
    } else {
        search += "&z_describe="+z_describe;
    }
    if(dialog.transform.status == 'link'){
        var link_url = dialog.transform.link_url;
        if (link_url.indexOf("?") !== -1) {
            link_url = link_url+"&"+search;
        } else {
            link_url = link_url+"?"+search;
        }
        if (window.top != window.self) {
            window.location.href = link_url;
        }else{
            window.open(link_url,"_blank");
        }
    }else if(dialog.transform.status == 'wechat'){
        var transform = dialog.transform;
        var jump_url = '';
        if (transform.wechat_code == "zhb") {
            if(isWeiXin() || location.href.indexOf("back_platfrom=gdt") != -1){
                jump_url = `https://ad.zhuanhuabao.com/l/${transform.wechat_id}.html?${search}`;
                //加载 iframe 等回调
                document.getElementById('myFrame').src = jump_url;
                return;
            }else{
                jump_url = `https://ad2.zhb1.com/l/${transform.wechat_id}.html?${search}`;
            }
        } else if(transform.wechat_code == "ttwl"){
            jump_url = `https://ad.pdb2.com/l/${transform.wechat_id}?${search}`
        } else if(transform.wechat_code == "weike"){
            jump_url = `https://ad.weikea.cn/kf/${transform.wechat_id}.html?${search}`
        } else if(transform.wechat_code == "yxt"){
            if(transform.ct){
                jump_url = `https://ad.tgzhb.cn/sites/${transform.ct}/${transform.wechat_id}.html?${search}`
            }
        }
        if(jump_url.includes('http')){
            window.open(jump_url,"_blank");
        }
    }
}

function getUrlParam(paramName) {
    var url = window.location.href;
    let urlObj = new URL(url);
    let params = new URLSearchParams(urlObj.search);
    return params.get(paramName);
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function replydoc(items){
    if(dialog.kefu.status == 3){
        head = `<img src="${ dialog.kefu.headimg || 'https://wwcdn.weixin.qq.com/node/wework/images/avatar2.96df991a19.png' }">
                <div class="left-con">
                <p>${ dialog.kefu.name || '客服老师'}<font>${getCurrentTime()}</font></p>`;
    }
    var replyhtml = '';
    $.each(items, function(index, val) {
        var tip = dialog.card.tip == 0 || dialog.card.tip == '' ? `` : `<span class="tip">${ dialog.card.tip }</span>`;
        if(val.type == 1){
            try {
                var message = val.text.length != 0 ? val.text.replace(/\[b\]/g, `<b style="color:${ dialog.other.highlight }">`).replace(/\[\/b\]/g, '</b>') : "";
            } catch(e) {
                var message = val.text.length != 0 ? val.text : "";
            }
            replyitem = message.length == 0 ? "" : `<div class="left">${ head }<div class="ans">${ message }</div></div></div>`;
        }else if(val.type == 2){
            replyitem = val.src.length <= 5 ? "" :  `<div class="left">${ head }<img src="${ val.src || 'https://wwcdn.weixin.qq.com/node/wework/images/avatar2.96df991a19.png' }"></div></div>`;
        }else{
            replyitem = `<div class="left">
                ${ head }
                <div class="card" onclick="nexturl('${ z_describe }')"><div class="card-avater"><img src="${ dialog.card.logo || 'https://wwcdn.weixin.qq.com/node/wework/images/avatar2.96df991a19.png' }">${tip}</div><div class="card-con"><p>${ dialog.card.name }</p><font>${ dialog.card.des }</font></div></div></div></div>`;
        }
        replyhtml += `${ replyitem }`;
    });
    $(".module-direct-item").append(replyhtml);
}

function containsChineseMobile(text) {
  var regex = /1[3-9]\d{9}/;
  return regex.test(text);
}

function isWeiXin(){
    var ua = navigator.userAgent.toLowerCase()
    var isWXWork = ua.match(/wxwork/i) == 'wxwork'
    var isWeixin = !isWXWork && ua.match(/micromessenger/i) == 'micromessenger'
    return isWeixin;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}