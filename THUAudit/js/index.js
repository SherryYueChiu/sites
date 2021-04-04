var classPool;
var date = new Date();
var weekDayWord = ["天", "一", "二", "三", "四", "五", "六"];
var textPool = {
    greetingMsg: `<h3 class="color1">今天是星期#1 </h3><h5>來看看今天可以旁聽點什麼嘛？</h5>`

}

//顯示篩選後課程列表
function showClass() {
    classPool.forEach(function (o) {

        //插入課程泡泡
        let html = `
<div class="tag bg-dark p-3 mt-3 mb-3 rounded-lg mx-auto shadow-lg w-75">
	<span><h4 class="color4" style="overflow-x: auto;">${o.name}</h4></span>
	<hr class="style-one">
	<span><h5 class="color5">第${o.time.join("、")}節</h5></span>
	`;

        o.room.split(",").forEach(function (o2) {
            html += `
		<span class="badge bgColor2 rounded-lg pl-2 pr-2 pb-0" style="border-radius: 10px; color: #333;"><h6>${o2}</h6></span>
	`;
        });

        html += `
	<h6 class="classCode"><a class="color2" href="https://course.thu.edu.tw/view/109/2/${o.code}" target="_blank">${o.code}</a></h6>
</div>`;

        $("#classList").append(html);
    });
}

function classFilter(day, time) {
    //過濾掉不在當天的課
    classPool = classPool.filter(function (o) {
        let result = true;
        //辨識二校教學區
        if ($("#chooseAceptRegion").val() == "2") {
            let t = o.room.search(/^(FA|M|MU|PG)\d+$/) != -1;
            result = (result == t);
        }
        if ($("#chooseAceptRegion").val() == "1") {
            let t = o.room.search(/^(FA|M|MU|PG)\d+$/) == -1;
            result = (result == t);
        }
        return (o.time.indexOf(weekDayWord[day]) != -1) && result;
    });

    //截取每門課當天上哪幾節
    classPool = classPool.filter(function (o) {
        let lBound = 0,
            rBound = o.time.length - 1;
        let foundDay = false;
        o.time.forEach(function (o2, i) {
            if (!foundDay) {
                if (o2 == weekDayWord[day]) {
                    lBound = i;
                    foundDay = true;
                }
            } else {
                if (o2.charCodeAt() > 1000)
                    rBound = i - 1;
            }
        });
        let ClassTimeOfToday = o.time.slice(lBound + 1, rBound + 1);
        o.time = ClassTimeOfToday;
        return ClassTimeOfToday.indexOf(time) != -1;
    });
    //用課程名稱首字排序
    classPool = classPool.sort(function (a, b) {
        let result = false;
        let AMinusB = a.name.charCodeAt() - b.name.charCodeAt();
        //中文字優先在前
        if (Math.abs(AMinusB) > 512)
            result |= AMinusB < 0 ? true : false; //中文字對上英文字
        else
            result |= AMinusB > 0 ? true : false;
        return result ? 1 : -1;
    });

    //顯示篩選結果
    showClass();
}

$(function () {

    //送出選擇
    $("#page1Submit").click(function () {
        $("#page1").fadeOut(200);
        $("#page2").fadeIn(200);
        classFilter($("#chooseDay").val(), $("#chooseAceptTime").val());
    });

    function init() {
        //讀取所有課程
        $.get("./js/allClass.js", function (json) {
            classPool = $.parseJSON(json);
        });

        //取得今天星期幾
        $("#greetingMsg").html(textPool.greetingMsg.replace("#1 ", weekDayWord[date.getDay()]));
        $("#chooseDay").find(`option[value=${date.getDay()}]`).prop("selected", "selected");
    }

    init();
});

//register service worker
navigator.serviceWorker.register('service-worker.js', { scope: "." });