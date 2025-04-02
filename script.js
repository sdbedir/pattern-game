const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
let matchedShapes = 0;

shapes.forEach(shape => {
    shape.addEventListener('touchstart', dragStart);
    shape.addEventListener('touchend', dragEnd);
    shape.addEventListener('touchmove', dragMove);
    shape.addEventListener('mousedown', dragStart);
    shape.addEventListener('mouseup', dragEnd);
    shape.addEventListener('mousemove', dragMove);
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('touchenter', dragEnter);
    dropzone.addEventListener('touchleave', dragLeave);
    dropzone.addEventListener('touchmove', dragOver);
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('dragenter', dragEnter);
    dropzone.addEventListener('dragleave', dragLeave);
    dropzone.addEventListener('drop', drop);
});

let activeShape = null;

function dragStart(e) {
    e.preventDefault();
    const target = e.target;
    activeShape = target;
    target.style.zIndex = 1000;
    target.classList.add('dragging');
}

function dragMove(e) {
    if (!activeShape) return;
    const touch = e.touches ? e.touches[0] : e; // Dokunmatik cihazlar için
    const x = touch.clientX;
    const y = touch.clientY;

    activeShape.style.left = `${x - activeShape.offsetWidth / 2}px`;
    activeShape.style.top = `${y - activeShape.offsetHeight / 2}px`;
}

function dragEnd(e) {
    if (!activeShape) return;
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target && target.classList.contains('dropzone') && target.getAttribute('data-color') === activeShape.classList.contains('green') ? 'green' : 'orange') {
        target.style.backgroundColor = activeShape.classList.contains('green') ? 'green' : 'orange';
        target.classList.add('filled');
        matchedShapes++;
        checkWin();
    }

    activeShape.classList.remove('dragging');
    activeShape = null;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const targetColor = e.target.getAttribute('data-color');
    const draggedColor = activeShape.classList.contains('green') ? 'green' : 'orange';

    if (targetColor === draggedColor && !e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = draggedColor === 'green' ? 'green' : 'orange';
        matchedShapes++;
        checkWin();
    }
}

function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
    }
}
