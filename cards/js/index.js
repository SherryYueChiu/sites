$(function () {
   
    //所有會員卡
    var cards = [
        
        ["newline", "超商"],
        ["OpenPoint", "openpoint.jpg"],
        ["全家", "famimart.png"],
        ["萊爾富", "hilife.png"],
        ["OK", "okmart.png"],
        
        ["newline", "飲食"],
        ["路易莎", "louisa.png"],
        ["It'sDavid", "itsdavid.png"],
        ["雙饗卡", "pk.jpg"],
        ["85°C", "85.jpg"],
        ["添好運", "timhowan.png"],
        ["築間", "zhujian.png"],
        ["三商", "mercuries.jpg"],
        ["六角美食", "laka.png"],
        
        ["newline", "大商場"],
        ["家樂福", "carrefour.jpg"],
        ["全聯", "pxmart.png", "simulate::pxmart2.jpg"],
        ["大潤發", "rtmart.png"],
        ["IKEA", "ikea.jpg"],
        ["三井Outlet", "mop.jpg"],
        ["秀泰", "showtime.png"],
        
        ["newline", "小商場"],
        ["四季", "phoneNumber.png"],
        ["良興", "eclife.png"],
        ["燦坤", "phoneNumber.png"],
        ["順發", "phoneNumber.png"],
        
        ["newline", "美妝"],
        ["康是美", "cosmed.png", "simulate::cosmed2.jpg"],
        ["屈臣氏", "wastons.png", "simulate::wastons2.png"],
        ["寶雅", "poya.png"],
        
        ["newline", "文書"],
        ["誠品", "eslite.png"],
        ["無印良品", "muji.png"],
        ["金石堂", "kingstone.jpg"],
        ["久大", "9ta.png"],
        
        ["newline", "集點"],
        ["HappyGo", "happygo.jpg"],
        
        ["newline", "身份"],
        ["學生證", "thusid.jpg", "simulate::thusid2.png"],
        ["身分證", "id.png"],
        ["台中市圖", "TCLib.png", "simulate::thusid2.png"],
        
        ["newline", "服飾"],
        ["Uniqlo", "uniqlo.png"],
        ["OB嚴選", "ob.png"],
        
        ["newline", "加油"],
        ["中油", "cpc.png"],
        ["全國加油站", "npc.jpg"],
        
        ["newline", "其他"],
        ["銀櫃", "huixingPhone.png"]
    ];
    
    //所有載具
    var einvoice = [
        ["/NSDGGV9", "NSDGGV9.png"],
        ["性別不明關懷協會", "xbbmghxh.png"],
        ["酷兒權益推動聯盟", "keqitdlm.png"],
        ["台中基地協會", "tzjdxh.png"]
    ];

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
        $("#htmlOpt").html(html)

    }

});
