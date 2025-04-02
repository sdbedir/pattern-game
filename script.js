document.addEventListener("DOMContentLoaded", () => {
    const shapes = document.querySelectorAll(".shape");
    const dropzones = document.querySelectorAll(".dropzone");
    const successMessage = document.getElementById("successMessage");
    const resetButton = document.getElementById("resetButton");
    const errorSound = document.getElementById("errorSound");
    
    let draggedElement = null;
    let matchedShapes = 0;

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
            const targetColor = targetDropzone.getAttribute("data-color");

            if (draggedColor === targetColor) {
                targetDropzone.classList.add("filled");
                targetDropzone.style.backgroundColor = draggedColor;
                draggedElement.style.display = "none";
                matchedShapes++;

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
