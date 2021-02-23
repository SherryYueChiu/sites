var classCnt = $(".button_hilite").length;
var json = "";

for (i = 0; i < classCnt; i++) {
    var ccode = "",
        cname = "",
        croom = "",
        ctime = "";

    ccode = $(".button_hilite").eq(i).html().trim(); //課碼

    //課名
    if ($("[data-title=課程名稱]").eq(i).html().indexOf("strike") == -1) {
        nacnameme = $("[data-title=課程名稱]>a").eq(i).html().trim();
    } else {
        //已停開
        continue;
    }

    //時間地點
    timeroom = $("[data-title=時間地點]").eq(i).html().trim();
    if (timeroom.indexOf("星期") != -1) {
        croom = timeroom.split("[")[1] ? .replace("]", "") || "";
        ctime = timeroom.split("[")[0] ? .replace("星期", "") ? .split(/[,|\/]/) || "";
        ctime = `["${ctime?.join('","')}"]`
    } else {
        //無公佈時間地點
        continue;
    }

    json += `{
          "code": "${ccode}",
          "name": "${cname}",
          "room": "${croom}",
          "time": ${ctime}
  },`;
}
console.log(json);