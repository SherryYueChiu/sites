//some hand-made methods
function md2arr(md) {
  //translate Markdown text to 2-dim array by lines and spaces
  line = [],
  pattern = [];
  line = md.split(/[\r\n]+/);
  line.forEach(function (o) {
    pattern.push([
        o.substring(0, o.search(" ")),
        o.substring(o.search(" ") + 1)
      ]);
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

$(function () {

  JsBarcode(".einvoiceImg>.barcode").init();

  //popup modal to select coupon
  $(".cardSec").eq(1).click(function () {
    $("#shops").modal("show");
    $(this).animate({
      opacity: 1
    }, 100);
  });

  //a scanning animation
  setInterval(function () {
    $(".scannerImg").animate({
      "top": "0"
    }, 1500).animate({
      "top": "100vh"
    }, 1500);
  }, 3000);

  //load all coupons
  var cnt = 0;
  str = `<div class="row">`;
  coupons.forEach(function (o) {
    let disable = false;
    if (!!o[6]) {
      disable = true;
      let pswd = o[6];
      if (url.indexOf(pswd) != -1)
        disable = false;
      if (!!o[7]) {
        disable = true;
        let pswd = o[7];
        if (prompt("密語").indexOf(pswd) != -1)
          disable = false;
      }
    }
    if (!disable) {

      if (o[0] != "newline") {
        str += `
			<div class="StoreTag col-5 bg-white p-4 m-3 rounded mr-auto shadow-lg pull-left">
				<p class="color1 bold mr-auto pull-left">${o[0]}</p>
			</div>
				`;
      } else {
        cnt++;
        str += `
			</div>
			<div class="tabs hr" style="">
			  <span style="" class="ml-5">${o[1]}</span>
			</div>
			<div class="row">
				`;
      }
    }
  });
  str += `</div>`;
  $("#shops .modal-body").append(str);

  $("#shops .StoreTag").click(function () {
    let str = $(this).html();
    coupons.forEach(function (o) {
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
        if (!!o[4]) {
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

  //no usable coupon found
  if (cnt == 0)
    $("#shops .modal-body").append("一張都沒有");
});
