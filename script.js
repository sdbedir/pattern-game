const draggables = document.querySelectorAll(".draggable");
const slots = document.querySelectorAll(".slot");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");

let placedColors = Array(6).fill(null);

draggables.forEach(item => {
  item.addEventListener("dragstart", dragStart);
});

slots.forEach(slot => {
  slot.addEventListener("dragover", dragOver);
  slot.addEventListener("drop", drop);
});

function dragStart(e) {
  e.dataTransfer.setData("color", e.target.dataset.color);
  e.dataTransfer.setData("id", e.target.id);
  setTimeout(() => {
    e.target.style.opacity = "0.3";
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (e.target.classList.contains("slot") && e.target.childNodes.length === 0) {
    const color = e.dataTransfer.getData("color");
    const newCircle = document.createElement("div");
    newCircle.className = `draggable ${color}`;
    newCircle.setAttribute("data-color", color);
    newCircle.setAttribute("draggable", "false");
    e.target.appendChild(newCircle);

    const index = parseInt(e.target.dataset.index);
    placedColors[index] = color;

    checkPattern();
  }
}

function checkPattern() {
  if (placedColors.every(c => c !== null)) {
    const pattern1 = ["orange", "green", "orange", "green", "orange", "green"];
    const pattern2 = ["green", "orange", "green", "orange", "green", "orange"];

    if (
      JSON.stringify(placedColors) === JSON.stringify(pattern1) ||
      JSON.stringify(placedColors) === JSON.stringify(pattern2)
    ) {
      message.classList.remove("hidden");
    }
  }
}

resetBtn.addEventListener("click", () => {
  placedColors = Array(6).fill(null);
  message.classList.add("hidden");

  slots.forEach(slot => (slot.innerHTML = ""));

  // Sayfayı yenilemeden draggable'ları resetlemek:
  const source = document.querySelector(".source");
  source.innerHTML = `
    <div class="draggable orange" draggable="true" data-color="orange"></div>
    <div class="draggable orange" draggable="true" data-color="orange"></div>
    <div class="draggable orange" draggable="true" data-color="orange"></div>
    <div class="draggable green" draggable="true" data-color="green"></div>
    <div class="draggable green" draggable="true" data-color="green"></div>
    <div class="draggable green" draggable="true" data-color="green"></div>
  `;

  // Yeni eklenen elementlere event ekle
  document.querySelectorAll(".draggable").forEach(item => {
    item.addEventListener("dragstart", dragStart);
  });
});
