const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const errorSound = document.getElementById('errorSound');

let userPattern = [];
let correctPattern = [];
let firstShape = null;

// Şekilleri rastgele yerleştirme
shapes.forEach((shape, index) => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
});

function dragStart(e) {
    const color = e.target.dataset.color;
    if (!firstShape) {
        firstShape = color;
        correctPattern = firstShape === 'green' ? ['green', 'orange', 'green', 'orange', 'green', 'orange'] : ['orange', 'green', 'orange', 'green', 'orange', 'green'];
    }
    e.dataTransfer.setData('color', color);
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
    const dropzoneIndex = Array.from(dropzones).indexOf(e.target);

    if (dropzoneIndex !== -1 && !e.target.hasChildNodes()) {
        if (color === correctPattern[userPattern.length]) {
            userPattern.push(color);
            e.target.style.backgroundColor = color;
        } else {
            errorSound.play();
            shapes.forEach(shape => {
                if (shape.dataset.color === color) {
                    shape.classList.remove('hidden');
                }
            });
        }
    }

    if (userPattern.length === correctPattern.length) {
        successMessage.style.display = 'block';
    }
}
