document.addEventListener("DOMContentLoaded", () => {
    const shapesContainer = document.getElementById("shapesContainer");
    const dropzoneContainer = document.getElementById("dropzoneContainer");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restartButton");
    const errorSound = document.getElementById("errorSound");

    let selectedColor = "";
    let correctPattern = [];
    let placedShapes = 0;

    // Başlangıç butonuna tıklama fonksiyonu
    function startGame(color) {
        selectedColor = color;
        correctPattern = selectedColor === "orange"
            ? ["orange", "green", "orange", "green", "orange", "green"]
            : ["green", "orange", "green", "orange", "green", "orange"];

        shapesContainer.innerHTML = "";
        dropzoneContainer.innerHTML = "";
        message.textContent = "";
        restartButton.style.display = "none";
        placedShapes = 0;

        // Şekilleri oluştur ve sola yerleştir
        const initialPattern = ["orange", "orange", "orange", "green", "green", "green"];
        initialPattern.forEach(color => {
            const shape = createShape(color);
            shapesContainer.appendChild(shape);
        });

        // Boş alanları oluştur ve sağa yerleştir
        correctPattern.forEach(() => {
            const dropzone = createDropzone();
            dropzoneContainer.appendChild(dropzone);
        });
    }

    // Şekil oluşturma
    function createShape(color) {
        const shape = document.createElement("div");
        shape.classList.add("shape", color);
        shape.draggable = true;

        shape.addEventListener("dragstart", dragStart);
        shape.addEventListener("dragend", dragEnd);

        return shape;
    }

    // Boş alan oluşturma
    function createDropzone() {
        const dropzone = document.createElement("div");
        dropzone.classList.add("dropzone");

        dropzone.addEventListener("dragover", dragOver);
        dropzone.addEventListener("drop", drop);

        return dropzone;
    }

    // Drag işlemi başladığında
    function dragStart(e) {
        e.dataTransfer.setData("color", e.target.classList.contains("orange") ? "orange" : "green");
        e.target.style.opacity = "0.4";  // Görsel ipucu
    }

    // Drag işlemi bitince
    function dragEnd(e) {
        e.target.style.opacity = "1";
    }

    // Boş alanda sürükle bırakan şekil üzerine gelindiğinde
    function dragOver(e) {
        e.preventDefault();
    }

    // Şekil bırakma işlemi
    function drop(e) {
        e.preventDefault();
        const color = e.dataTransfer.getData("color");

        if (color === correctPattern[placedShapes] && !e.target.classList.contains("filled")) {
            e.target.classList.add("filled", color);
            placedShapes++;

            // Doğru yerleştirilen şekli soldan sil
            shapesContainer.removeChild(shapesContainer.children[0]);

            // Örüntü tamamlandığında mesaj göster
            if (placedShapes === correctPattern.length) {
                message.textContent = "Tebrikler! Örüntüyü doğru tamamladınız!";
                restartButton.style.display = "block";
            }
        } else {
            errorSound.play();
        }
    }

    // Yeniden başlatma fonksiyonu
    function restartGame() {
        startGame(selectedColor);
    }

    window.startGame = startGame;
    window.restartGame = restartGame;
});
