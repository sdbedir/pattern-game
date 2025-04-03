const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
let placedShapes = [];

// Add event listeners to shapes
shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);
});

// Add event listeners to dropzones
dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
});

function dragStart(e) {
    e.dataTransfer.setData('color', e.target.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => e.target.classList.add('hidden'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('hidden');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('color');
    const targetColor = e.target.getAttribute('data-color');

    if (!e.target.classList.contains('filled') && color === targetColor) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color;
        placedShapes.push(color);
        checkWin();
    }
}

function checkWin() {
    if (placedShapes.length === dropzones.length) {
        const pattern1 = ['orange', 'green', 'orange', 'green', 'orange', 'green'];
        const pattern2 = ['green', 'orange', 'green', 'orange', 'green', 'orange'];

        if (JSON.stringify(placedShapes) === JSON.stringify(pattern1) || JSON.stringify(placedShapes) === JSON.stringify(pattern2)) {
            successMessage.style.display = 'block';
        }
    }
}
