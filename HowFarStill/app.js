//variables
watcher = null; //Listening GeoLocation
fromLocation = { lat: 0, lng: 0 };
targetLocation = { lat: 0, lng: 0 };
totalDistance = 0;
distanceColor = [
    "#FDE8E9",
    "#E3BAC6",
    "#BC9EC1",
    "#596475",
    "#1F2232"
]
data_storedPlaces = "";
isTracking = false;

//DOMs
$root = document.getElementsByTagName('html')[0];
$startTrackingDistance = document.getElementById("startTrackingDistance");
$targetGeo = document.getElementById("targetGeo");
$distanceDisplay = document.getElementById("distanceDisplay");
$menuBtn = document.getElementById("menuBtn");
$pauseBtn = document.getElementById("pauseBtn");
$selectPlaceStored = document.getElementById("selectPlaceStored");
$nowGeo = document.getElementById("nowGeo");

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

function calcDistance() {
    let lat1 = fromLocation.lat;
    let lon1 = fromLocation.lng;
    let lat2 = targetLocation.lat;
    let lon2 = targetLocation.lng;
    const R = 6371; // km
    dLat = toRad(lat2 - lat1);
    dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
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

function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fromLocation.lat = lat;
        fromLocation.lng = lng;
        if (!lat && !lng) {
            $nowGeo.innerHTML = "請開啟GPS";
        }
        totalDistance = calcDistance();
    });
}

function startTrackingMyLocation() {
    navigator.geolocation.clearWatch(watcher);
    watcher = navigator.geolocation.watchPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fromLocation.lat = lat;
        fromLocation.lng = lng;
        $nowGeo.innerHTML = `${lat.toFixed(7)},${lng.toFixed(7)}`;
        startTrackingDistance();
    });
}

function startTrackingDistance() {
    distanceLeft = calcDistance();
    colorLevel = Math.round((distanceColor.length - 1) * (calcDistance() / totalDistance));
    roundDistanceDisplay.innerHTML = `${distanceText(distanceLeft)} `;
    if (distanceLeft > 1) {
        $distanceDisplay.innerHTML = `(${distanceLeft.toFixed(1)} km)`;
    } else {
        $distanceDisplay.innerHTML = `(${(1000 * distanceLeft).toFixed(0)} m)`;
    }
    document.body.style.background = distanceColor[colorLevel];
    $root.style.background = distanceColor[colorLevel];
}

function initStoredPlaces() {
    data_storedPlaces = localStorage.getItem("places");
    if(!data_storedPlaces)  return;
    listDOM = document.querySelector("#selectPlaceStored ul");
    list = data_storedPlaces.trim().split(/[\r\n]+/);
    listDOM.innerHTML = "";
    list.forEach((cur, i, arr) => {
        //隔行存
        if (i % 2 != 0) {
            const geo = cur;
            const place = arr[i - 1];
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

//bind events
$startTrackingDistance.addEventListener("click", () => {
	isTracking = true;
    if (isGeolocationAvailable()) {
        if ($targetGeo.value) {
            if ($targetGeo.value.match(/[\d.]+, *[\d.]+/)) {
                //format string: lat, lng
                const regex = $targetGeo.value.match(/([\d.]+), *([\d.]+)/);
                targetLocation.lat = 1 * regex[1];
                targetLocation.lng = 1 * regex[2];
                getCurrentPosition();
                startTrackingMyLocation();
                //toggle buttons
                $startTrackingDistance.style.display = "none";
                $menuBtn.style.display = "none";
                $pauseBtn.style.display = "block";
                localStorage.setItem("targetLocation", $targetGeo.getAttribute("realGeo"));
                localStorage.setItem("targetGeo", `${targetLocation.lat}, ${targetLocation.lng}`);
            } else if ($targetGeo.getAttribute("realGeo")?.match(/[\d.]+, *[\d.]+/)) {
                //format string: lat, lng
                const regex = $targetGeo.getAttribute("realGeo").match(/([\d.]+), *([\d.]+)/);
                targetLocation.lat = 1 * regex[1];
                targetLocation.lng = 1 * regex[2];
                getCurrentPosition();
                startTrackingMyLocation();
                //toggle buttons
                $startTrackingDistance.style.display = "none";
                $menuBtn.style.display = "none";
                $pauseBtn.style.display = "block";
                localStorage.setItem("targetLocation", $targetGeo.value);
                localStorage.setItem("targetGeo", `${targetLocation.lat}, ${targetLocation.lng}`);
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

//save location here
$nowGeo.addEventListener("click", () => {
    if(!confirm("把這裡存起來"))    return;
    let here = `\n臨時點\n${$nowGeo.innerHTML}`;
    localStorage.setItem("places", (localStorage.getItem("places") ?? "") + here);
});

//direct to Google map when click coordunate of target
$targetGeo.addEventListener("click", () => {
    if(isTracking) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${targetLocation.lat.toFixed(7)},${targetLocation.lng.toFixed(7)}`);
    }
});

//pause button
$pauseBtn.addEventListener("click", () => {
    if (confirm("確定要結束？")) {
		isTracking = false;
        localStorage.setItem("targetLocation", "");
        localStorage.setItem("targetGeo", "");
        history.go(0);
    }
});

//menu button
$menuBtn.addEventListener("click", async() => {
    //bind events
    document.querySelectorAll("#selectPlaceStored li").forEach((element) => {
        element.addEventListener("click", (event) => {
            $targetGeo.setAttribute("realGeo", element.getAttribute("geo"));
            $targetGeo.value = element.innerHTML.replace(/<.+> ?/g, "");
            document.querySelector("#selectPlaceStored .dismiss").click();
        });
    });
    $selectPlaceStored.style.display = "block";
});

//in selectPlaceStored
document.querySelector("#selectPlaceStored .add").addEventListener("click", () => {
    storePlaceModal.style.display = "block";
});

document.querySelector("#selectPlaceStored .dismiss").addEventListener("click", () => {
    $selectPlaceStored.style.display = "none";
});

//in storePlaceModal
document.querySelector("#storePlaceModal .confirm").addEventListener("click", async() => {
    localStorage.setItem("places", document.querySelector("#inputPlaces").value.trim()??"");
    storePlaceModal.style.display = "none";
    await initStoredPlaces();
    //bind events
    document.querySelectorAll("#selectPlaceStored li").forEach((element) => {
        element.addEventListener("click", (event) => {
            $targetGeo.setAttribute("realGeo", element.getAttribute("geo"));
            $targetGeo.value = element.innerHTML.replace(/<.+> ?/g, "");
            document.querySelector("#selectPlaceStored .dismiss").click();
        });
    });
});

document.querySelector("#storePlaceModal .cancel").addEventListener("click", () => {
    document.querySelector("#inputPlaces").value = localStorage.getItem("places")??"";
    storePlaceModal.style.display = "none";
});

async function onInit() {
    data_storedPlaces = localStorage.getItem("places")?.trim();
    document.querySelector("#inputPlaces").value = data_storedPlaces??"";
    await initStoredPlaces();
    //restore previous state
    if(!!localStorage.getItem("targetGeo")){
        let storedLocation = {};
        [storedLocation.lat, storedLocation.lng] = localStorage.getItem("targetGeo").split(",");
        $targetGeo.value =  localStorage.getItem("targetLocation");
        $targetGeo.setAttribute("realGeo", `${storedLocation.lat}, ${storedLocation.lng}`);
        $startTrackingDistance.click();
    }
    //bind events
    document.querySelectorAll("#selectPlaceStored li").forEach((element) => {
        element.addEventListener("click", (event) => {
            $targetGeo.setAttribute("realGeo", element.getAttribute("geo"));
            $targetGeo.value = element.innerHTML.replace(/<.+> ?/g, "");
            document.querySelector("#selectPlaceStored .dismiss").click();
        });
    });
    //update current position
    watcher = navigator.geolocation.watchPosition(function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        fromLocation.lat = lat;
        fromLocation.lng = lng;
        $nowGeo.innerHTML = `${lat.toFixed(7)},${lng.toFixed(7)}`;
    });
}

onInit();

//register service worker
navigator.serviceWorker.register('service-worker.js',{ scope: "."});