$(function() {

    storedMd = "";
    $('#mdIpt').val(localStorage.getItem("storedMd1"));
    convert();

    $('#mdIpt').on('input propertychange', convert);
    timer = setInterval(function() {
        if (storedMd != $("#mdIpt").val()) {
            storedMd = $("#mdIpt").val();
            localStorage.setItem("storedMd1", storedMd);
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