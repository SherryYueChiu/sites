//some hand-made methods
function md2arr(md) {
  //translate Markdown text to 2-dim array by lines and spaces
  line = [],
  pattern = [];
  line = md.split(/[\r\n]+/);
  line.forEach(function (o) {
    pattern.push(o.split(/\s+/));
  });

  arr = [];
  pattern.forEach(function (o) {
    if (o[0] != "" || !o) {
      //parse StoreClss, storeTag, and store param from pattern into array
      if (o[0] == "##") {
        arr.push(["newline", o[1]]);
      }
      if (o[0] == "###") {
        arr.push([o[1]]);
      }
      if (o[0] == "-") {
        arr[arr.length - 1].push(o[1]);
      }
    }
  });
  return arr;
}

coupons = md2arr(couponsMd);

var url = window.location.href;
var userIP;
var bannedList = ["0.0.0.0"];


$(function() {

  JsBarcode(".einvoiceImg>.barcode").init();

    //切換優惠券
    $(".tag").eq(1).click(function() {
        $("#shops").modal("show");
        $(this).animate({
            opacity: 1
        }, 100);
    });

    //全屏模式
    $("body").on('click', function() {
        /*try {
            document.body.requestFullscreen(); //chrome, firefox, ie
        } catch (e) {
            console.log("fullscreen method1 failed.");
        }
        window.scrollTo(0, 2);*/
    });

    //背景掃碼動畫
    setInterval(function() {
        $(".scannerImg").animate({
            "top": "0"
        }, 1500).animate({
            "top": "100vh"
        }, 1500);
    }, 3000);

    //載入所有條碼
    var cnt=0;
    coupons.forEach(function(o) {
        let disable = false;
        if (!!o[6]) {
            disable = true;
            let pswd = o[6];
            if (url.indexOf(pswd) != -1)
                disable = false;
        }
        if (!!o[7]) {
            disable = true;
            let pswd = o[7];
            if (prompt("密語").indexOf(pswd) != -1)
                disable = false;
        }
        if (!disable) {
            cnt++;
            $("#shops ul").append(`<li class="list-group-item">${o[0]}</li>`);
            $("#shops ul>li").click(function() {
                let str = $(this).html();
                coupons.forEach(function(o) {
                    if (str.indexOf(o[0]) != -1) {
                        //Log Visiter
						
						//$.get("log.php", {
                        //    TYPE: `SELECT${o[0]}`
                        //}, function(receive) {
                        //    userIP = receive.split("/");
                        //    let banned = bannedList.find(function(o) {
                        //        return userIP[0].indexOf(o) != -1 || userIP[1].indexOf(o) != -1;
                        //    });
                        //    if (!banned) {
                                $("#shops").modal("hide");
                                $("#item").eq(0).html(o[0]);
                                $("#description").eq(0).html(o[1]);
                                $("#memberImg").html(PaintCode(o[2], o[3]));
                                if(!!o[4]){
                                  $("#memberImg2").html(PaintCode(o[4], o[5])).show();
                                }
                                JsBarcode(".memberImg>.barcode").init();
                        //    } else {
                        //        alert("您有使用優惠卻沒留言回報的不良記錄");
                        //    }
                        //});
                    }
                });
            });
        }
    });
    if(cnt==0)
            $("#shops ul").append("一張都沒有");
});