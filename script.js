document.addEventListener("DOMContentLoaded", () => {
    const shapes = document.querySelectorAll(".shape");
    const dropzones = document.querySelectorAll(".dropzone");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");
    const resetButton = document.getElementById("resetButton");
    const errorSound = document.getElementById("errorSound");

    let draggedElement = null;
    let matchedShapes = 0;
    let patternIndex = 0;
    let patternOrder = [];

    // Başlangıç rengi seçme işlemi
    function selectColor(color) {
        if (color === "orange") {
            patternOrder = ["orange", "green", "orange", "green", "orange", "green"];
        } else {
            patternOrder = ["green", "orange", "green", "orange", "green", "orange"];
        }

        // Başlangıç mesajını gizle
        document.getElementById("chooseMessage").style.display = "none";
        resetGame();
    }

    // Oyun sıfırlama fonksiyonu
    function resetGame() {
        matchedShapes = 0;
        patternIndex = 0;
        dropzones.forEach(zone => {
            zone.classList.remove("filled");
            zone.style.backgroundColor = "transparent";
        });
        shapes.forEach(shape => {
            shape.style.display = "block";
            shape.style.position = "relative";
        });
    }

    // Şekilleri yerleştirme işlemi
    shapes.forEach(shape => {
        shape.addEventListener("dragstart", dragStart);
        shape.addEventListener("dragend", dragEnd);
        shape.addEventListener("touchstart", touchStart, { passive: false });
        shape.addEventListener("touchmove", touchMove, { passive: false });
        shape.addEventListener("touchend", touchEnd);
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener("dragover", dragOver);
        dropzone.addEventListener("drop", drop);
    });

    function dragStart(e) {
        draggedElement = e.target;
        e.dataTransfer.setData("color", draggedElement.classList.contains("green") ? "green" : "orange");
        setTimeout(() => draggedElement.style.visibility = "hidden", 0);
    }

    function dragEnd() {
        if (draggedElement) {
            draggedElement.style.visibility = "visible";
        }
    }

    function touchStart(e) {
        draggedElement = e.target;
        draggedElement.style.opacity = "0.5";
    }

    function touchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        draggedElement.style.position = "fixed";
        draggedElement.style.left = `${touch.clientX - 40}px`;
        draggedElement.style.top = `${touch.clientY - 40}px`;
    }

    function touchEnd(e) {
        const touch = e.changedTouches[0];
        let dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

        if (dropTarget && dropTarget.classList.contains("dropzone")) {
            drop({ preventDefault: () => {} }, dropTarget);
        }

        draggedElement.style.opacity = "1";
        draggedElement.style.position = "static";
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e, target = null) {
        e.preventDefault();
        const draggedColor = draggedElement.classList.contains("green") ? "green" : "orange";
        const targetDropzone = target || e.target;

        if (targetDropzone.classList.contains("dropzone") && !targetDropzone.classList.contains("filled")) {
            const expectedColor = patternOrder[patternIndex];

            if (draggedColor === expectedColor) {
                targetDropzone.classList.add("filled");
                targetDropzone.style.backgroundColor = draggedColor;
                draggedElement.style.display = "none";
                matchedShapes++;
                patternIndex++;

                if (matchedShapes === dropzones.length) {
                    successMessage.style.display = "block";
                    resetButton.style.display = "block";
                }
            } else {
                errorSound.play();
                draggedElement.style.display = "block";
            }
        }
    }

    resetButton.addEventListener("click", () => {
        location.reload();
    });
});
