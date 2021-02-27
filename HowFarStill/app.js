var watcher; //Listening GeoLocation
var start = { lat: 0, lng: 0 };
var target = { lat: 0, lng: 0 };
var totalDistance = 0;
var distanceColor = [
    "#E8837E",
    "#EFB28C",
    "#EED19C",
    "#ACBA9D",
    "#749D9B",
    "#3E6B7E",
    "#00314F"
]

startTrackingDistance = document.getElementById("startTrackingDistance");
targetGeo = document.getElementById("targetGeo");
distanceDisplay = document.getElementById("distanceDisplay");

function distanceText(distance) {
    if (distance > 10) return ">10Km";
    else if (distance > 5) return ">5Km";
    else if (distance > 2) return ">2Km";
    else if (distance > 1) return ">1Km";
    else if (distance > 0.5) return ">500m";
    else if (distance > 0.2) return ">200m";
    else if return "即將抵達";
}

function isGeolocationAvailable() {
    if ("geolocation" in navigator) {
        return true;
    } else {
        return false;
    }
}

//24.1814342, 120.5888504
function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let lat, lng;
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        start.lat = lat;
        start.lng = lng;
        totalDistance = calcDisTance();
        console.log(`Now at: ${start.lat}, ${start.lng}`);
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
        startTrackingDisTance();
        console.log(`Now at: ${start.lat}, ${start.lng}`);
    });
}

function startTrackingDisTance() {
    distanceLeft = calcDisTance();
    colorLevel = Math.round((distanceColor.length - 1) * (calcDisTance() / totalDistance));
    roundDistanceDisplay.innerHTML = `${distanceText(distanceLeft)} `;
    distanceDisplay.innerHTML = `(${distanceLeft.toFixed(1)} Km)`;
    document.body.style.background = distanceColor[colorLevel];
}

function calcDisTance() {
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

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}

startTrackingDistance.addEventListener("click", () => {
    if (isGeolocationAvailable()) {
        if (targetGeo.value) {
            let tmp = targetGeo.value.split(",");
            target.lat = 1 * tmp[0];
            target.lng = 1 * tmp[1];
            getCurrentPosition();
            startTrackingMyLocation();
        } else {
            alert("未輸入目的地");
        }
    } else {
        alert("GPS未啟用");
    }
});