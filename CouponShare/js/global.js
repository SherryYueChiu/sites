editBox = document.querySelector("#mdInput");
noteSec = document.querySelector("#noteSec");

function PaintCode(format, value) {
    console.log(format, value)
        //show picture file directly
        //file name -> Img Html
    if (format == "IMG") {
        return `
<img src="./cardsImg/${value}">`;
    }

    //paint QRCode
    //param -> SVG Obj -> SVG Html
    else if (format.search(/QR/i) != -1) {
        return QRCode.generateSVG(value, {
            ecclevel: format.charAt(format.search(/[L|M|Q|H]$/i)).toUpperCase() || "H",
            modulesize: 1
        }).outerHTML;
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
    html = html.replace(/:::CODE[ ]*?:([^\r\n]*);([^\r\n]*):::/gi, function(match, p1, p2, offset, string) {
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
    text = editBox.value;
    html = customMdMod(text);
    html = converter.makeHtml(html);
    noteSec.innerHTML = html;
    JsBarcode(".barcode").init();
}