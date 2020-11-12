/*
DOMs
*/
let einvoiceBtn = document.querySelector("#eInvoiceCode");
let cardBtn = document.querySelector("#cardCode");
let sections = document.querySelectorAll(".sec");
let editSec = document.querySelector("#editSec");
let editBox = document.querySelector("#mdInput");
let noteSec = document.querySelector("#noteSec");
let einvoiceModal = document.querySelector("#einvoiceModal");
let cardModal = document.querySelector("#cardModal");
let closeBtns = document.querySelectorAll(".close");
let popupImg = document.querySelector("#popupImg");
let simulateBtn = document.querySelector("#simulateBtn");
let eInvoiceName = document.querySelector("#eInvoiceName");
let eInvoiceCode = document.querySelector("#eInvoiceCode");
let cardName = document.querySelector("#cardName");
let cardCode = document.querySelector("#cardCode");

/*
DOM events
*/
editBtn.addEventListener("click", () => {
    //toggle show
    if (editSec.classList.contains("fade")) {
        editSec.classList.remove("fade");
    }
    //toggle hide
    else {
        editSec.classList.add("fade");
    }
});

sections.forEach((section) => {
    section.addEventListener("click", () => {
        //toggle show
        if (section.classList.contains("opacity")) {
            section.classList.remove("opacity");
            try {
                section.querySelector(".drawnCode").classList.remove("hide");
            } catch (e) {}
        }
        //toggle hide
        else {
            section.classList.add("opacity");
            try {
                section.querySelector(".drawnCode").classList.add("hide");
            } catch (e) {}
        }
    });
});

//popup einvoice modal
einvoiceBtn.addEventListener("click", (e) => {
    einvoiceModal.classList.remove("fade");
});

//popup card modal
cardBtn.addEventListener("click", (e) => {
    cardModal.classList.remove("fade");
});

//click to dismiss fullpage image
popupImg.addEventListener("click", (e) => {
    popupImg.classList.add("fade");
});

//"x" button for dismiss modal
closeBtns.forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
        target = closeBtn.getAttribute("target");
        document.querySelector(target).classList.add("fade");
    });
});

//translate Markdown text to 2-dim test array
function md2arr(md) {
    let line = [],
        pattern = [];
    line = md.split(/[\r\n]+/);
    line.forEach(function(o) {
        pattern.push(o.split(/\s+/));
    });

    let arr = [];
    pattern.forEach(function(o) {
        if (o[0] != "" || !o) {
            //see store classification as newline
            if (o[0] == "##") {
                arr.push(["newline", o[1]]);
            }
            //stores
            if (o[0] == "###") {
                arr.push([o[1]]);
            }
            //push store params
            if (o[0] == "-") {
                arr[arr.length - 1].push(o[1]);
            }
        }
    });
    return arr;
}

//popup picture of that store
function showSimulateBtn(img) {
    simulateBtn.addEventListener("click", () => {
        popupImg.setAttribute("src", `./cardsImg/${img}`);
        popupImg.classList.remove("fade");
    });
}


/*
page loaded
*/
window.onload = function() {

    const cards = md2arr(cardsMd);
    const einvoices = md2arr(einvoiceMd);

    /*
    put einvoices to DOM
    */
    var str = `<ul>`;
    einvoices.forEach(function(einvoice) {
        str += `<li class="list-group-item">${einvoice[0]}</li>`;
    });
    str += `</ul>`;
    document.querySelector("#einvoiceModal>.modal-body").innerHTML = str;
    //bind event
    agent = document.querySelectorAll("#einvoiceModal ul>li");
    agent.forEach((which) => {
        which.addEventListener("click", () => {
            let str = which.innerHTML;
            einvoices.forEach(function(einvoice) {
                if (str.indexOf(einvoice[0]) != -1) {
                    einvoiceModal.classList.add("fade");
                    eInvoiceName.innerHTML = einvoice[0];
                    eInvoiceCode.innerHTML = PaintCode(einvoice[1], einvoice[2]);
                    JsBarcode(".barcode").init();

                }
            });
            if (einvoiceSec.classList.contains("opacity")) {
                einvoiceSec.classList.remove("opacity");
                try {
                    einvoiceSec.querySelector(".drawnCode").classList.remove("hide");
                } catch (e) {}
            }
        });
    });

    /*
    put cards to DOM
    */
    str = `
    `;
    cards.forEach(function(o, i) {
        if (o[0] != "newline") {
            str += `
    <div class="StoreTag"><span>${o[0]}</span></div>
                  `;
        } else {
            if (i != 0) {
                str += `
</details>
                `;
            }
            str += `
<details>
    <summary>${o[1]}</summary>
            `;
        }
    });
    document.querySelector("#cardModal>.modal-body").innerHTML = str;

    /*
    bind event
    */
    storeTags = document.querySelectorAll("#cardModal .StoreTag");
    storeTags.forEach((storeTag) => {
        storeTag.addEventListener("click", () => {
            let str = storeTag.innerHTML;
            cards.forEach(function(o) {
                if (str.indexOf(o[0]) != -1) {
                    cardModal.classList.add("fade");
                    cardName.innerHTML = o[0];
                    cardCode.innerHTML = PaintCode(o[1], o[2]);
                    JsBarcode(".barcode").init();
                    if (o[3] && o[3].indexOf("simulate") != -1) {
                        simulateBtn.classList.remove("fade");
                        showSimulateBtn(o[3].split("::")[1]);
                    } else {
                        simulateBtn.classList.add("fade");
                    }
                }
            });
            if (cardSec.classList.contains("opacity")) {
                cardSec.classList.remove("opacity");
                try {
                    cardSec.querySelector(".drawnCode").classList.remove("hide");
                } catch (e) {}
            }
        })
    });

    /*
    a editable and autosave markdown notebook
    */
    storedMd = "";
    editBox.value = localStorage.getItem("storedMd");
    convert();

    editBox.addEventListener('change', convert);
    timer = setInterval(function() {
        if (storedMd != editBox.value) {
            storedMd = editBox.value;
            localStorage.setItem("storedMd", storedMd);
        }
    }, 2000);
};