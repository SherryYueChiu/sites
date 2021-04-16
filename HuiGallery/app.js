$sections = document.querySelectorAll("section");
$prev = document.querySelector("#prevOne");
$next = document.querySelector("#nextOne");

timer = null;
nowIndex = 0;
piecesAmount = 14;

function switchPieces(i = 0) {
  if (i >= piecesAmount) {
    nowIndex = piecesAmount - 1;
    return;
  }
  else if (i < 0) {
    nowIndex = 0;
    return;
  }
  console.log(`第${i}張`);
  $sections.forEach(section => {
    section.style.display = "none";
  });
  nowIndex = i;
  $sections[i].style.display = "block";
  autoSkip();
}

function autoSkip() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log("自動切換");
    switchPieces(++nowIndex);
  }, 20000);
}

function switchPrev() {
  switchPieces(--nowIndex);
}

function switchNext() {
  switchPieces(++nowIndex);
}

$prev.addEventListener("click", () => {
  switchPrev();
});

$next.addEventListener("click", () => {
  switchNext();
});

document.body.addEventListener("keyup", (e) => {
  if (e.key == "ArrowLeft")
    switchPrev();
  else if (e.key == "ArrowRight")
    switchNext();
});

function init() {
  switchPieces(0);
  autoSkip();
}

init();