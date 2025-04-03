document.addEventListener("DOMContentLoaded", () => {
    const shapesContainer = document.querySelector(".shapes-container");
    const dropzones = document.querySelectorAll(".dropzone");
    const successMessage = document.getElementById("successMessage");
    const resetButton = document.getElementById("resetButton");
    const errorSound = document.getElementById("errorSound");

    let draggedElement = null;
    let matchedShapes = 0;
    let patternIndex = 0;
    let patternOrder = [];
    let firstColor = "";

    function initializeGame(color) {
        firstColor = color;
        patternOrder = color === "orange" 
            ? ["orange", "green", "orange", "green", "orange", "green"] 
            : ["green", "orange", "green", "orange", "green", "orange"];
        document.getElementById("chooseMessage").style.display = "none";
        createShapes();
    }

    function createShapes() {
        shapesContainer.innerHTML = "";
        let shapeOrder = firstColor === "orange" 
            ? ["orange", "orange", "orange", "green", "green", "green"] 
            : ["green", "green", "green", "orange", "orange", "orange"];

        shapeOrder.forEach(color => {
            let shape = document.createElement("div");
            shape.classList.add("shape", color);
            shape.draggable = true;
            shape.addEventListener("dragstart", dragStart);
            shape.addEventListener("dragend", dragEnd);
            shape.addEventListener("touchstart", touchStart, { passive: false });
            shape.addEventListener("touchmove", touchMove, { passive: false });
            shape.addEventListener("touchend", touchEnd);
            shapesContainer.appendChild(shape);
        });
    }

    dropzones.forEach(dropzone => {
        dropzone.addEventListener("dragover", dragOver);
        dropzone.addEventListener("drop", drop);
    });

    function dragStart(e) {
        draggedElement = e.target;
        e.dataTransfer.setData("color", draggedElement.classList.contains("green") ? "green" : "orange");
        setTimeout(() => (draggedElement.style.visibility = "hidden"), 0);
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
                draggedElement.remove();
                matchedShapes++;
                patternIndex++;

                if (matchedShapes === dropzones.length) {
                    successMessage.style.display = "block";
                    resetButton.style.display = "block";
                }
            } else {
                errorSound.play();
            }
        }
    }

    resetButton.addEventListener("click", () => {
        location.reload();
    });

    document.getElementById("startOrange").addEventListener("click", () => initializeGame("orange"));
    document.getElementById("startGreen").addEventListener("click", () => initializeGame("green"));
});
