nowTime = new Date();

function getPicUri(StuID) {
    Day = nowTime.getDay();
	DayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][Day];
	Date = nowTime.getDate();
	Month = nowTime.getMonth();
	MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Month];
	Year = nowTime.getFullYear();
	Hour = nowTime.getHours();
	Minute = nowTime.getMinutes();
	Second = nowTime.getSeconds();
	formatDate = `00:${DayName}, ${Date} ${MonthName} ${Year} ${Hour}:${Minute}:${Second} +0800`;
	encryptedKey = btoa(`${formatDate}-${StuID}`);
	uri = `http:\/\/fsis.thu.edu.tw/wwwstud/spicview.php?spic_id=${encryptedKey}`;
	return uri;
}
$(function () {
	$("#sendReq").click(function () {
		uri = getPicUri($("#StuID").val().toUpperCase());
		$("#StuPhoto").html(`<img src="${uri}"/>`);
	});

});