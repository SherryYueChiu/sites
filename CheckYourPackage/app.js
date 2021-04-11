lastUpdateBlock = document.querySelector("#lastUpdateBlock");
container = document.querySelector("#packageContainer");
packagesBlock = document.querySelectorAll(".packages");

function showPackages() {
    //to package array
    packages = packages.trim().split(/[\r\n]{2,}/);

    //to package-attribute array
    packages = packages.map(package => package.split(/[\r\n]+/));
    packages.map(package => {
        package.map(attribute => {
            if (attribute.indexOf("From:") != -1) {
                package.from = attribute.substr(5);
            } else if (attribute.indexOf("To:") != -1) {
                package.to = attribute.substr(3);
            } else if (attribute.indexOf("Room:") != -1) {
                package.room = attribute.substr(5);
            } else if (attribute.indexOf("Color:") != -1) {
                package.color = attribute.substr(6);
            }
            return attribute;
        });
        return package;
    });

    //show DOM
    packages.forEach(o => {
        const html = `
<div class="package">
    ${o.to ? "<span class='to'>" + o.to + "</span>" : ""}
    ${o.from ? "<span class='from'>" + o.from + "</span>" : ""}
    ${o.room ? "<span class='room'>" + o.room + "</span>" : ""}
    ${o.color ? "<span class='color'>" + o.color + "</span>" : ""}
</div>
    `;
        container.insertAdjacentHTML("beforeend", html);
    });
}
window.onload = function () {
    lastUpdateBlock.innerHTML = lastUpdate;
    showPackages();
};

//register service worker
navigator.serviceWorker.register('service-worker.js', { scope: "." });