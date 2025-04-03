const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const resetButton = document.getElementById('resetButton');
let placedShapes = [];

shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);
});

dropzones.forEach((dropzone, index) => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
    dropzone.dataset.index = index;
});

resetButton.addEventListener('click', resetGame);

function dragStart(e) {
    e.dataTransfer.setData('color', e.target.dataset.color);
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
    const index = e.target.dataset.index;

    if (!e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color;
        placedShapes[index] = color;
        checkWin();
    }
}

function checkWin() {
    const pattern1 = ['orange', 'green', 'orange', 'green', 'orange', 'green'];
    const pattern2 = ['green', 'orange', 'green', 'orange', 'green', 'orange'];

    if (placedShapes.length === dropzones.length) {
        if (JSON.stringify(placedShapes) === JSON.stringify(pattern1) || JSON.stringify(placedShapes) === JSON.stringify(pattern2)) {
            successMessage.style.display = 'block';
        }
    }
}

function resetGame() {
    placedShapes = [];
    successMessage.style.display = 'none';
    dropzones.forEach(dropzone => {
        dropzone.classList.remove('filled');
        dropzone.style.backgroundColor = '';
    });
    shapes.forEach(shape => shape.classList.remove('hidden'));
}
