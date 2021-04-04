var busTimeTable = [],
  busStopTable = [];
var popTextTimer, popTextTimes = 50;
var serverAddr = "sherryyue2.azurewebsites.net/THUBus/";
var curTime, selectRoute, recentBusTime, nextBusTime;

function pad(n, width, z = '0') {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(function () {

  //公車到站時間推估
  function busTrackUpdate() {
    const curTime = new Date();
    const curTimeHHMM = `${curTime.getHours()}:${pad(curTime.getMinutes(), 2)}`;
    $("#clock").html(curTimeHHMM.toString());
    //追蹤前十分鐘到現在的發車
    const recentBusTime = busTimeTable.find(function (o) {
      return new Date(o).getTime() >= curTime.getTime() - 10 * 60000;
    });
    const nextBusTime = busTimeTable.find(function (o) {
      return new Date(o).getTime() > recentBusTime.getTime();
    });

    $("#busTimeline>.busStop").each(function () {
      let stopName = $(this).attr("stopid");
      let html = "";
      let timeOffset = 0;
      if (stopName.indexOf("科技大樓（ST）") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 0;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 8 * 60000;
      } else if (stopName.indexOf("語文館（Lan）") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 1 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 7 * 60000;
      } else if (stopName.indexOf("教堂") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 1 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 7 * 60000;
      } else if (stopName.indexOf("女紙宿舍（一校）") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 3 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 5 * 60000;
      } else if (stopName.indexOf("男紙宿舍15棟") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 3 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 5 * 60000;
      } else if (stopName.indexOf("乳品小棧") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 4 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 4 * 60000;
      } else if (stopName.indexOf("亞特蘭提斯城") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 6 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 2 * 60000;
      } else if (stopName.indexOf("娚紙宿舍（二校）") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 7 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 1 * 60000;
      } else if (stopName.indexOf("管院（M）") != -1) {
        if (selectRoute == "1" || selectRoute == "4")
          timeOffset = 8 * 60000;
        else if (selectRoute == "2" || selectRoute == "3")
          timeOffset = 0;
      }
      //假日路線（往二校）
      if (selectRoute == "4") {
        timeOffset -= 60000;
      }
      if (recentBusTime.getTime() + timeOffset >= curTime.getTime() - 1 * 60000) {
        //5分鐘內到站
        if (recentBusTime.getTime() + timeOffset <= curTime.getTime() + 4 * 60000) {
          html += `
<a href="#" class="badge badge-warning">
5分鐘內到站
				</a>`;
        } else {
          //最近一班車
          let time1 = new Date(recentBusTime.getTime() + timeOffset);
          html += `
<a href="#" class="badge badge-success">
${pad(time1.getHours(), 2)}:${pad(time1.getMinutes(), 2)}
</a>`;
        }
      }
      if (nextBusTime) {
        //下一班車
        let time2 = new Date(nextBusTime.getTime() + timeOffset);
        html += `
<a href="#" class="badge badge-success">
${pad(time2.getHours(), 2)}:${pad(time2.getMinutes(), 2)}
</a>`;
      }
      $(this).find("h5").html(html);
    });
  }

  //轉譯站名
  function getStopName(stopName) {
    if (stopName.indexOf("科技大樓") != -1) {
      return "科技大樓（ST）";
    } else if (stopName.indexOf("語文館北側") != -1) {
      return "語文館（Lan）";
    } else if (stopName.indexOf("教堂") != -1) {
      return "教堂";
    } else if (stopName.indexOf("陽光草坪") != -1) {
      return "女紙宿舍（一校）";
    } else if (stopName.indexOf("男舍15棟") != -1) {
      return "男紙宿舍15棟";
    } else if (stopName.indexOf("乳品小棧") != -1) {
      return "乳品小棧";
    } else if (stopName.indexOf("東海湖") != -1) {
      return "亞特蘭提斯城";
    } else if (stopName.indexOf("第二教學區學生宿舍") != -1) {
      return "娚紙宿舍（二校）";
    } else if (stopName.indexOf("管院") != -1) {
      return "管院（M）";
    }
    return "？";
  }

  function showRoute(route) {
    selectRoute = route;
    let url = `https://linebot.cc.paas.ithu.tw/v6/pages/cc_util_busroute_server.php?routeid=${route}`;
    $.get(`https://ziting.hostingerapp.com/readPage.php?URL=${url}`, function (data) {
      if (data.indexOf("不行駛") == -1) {
        $("#busRoute").html(data);
        //讀出時間表
        $("#busRoute>div:first>table td").each(function () {
          const timeHHMM = $(this).html().split(":");
          const dt = new Date();
          const time = new Date(`${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()} ${timeHHMM[0]}:${timeHHMM[1]}:00`);
          busTimeTable.push(time);
        });
        //讀出時間表
        $("#busRoute>div:last>div>div").each(function () {
          busStopTable.push($(this).html());
        });
        let html = "";
        busStopTable.forEach(function (o) {
          if (o) {
            let stopName = getStopName(o);
            html += `
<div stopid="${stopName}" class="tag busStop bg-white p-4 mt-5 mb-5 rounded-lg mx-auto shadow-lg w-75">
	<h3 class="color1">${stopName}</h3>
	<h5>--</h5>
</div>`;
          }
        });
        $("#busTimeline").addClass("main-timeline").append(html);
      } else {
        //本路線今日停駛
        popTextTimer = setInterval(function () {
          popTextTimes--;
          if (popTextTimes >= 0) {
            $("body").append(`
<div style="position:fixed; left: ${Math.random() * 100}VW;top: ${Math.random() * 100}VH;">	
	<span style="font-size: ${Math.random() * 3}em">它今天不發車</span>
</div>					
						`);
          } else {
            clearInterval(popTextTimer);
          }
        }, 800);
      }
    });
  }

  //送出
  $("#page1Submit").click(function () {
    $("#page1").fadeOut(200);
    $("#page2").fadeIn(200);
    showRoute($("#chooseRoute").val());
  });

  function init() {
    setInterval(function () {
      //背景掃碼動畫
      $(".scannerImg").animate({
        "top": "0"
      }, 1500).animate({
        "top": "100vh"
      }, 1500);
    }, 3000);
    setInterval(function () {
      //公車動態更新
      busTrackUpdate();
    }, 5000);
  }

  init();
});

//register service worker
navigator.serviceWorker.register('service-worker.js', { scope: "." });