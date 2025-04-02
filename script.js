const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
let matchedShapes = 0;
let pattern = [];
let currentShape = null;

shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);

    shape.addEventListener('touchstart', touchStart);
    shape.addEventListener('touchend', touchEnd);
    shape.addEventListener('touchmove', touchMove);
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('dragenter', dragEnter);
    dropzone.addEventListener('dragleave', dragLeave);
    dropzone.addEventListener('drop', drop);

    dropzone.addEventListener('touchenter', touchEnter);
    dropzone.addEventListener('touchleave', touchLeave);
    dropzone.addEventListener('touchmove', touchMoveOnDropzone);
});

function dragStart(e) {
    currentShape = e.target; // Store the current dragged shape
    e.dataTransfer.setData('text/plain', e.target.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => e.target.classList.add('hidden'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('hidden');
    currentShape = null; // Reset the current shape after drag ends
}

function touchStart(e) {
    e.preventDefault();
    currentShape = e.target;
    const touch = e.touches[0]; // Get the first touch point
    currentShape.style.position = 'absolute';
    document.body.appendChild(currentShape); // Append to body to make it draggable

    currentShape.style.left = `${touch.pageX - currentShape.offsetWidth / 2}px`;
    currentShape.style.top = `${touch.pageY - currentShape.offsetHeight / 2}px`;
}

function touchEnd(e) {
    e.preventDefault();
    checkDrop(e); // Check if the shape was dropped in the correct zone
    currentShape = null;
}

function touchMove(e) {
    if (!currentShape) return;
    const touch = e.touches[0];
    currentShape.style.left = `${touch.pageX - currentShape.offsetWidth / 2}px`;
    currentShape.style.top = `${touch.pageY - currentShape.offsetHeight / 2}px`;
}

function touchEnter(e) {
    e.preventDefault();
    e.target.classList.add('hover');
}

function touchLeave(e) {
    e.preventDefault();
    e.target.classList.remove('hover');
}

function touchMoveOnDropzone(e) {
    e.preventDefault();
}

function checkDrop(e) {
    const color = currentShape.classList.contains('green') ? 'green' : 'orange';
    dropzones.forEach(dropzone => {
        const rect = dropzone.getBoundingClientRect();
        const touch = e.changedTouches[0]; // Get the touch end point

        if (
            touch.pageX > rect.left &&
            touch.pageX < rect.right &&
            touch.pageY > rect.top &&
            touch.pageY < rect.bottom
        ) {
            // If the shape is within dropzone
            const targetColor = dropzone.getAttribute('data-color');
            if (color === targetColor && !dropzone.classList.contains('filled')) {
                dropzone.classList.add('filled');
                dropzone.style.backgroundColor = color;
                matchedShapes++;
                checkWin();
                currentShape.style.display = 'none'; // Hide the shape after placement
            }
        }
    });
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('hover');
}

function dragLeave(e) {
    e.target.classList.remove('hover');
}

function drop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('text/plain');
    const targetColor = e.target.getAttribute('data-color');

    if (color === targetColor && !e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color === 'green' ? 'green' : 'orange';
        matchedShapes++;
        checkWin();
        e.target.appendChild(currentShape); // Move the shape to the dropzone
        currentShape.style.display = 'none'; // Hide the shape after placement
    }
}

function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
        dropzones.forEach(zone => zone.classList.add('bounce'));
    }
}
