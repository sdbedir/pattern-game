const draggables = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');
const errorSound = document.getElementById('errorSound');
const startGreenButton = document.getElementById('startGreen');
const startOrangeButton = document.getElementById('startOrange');

let pattern = [];
let firstColorChosen = null;
let placedItems = new Array(6).fill(null);

// Oyuncu bir renk seçmeden oyun başlamasın
function resetGame() {
    pattern = [];
    firstColorChosen = null;
    placedItems.fill(null);
    dropzones.forEach(dropzone => {
        dropzone.style.backgroundColor = "#f9f9f9";
        dropzone.classList.remove("correct", "incorrect");
    });
}

// Oyuncu bir renkle başlasın ve örüntü o sırayla devam etsin
function determinePattern(startColor) {
    pattern = [];
    for (let i = 0; i < 6; i++) {
        pattern.push(i % 2 === 0 ? startColor : startColor === "green" ? "orange" : "green");
    }
}

startGreenButton.addEventListener("click", () => {
    resetGame();
    firstColorChosen = "green";
    determinePattern(firstColorChosen);
});

startOrangeButton.addEventListener("click", () => {
    resetGame();
    firstColorChosen = "orange";
    determinePattern(firstColorChosen);
});

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', (e) => {
        if (!firstColorChosen) {
            alert("Önce bir renkle başlamalısınız!");
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('color', e.target.getAttribute('data-color'));
    });
});

dropzones.forEach((dropzone, index) => {
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        const color = e.dataTransfer.getData('color');

        if (placedItems[index]) return; // Eğer alan doluysa işlem yapma

        if (color === pattern[index]) {
            dropzone.style.backgroundColor = color;
            dropzone.classList.add('correct');
            placedItems[index] = color;
            checkCompletion();
        } else {
            dropzone.classList.add('incorrect');
            errorSound.play();
            setTimeout(() => dropzone.classList.remove('incorrect'), 1000);
        }
    });
});

function checkCompletion() {
    if (placedItems.every((color, i) => color === pattern[i])) {
        setTimeout(() => alert("Tebrikler! Örüntüyü doğru yerleştirdiniz."), 500);
    }
}
