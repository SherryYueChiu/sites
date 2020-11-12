/*
DOMs
*/
let einvoiceBtn = document.querySelector("#eInvoiceCode");
let cardBtn = document.querySelector("#cardCode");
let sections = document.querySelectorAll(".sec");
let noteSec = document.querySelector("#noteSec");
let einvoiceModal = document.querySelector("#einvoiceModal");
let cardModal = document.querySelector("#cardModal");
let closeBtns = document.querySelectorAll(".close");
let eInvoiceName = document.querySelector("#eInvoiceName");
let eInvoiceCode = document.querySelector("#eInvoiceCode");
let cardName = document.querySelector("#cardName");
let cardDescription = document.querySelector("#cardDescription");
let cardCode = document.querySelector("#cardCode");
let cardCode2 = document.querySelector("#cardCode2");
let aboutBtn = document.querySelector("#aboutBtn");

/*
DOM events
*/
aboutBtn.addEventListener("click", () => {
    //href to author's projects page
    window.open('https://hackmd.io/@sherryyue/ByUr2wkBD');
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
        pattern.push([
            o.substring(0, o.search(" ")),
            o.substring(o.search(" ") + 1)
        ]);
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

/*
page loaded
*/
window.onload = function() {

    const coupons = md2arr(couponsMd);
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
    put coupons to DOM
    */
    str = `
    `;
    coupons.forEach(function(o, i) {
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
<details ${i == 0 ? "open" : ""}>
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
            disable = false;
            str = storeTag.innerHTML;
            coupons.forEach(function(o) {
                if (str.indexOf(o[0]) != -1) {
                    //request password
                    let disable = false;
                    if (!!o[7] && o[7] != "") {
                        disable = true;
                        let pswd = o[7];
                        if (prompt("密語").indexOf(pswd) != -1)
                            disable = false;
                        console.log("o7 test: " + o[1]);
                    }
                    if (!disable) {
                        let str = storeTag.innerHTML;
                        coupons.forEach(function(o) {
                            if (str.indexOf(o[0]) != -1) {
                                cardModal.classList.add("fade");
                                cardName.innerHTML = o[0];
                                cardDescription.innerHTML = o[1];
                                cardCode.innerHTML = PaintCode(o[2], o[3]);
                                cardCode2.classList.add("nodisplay");
                                if (!!o[4]) {
                                    cardCode2.innerHTML = PaintCode(o[4], o[5]);
                                    cardCode2.classList.remove("nodisplay");
                                }
                                JsBarcode(".barcode").init();
                            }
                        });
                        if (cardSec.classList.contains("opacity")) {
                            cardSec.classList.remove("opacity");
                            try {
                                cardSec.querySelector(".drawnCode").classList.remove("hide");
                            } catch (e) {}
                        }

                    } else {
                        alert("密語是錯的");
                    }
                }
            });
        });
    });

    JsBarcode(".barcode").init();
};