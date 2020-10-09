function customMdMod(html){
    html = html.replace(/:::success(?:<br \/>)([\s\S]*?):::<\/p>/gi,'<div class="alert alert-success">$1</div>');
    html = html.replace(/:::info(?:<br \/>)([\s\S]*?):::<\/p>/gi,'<div class="alert alert-info">$1</div>');
    html = html.replace(/:::warning(?:<br \/>)([\s\S]*?):::<\/p>/gi,'<div class="alert alert-warning">$1</div>');
    html = html.replace(/:::danger(?:<br \/>)([\s\S]*?):::<\/p>/gi,'<div class="alert alert-danger">$1</div>');
    html = html.replace(/:::spoiler([\s\S]*):::/gi,'<details><summary>[摺疊]</summary>$1</details>');
    return html;
}



function md2arr(md){
    //translate Markdown text to 2-dim array by lines and spaces
    line = [], pattern = [];
    line = md.split(/[\r\n]+/);
    line.forEach(function(o){
        pattern.push(o.split(/\s+/));
    });

    arr=[];
    pattern.forEach(function(o){
        if(o[0] != "" || !o){
            //ready for parsing
            if(o[0] == "##"){
                arr.push(["newline", o[1]]);
            }
            if(o[0] == "###"){
                arr.push([o[1]]);
            }
            if(o[0] == "-"){
                arr[arr.length-1].push(o[1]);
            }
        }
    });
    return arr;
}

cards = md2arr(cardsMd);
einvoice = md2arr(einvoiceMd);

$(function () {

    //展示原App截圖
    function showSimulateBtn(img) {
        $("#simulateBtn").fadeIn(100).click(function () {
            $("#popupImg").attr("src", `./cardsImg/${img}`).fadeIn(100);
        });
    }

    //再次點擊以退出模擬模式
    $("#popupImg").click(function () {
        $(this).fadeOut(100);
    });

    //點擊以顯示/隱藏區塊
    $(".tag").click(function () {
        if ($(this).css("opacity") > 0.5) {
            $(this).animate({
                opacity: 0.1
            }, 100);
            $(this).find("img").animate({
                opacity: 0
            }, 100);
        } else {
            $(this).animate({
                opacity: 1
            }, 100);
            $(this).find("img").animate({
                opacity: 1
            }, 100);
        }
    });

    //彈出選單選張載具
    $(".einvoice").dblclick(function () {
        $("#einvoice").modal("show");
            $(this).animate({
                opacity: 1
            }, 100);
            $(this).find("img").animate({
                opacity: 1
            }, 100);
    });

    //彈出選單選張會員卡
    $(".member").dblclick(function () {
        $("#cards").modal("show");
            $(this).animate({
                opacity: 1
            }, 100);
            $(this).find("img").animate({
                opacity: 1
            }, 100);
    });

    //背景掃碼動畫
    setInterval(function () {
        $(".scannerImg").animate({
            "top": "0"
        }, 1500).animate({
            "top": "100vh"
        }, 1500);
    }, 3000);

    //載入所有載具
    einvoice.forEach(function (o) {
        $("#einvoice ul").append(`<li class="list-group-item">${o[0]}</li>`);
        $("#einvoice ul>li").click(function () {
            let str = $(this).html();
            einvoice.forEach(function (o) {
                if (str.indexOf(o[0]) != -1) {
                    $("#einvoice").modal("hide");
                    $("#einvoiceName").eq(0).html(o[0]);
                    $(".einvoiceImg").attr("src", `./einvoiceImg/${o[1]}`);

                }
            });
        });
    });
    
    //載入所有會員卡
    str=`<div class="row">`;
    cards.forEach(function (o) {
    if(o[0]!="newline"){
        str+=`
                <div class="tag col-5 bg-white p-4 m-3 rounded mr-auto shadow-lg pull-left">
                    <p class="color1 bold mr-auto pull-left"><h5>${o[0]}</h5></p>
                </div>
            `;
    }else{
        str+=`
        </div>
        <div class="tabs row" style="border-bottom-style:dashed;border-color:#ddd;padding:5px;";">
          <span style="" class="ml-5">${o[1]}</span>
        </div>
        <div class="row">
            `;
    }
    });
    str+=`</div>`;
    $("#cards .modal-body").append(str);
        $("#cards .tag").click(function () {
            let str = $(this).html();
            cards.forEach(function (o) {
                if (str.indexOf(o[0]) != -1) {
                    $("#cards").modal("hide");
                    $("#member").html(o[0]);
                    $(".memberImg").attr("src", `./cardsImg/${o[1]}`);
                    if (o[2] && o[2].indexOf("simulate") != -1) {
                        showSimulateBtn(o[2].split("::")[1]);
                    } else {
                        $("#simulateBtn").fadeOut(100);
                    }
                }
            });
        });
    

    storedMd = "";
    $('#mdIpt').val(localStorage.getItem("storedMd2"));
    convert();

    $('#mdIpt').on('input propertychange', convert);
    timer = setInterval(function() {
        if (storedMd != $("#mdIpt").val()) {
            storedMd = $("#mdIpt").val();
            localStorage.setItem("storedMd2", storedMd);
        }
    }, 2000);

    function convert() {
        converter = new showdown.Converter({
            metadata: true,
            underline: true,
            ghCodeBlocks: true,
            openLinksInNewWindow: true,
            emoji: true,
            simpleLineBreaks: true,
            tasklists: true,
            tables: true,
            splitAdjacentBlockquotes: true,
            strikethrough: true,
            parseImgDimensions: true,
            omitExtraWLInCodeBlocks: true
        });
        showdown.setFlavor('vanilla');
        text = $("#mdIpt").val();
        html = converter.makeHtml(text);
        html = customMdMod(html);
        $("#htmlOpt").html(html)

    }

});
