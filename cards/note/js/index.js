function customMdMod(html){
html = html.replace(/:::success<br \/>([\s\S]*):::<\/p>/gi,'<div class="alert alert-success">$1</div>');
html = html.replace(/:::info<br \/>([\s\S]*):::<\/p>/gi,'<div class="alert alert-info">$1</div>');
html = html.replace(/:::warning<br \/>([\s\S]*):::<\/p>/gi,'<div class="alert alert-warning">$1</div>');
html = html.replace(/:::danger<br \/>([\s\S]*):::<\/p>/gi,'<div class="alert alert-danger">$1</div>');
html = html.replace(/:::spoiler([\s\S]+):::/gi,'<details><summary>[摺疊]</summary>$1</details>');
return html;
}

$(function() {

    storedMd = "";
    $('#mdIpt').val(localStorage.getItem("storedMd3"));
    convert();

    $('#mdIpt').on('input propertychange', convert);
    timer = setInterval(function() {
        if (storedMd != $("#mdIpt").val()) {
            storedMd = $("#mdIpt").val();
            localStorage.setItem("storedMd3", storedMd);
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