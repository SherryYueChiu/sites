var watcher; //Listening GeoLocation
var global = { lat: 0, lng: 0 };
var target = { lat: 0, lng: 0 };

startTrackingDistance = document.getElementById("startTrackingDistance");
targetGeo = document.getElementById("targetGeo");
distanceDisplay = document.getElementById("distanceDisplay");

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
        global.lat = lat;
        global.lng = lng;
        console.log(`Now at: ${global.latitude}, ${global.longitude}`);
    });
}

function startTrackingMyLocation() {
    watcher = navigator.geolocation.watchPosition(function(position) {
        let lat, lng;
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        global.lat = lat;
        global.lng = lng;
        startTrackingDisTance();
        console.log(`Now at: ${global.latitude}, ${global.longitude}`);
    });
}

function startTrackingDisTance() {
    distanceDisplay.innerHTML = `${calcDisTance().toFixed(1)} Km`;
}

function calcDisTance() {
    lat1 = global.lat;
    lon1 = global.lng;
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