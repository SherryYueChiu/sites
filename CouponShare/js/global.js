function PaintCode(format, value) {
  console.log(format, value)
  //show picture file directly
  //file name -> Img Html
  if (format == "IMG") {
    return `
<img src="./couponsImg/${value}">`;
  }

  //paint QRCode
  //param -> SVG Obj -> SVG Html
  else if (format.search(/QR/i) != -1) {
    return $(QRCode.generateSVG(value, {
        ecclevel: format.charAt(format.search(/[L|M|Q|H]$/i)).toUpperCase() || "H",
        modulesize: 1
      }))[0].outerHTML;
  }

  //paint BarCode
  //param -> SVG Html
  else {
    return `<svg class="barcode"
    jsbarcode-height="100"
    jsbarcode-format="${format}"
    jsbarcode-value="${value}"
    jsbarcode-displayvalue="false">
    </svg>`;
  }
}

function customMdMod(html) {
  html = html.replace(/:::success[ ]*?:([^\r\n]*):::/gi, '<div class="alert alert-success">$1</div>');
  html = html.replace(/:::info[ ]*?:([^\r\n]*):::/gi, '<div class="alert alert-info">$1</div>');
  html = html.replace(/:::warning[ ]*?:([^\r\n]*):::/gi, '<div class="alert alert-warning">$1</div>');
  html = html.replace(/:::danger[ ]*?:([^\r\n]*):::/gi, '<div class="alert alert-danger">$1</div>');
  html = html.replace(/:::CODE[ ]*?:([^\r\n]*);([^\r\n]*):::/gi, function (match, p1, p2, offset, string) {
    p1 = p1.trim();
    p2 = p2.trim();
    return PaintCode(p1, p2);
  });
  return html;
}
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
  html = customMdMod(text);
  html = converter.makeHtml(html);
  $("#htmlOpt").html(html);
  JsBarcode("#htmlOpt .barcode").init();
}
