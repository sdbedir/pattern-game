document.addEventListener("DOMContentLoaded", () => {
    const shapesContainer = document.getElementById("shapesContainer");
    const dropzoneContainer = document.getElementById("dropzoneContainer");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restartButton");
    const errorSound = document.getElementById("errorSound");

    let selectedColor = "";
    let correctPattern = [];
    let placedShapes = 0;

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

    function createShape(color) {
        const shape = document.createElement("div");
        shape.classList.add("shape", color);
        shape.draggable = true;

        // Dokunmatik destek ekle
        shape.addEventListener("dragstart", dragStart);
        shape.addEventListener("touchstart", touchStart);
        shape.addEventListener("touchmove", touchMove);
        shape.addEventListener("touchend", touchEnd);

        return shape;
    }

    function createDropzone() {
        const dropzone = document.createElement("div");
        dropzone.classList.add("dropzone");

        dropzone.addEventListener("dragover", dragOver);
        dropzone.addEventListener("drop", drop);

        return dropzone;
    }

    function dragStart(e) {
        e.dataTransfer.setData("color", e.target.classList.contains("orange") ? "orange" : "green");
        e.target.classList.add("dragging");
    }

    function touchStart(e) {
        e.target.classList.add("dragging");
    }

    function touchMove(e) {
        const touch = e.touches[0];
        const shape = document.querySelector(".dragging");

        if (shape) {
            shape.style.position = "absolute";
            shape.style.left = touch.pageX - 30 + "px";
            shape.style.top = touch.pageY - 30 + "px";
        }
    }

    function touchEnd(e) {
        const shape = document.querySelector(".dragging");
        shape.style.position = "relative";
        shape.classList.remove("dragging");
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const color = e.dataTransfer.getData("color");

        if (color === correctPattern[placedShapes] && !e.target.classList.contains("filled")) {
            e.target.classList.add("filled", color);
            placedShapes++;

            // Doğru yerleştirilen şekli soldan sil
            shapesContainer.removeChild(shapesContainer.children[0]);

            if (placedShapes === correctPattern.length) {
                message.textContent = "Tebrikler! Örüntüyü doğru tamamladınız!";
                restartButton.style.display = "block";
            }
        } else {
            errorSound.play();
        }
    }

    function restartGame() {
        startGame(selectedColor);
    }

    window.startGame = startGame;
    window.restartGame = restartGame;
});
