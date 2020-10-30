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

cards = md2arr(cardsMd);
einvoice = md2arr(einvoiceMd);

//page and function all initialized
$(function () {

  //popup screenshot of that store
  function showSimulateBtn(img) {
    $("#simulateBtn").fadeIn(100).click(function () {
      $("#popupImg").attr("src", `./cardsImg/${img}`).fadeIn(100);
    });
  }

  //click everywhere to dismiss popup img
  $("#popupImg").click(function () {
    $(this).fadeOut(100);
  });

  //toggle show and hide for bar/QR code blocks
  $(".cardSec").click(function () {
    if ($(this).css("opacity") > 0.5) {
      $(this).animate({
        opacity: 0.3
      }, 100);
      $(this).find("img, svg").animate({
        opacity: 0
      }, 100);
    } else {
      $(this).animate({
        opacity: 1
      }, 100);
      $(this).find("img, svg").animate({
        opacity: 1
      }, 100);
    }
  });

  //popup modal to select einvoice code
  $("#einvoiceImg").click(function () {
    $("#einvoice").modal("show");
    $(this).animate({
      opacity: 1
    }, 100);
    $(this).find("img").animate({
      opacity: 1
    }, 100);
  });

  //popup modal to select store member code
  $("#memberImg").click(function () {
    $("#cards").modal("show");
    $(this).animate({
      opacity: 1
    }, 100);
    $(this).find("img").animate({
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

  //load all einvoices
  einvoice.forEach(function (o) {
    $("#einvoice ul").append(`<li class="list-group-item">${o[0]}</li>`);
    $("#einvoice ul>li").click(function () {
      let str = $(this).html();
      einvoice.forEach(function (o) {
        if (str.indexOf(o[0]) != -1) {
          $("#einvoice").modal("hide");
          $("#einvoiceName").eq(0).html(o[0]);
          $("#einvoiceImg").html(PaintCode(o[1], o[2]));
          JsBarcode("#einvoiceImg>.barcode").init();

        }
      });
    });
  });

  //load all member cards
  //parse array to html
  str = `<div class="row">`;
  cards.forEach(function (o) {
    if (o[0] != "newline") {
      str += `
		<div class="StoreTag col-5 bg-white p-4 m-3 rounded mr-auto shadow-lg pull-left">
			<p class="color1 bold mr-auto pull-left">${o[0]}</p>
		</div>
            `;
    } else {
      str += `
        </div>
        <div class="tabs hr" style="">
          <span style="" class="ml-5">${o[1]}</span>
        </div>
        <div class="row">
            `;
    }
  });
  str += `</div>`;
  $("#cards .modal-body").append(str);
  
  //bind clicking event
  $("#cards .StoreTag").click(function () {
    let str = $(this).html();
    cards.forEach(function (o) {
      if (str.indexOf(o[0]) != -1) {
        $("#cards").modal("hide");
        $("#member").html(o[0]);
        $("#memberImg").html(PaintCode(o[1], o[2]));
        JsBarcode("#memberImg>.barcode").init();
        if (o[3] && o[3].indexOf("simulate") != -1) {
          showSimulateBtn(o[3].split("::")[1]);
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
  timer = setInterval(function () {
    if (storedMd != $("#mdIpt").val()) {
      storedMd = $("#mdIpt").val();
      localStorage.setItem("storedMd2", storedMd);
    }
  }, 2000);
  JsBarcode(".barcode").init();

});
