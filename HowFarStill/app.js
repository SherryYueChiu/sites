//variables
var watcher; //Listening GeoLocation
var wakeLock = null; //screen wake
var start = { lat: 0, lng: 0 };
var target = { lat: 0, lng: 0 };
var totalDistance = 0;
var distanceColor = [
    "#FDE8E9",
    "#E3BAC6",
    "#BC9EC1",
    "#596475",
    "#1F2232"
]
var data_storedPlaces = "";

//DOMs
startTrackingDistance = document.getElementById("startTrackingDistance");
targetGeo = document.getElementById("targetGeo");
distanceDisplay = document.getElementById("distanceDisplay");
menuBtn = document.getElementById("menuBtn");
pauseBtn = document.getElementById("pauseBtn");
selectPlaceStored = document.getElementById("selectPlaceStored");
nowGeo = document.getElementById("nowGeo");

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

function calcDistance() {
    lat1 = start.lat;
    lon1 = start.lng;
    lat2 = target.lat;
    lon2 = target.lng;
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function screenWake() {
    try {
        wakeLock = navigator.wakeLock.request('screen');
    } catch (err) {}
    //for reacquire
    document.addEventListener('visibilitychange', async() => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    });
}

function distanceText(distance) {
    if (distance > 10) return ">10km";
    else if (distance > 5) return ">5km";
    else if (distance > 2) return ">2km";
    else if (distance > 1) return ">1km";
    else if (distance > 0.5) return ">500m";
    else if (distance > 0.2) return ">200m";
    else return "即將抵達";
}

function isGeolocationAvailable() {
    if ("geolocation" in navigator) {
        return true;
    } else {
        return false;
    }
}

//test: 24.1814342, 120.5888504
function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat, lng;
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        start.lat = lat;
        start.lng = lng;
        if (lat == 0 && lng == 0) {
            nowGeo.innerHTML = "請開啟GPS";
        }
        totalDistance = calcDistance();
    });
}

function startTrackingMyLocation() {
    navigator.geolocation.clearWatch(watcher);
    watcher = navigator.geolocation.watchPosition(function(position) {
        let lat, lng;
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        start.lat = lat;
        start.lng = lng;
        nowGeo.innerHTML = `${lat.toFixed(7)},${lng.toFixed(7)}`;
        startTrackingDisTance();
    });
}

function startTrackingDisTance() {
    distanceLeft = calcDistance();
    colorLevel = Math.round((distanceColor.length - 1) * (calcDistance() / totalDistance));
    roundDistanceDisplay.innerHTML = `${distanceText(distanceLeft)} `;
    distanceDisplay.innerHTML = `(${distanceLeft.toFixed(1)} Km)`;
    document.body.style.background = distanceColor[colorLevel];
}

function initStoredPlaces() {
    data_storedPlaces = localStorage.getItem("places");
    listDOM = document.querySelector("#selectPlaceStored ul");
    list = data_storedPlaces.trim().split(/[\r\n]+/);
    listDOM.innerHTML = "";
    list.forEach((cur, i, arr) => {
        //隔行存
        if (i % 2 != 0) {
            geo = cur;
            place = arr[i - 1];
            listDOM.innerHTML += `<li geo="${geo}">${place}</li>`;
        }
    });
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.body.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

//events
startTrackingDistance.addEventListener("click", () => {
    if (isGeolocationAvailable()) {
        if (targetGeo.value) {
            if (targetGeo.value.match(/[\d.]+, *[\d.]+/)) {
                //format string: lat, lng
                let regex = targetGeo.value.match(/([\d.]+), *([\d.]+)/);
                target.lat = 1 * regex[1];
                target.lng = 1 * regex[2];
                getCurrentPosition();
                startTrackingMyLocation();
                //toggle buttons
                startTrackingDistance.style.display = "none";
                menuBtn.style.display = "none";
                pauseBtn.style.display = "block";
            } else if (targetGeo.getAttribute("realGeo").match(/[\d.]+, *[\d.]+/)) {
                //format string: lat, lng
                let regex = targetGeo.getAttribute("realGeo").match(/([\d.]+), *([\d.]+)/);
                target.lat = 1 * regex[1];
                target.lng = 1 * regex[2];
                getCurrentPosition();
                startTrackingMyLocation();
                //toggle buttons
                startTrackingDistance.style.display = "none";
                menuBtn.style.display = "none";
                pauseBtn.style.display = "block";
            } else {
                alert("請輸入正確的格式：經度, 緯度");
            }
        } else {
            alert("請輸入目的地");
        }
    } else {
        alert("GPS未啟用");
    }
});

document.querySelector(".container").addEventListener("click", () => {
    toggleFullScreen();
});

//pause button
pauseBtn.addEventListener("click", () => {
    if (confirm("確定要結束？")) {
        history.go(0);
    }
});

//menu button
menuBtn.addEventListener("click", async() => {
    //bind events
    document.querySelectorAll("#selectPlaceStored li").forEach((element) => {
        element.addEventListener("click", (event) => {
            targetGeo.setAttribute("realGeo", element.getAttribute("geo"));
            targetGeo.value = element.innerHTML.replace(/<.+> ?/g, "");
            document.querySelector("#selectPlaceStored .dismiss").click();
        });
    });
    selectPlaceStored.style.display = "block";
});

//in selectPlaceStored
document.querySelector("#selectPlaceStored .add").addEventListener("click", () => {
    storePlaceModal.style.display = "block";
});

document.querySelector("#selectPlaceStored .dismiss").addEventListener("click", () => {
    selectPlaceStored.style.display = "none";
});

//in storePlaceModal
document.querySelector("#storePlaceModal .confirm").addEventListener("click", async() => {
    localStorage.setItem("places", document.querySelector("#inputPlaces").value.trim());
    storePlaceModal.style.display = "none";
    await initStoredPlaces();
    //bind events
    document.querySelectorAll("#selectPlaceStored li").forEach((element) => {
        element.addEventListener("click", (event) => {
            targetGeo.setAttribute("realGeo", element.getAttribute("geo"));
            targetGeo.value = element.innerHTML.replace(/<.+> ?/g, "");
            document.querySelector("#selectPlaceStored .dismiss").click();
        });
    });
});

document.querySelector("#storePlaceModal .cancel").addEventListener("click", () => {
    document.querySelector("#inputPlaces").value = localStorage.getItem("places");
    storePlaceModal.style.display = "none";
});

async function onInit() {
    data_storedPlaces = localStorage.getItem("places").trim();
    document.querySelector("#inputPlaces").value = data_storedPlaces;
    await initStoredPlaces();
    //bind events
    document.querySelectorAll("#selectPlaceStored li").forEach((element) => {
        element.addEventListener("click", (event) => {
            targetGeo.setAttribute("realGeo", element.getAttribute("geo"));
            targetGeo.value = element.innerHTML.replace(/<.+> ?/g, "");
            document.querySelector("#selectPlaceStored .dismiss").click();
        });
    });
    //update current position
    watcher = navigator.geolocation.watchPosition(function(position) {
        let lat, lng;
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        start.lat = lat;
        start.lng = lng;
        nowGeo.innerHTML = `${lat.toFixed(7)},${lng.toFixed(7)}`;
    });
    screenWake();
}

onInit();