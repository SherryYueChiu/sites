  cnt = $(".button_hilite").length;
  //json = `[`;
  json = "";

  for (i = 0; i < cnt; i++) {

    //課碼
    code = $(".button_hilite").eq(i).html().trim();

    //課名
    if ($("[data-title=課程名稱]").eq(i).html().indexOf("strike") == -1) {
      name = $("[data-title=課程名稱]>a").eq(i).html().trim();
    } else {
      //已停開
      continue;
    }

    //時間地點
    timeroom = $("[data-title=時間地點]").eq(i).html().trim();
    if (timeroom.indexOf("星期") != -1) {
      room = timeroom.split("[")[1]?.replace("]", "") || "";
      time = timeroom.split("[")[0]?.replace("星期", "")?.split(/[,|\/]/) || "";
      time = `["${time?.join('","')}"]`
    } else {
      //無公佈時間地點
      continue;
    }

    json += `{
          "code": "${code}",
          "name": "${name}",
          "room": "${room}",
          "time": ${time}
  },`;
  }json
  //json += `]`;
