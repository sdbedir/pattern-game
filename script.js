const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const resetButton = document.getElementById('resetButton');

let matchedShapes = 0;

shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('color', e.target.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => e.target.style.display = 'none', 0);
}

function dragEnd(e) {
    e.target.style.display = 'block';
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedColor = e.dataTransfer.getData('color');
    const targetColor = e.target.getAttribute('data-color');

    if (draggedColor === targetColor && !e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = draggedColor;
        matchedShapes++;

        if (matchedShapes === dropzones.length) {
            successMessage.style.display = 'block';
            resetButton.style.display = 'block';
        }
    } else {
        document.querySelector('.shape[style*="display: none"]').style.display = 'block';
    }
}

resetButton.addEventListener('click', () => {
    location.reload();
});

