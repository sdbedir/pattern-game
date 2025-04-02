const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const chooseMessage = document.getElementById('chooseMessage');
let matchedShapes = 0;
let pattern = [];
let currentShape = null;
let gameStarted = false;
let firstColor = ''; // 'green' or 'orange'

// Başlangıç rengi seçme işlemi
chooseMessage.style.display = 'block';

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

// Başlangıç rengi seçme işlemi
function selectColor(color) {
    firstColor = color;
    gameStarted = true;
    chooseMessage.style.display = 'none'; // Başlangıç rengi mesajını gizle
    resetGame();
}

function resetGame() {
    matchedShapes = 0;
    dropzones.forEach(zone => {
        zone.classList.remove('filled');
        zone.style.backgroundColor = 'transparent';
    });
    shapes.forEach(shape => {
        shape.style.display = 'block';
    });
}

// Drag and drop işlemleri
function dragStart(e) {
    if (!gameStarted) return;
    currentShape = e.target;
    e.dataTransfer.setData('text/plain', currentShape.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => currentShape.classList.add('hidden'), 0);
}

function dragEnd(e) {
    currentShape.classList.remove('hidden');
    currentShape = null;
}

function touchStart(e) {
    if (!gameStarted) return;
    e.preventDefault();
    currentShape = e.target;
    const touch = e.touches[0];
    currentShape.style.position = 'absolute';
    document.body.appendChild(currentShape);
    currentShape.style.left = `${touch.pageX - currentShape.offsetWidth / 2}px`;
    currentShape.style.top = `${touch.pageY - currentShape.offsetHeight / 2}px`;
}

function touchEnd(e) {
    e.preventDefault();
    checkDrop(e);
    currentShape = null;
}

function touchMove(e) {
    if (!currentShape) return;
    const touch = e.touches[0];
    currentShape.style.left = `${touch.pageX - currentShape.offsetWidth / 2}px`;
    currentShape.style.top = `${touch.pageY - currentShape.offsetHeight / 2}px`;
}

function checkDrop(e) {
    const color = currentShape.classList.contains('green') ? 'green' : 'orange';
    let dropped = false;
    dropzones.forEach(dropzone => {
        const rect = dropzone.getBoundingClientRect();
        const touch = e.changedTouches[0];

        if (
            touch.pageX > rect.left &&
            touch.pageX < rect.right &&
            touch.pageY > rect.top &&
            touch.pageY < rect.bottom
        ) {
            const targetColor = dropzone.getAttribute('data-color');
            if (color === targetColor && !dropzone.classList.contains('filled')) {
                dropzone.classList.add('filled');
                dropzone.style.backgroundColor = color;
                matchedShapes++;
                currentShape.style.display = 'none'; // Şekli gizle
                checkWin();
                dropped = true;
            }
        }
    });

    if (!dropped) {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 2000);
    }
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
        e.target.appendChild(currentShape);
        currentShape.style.display = 'none'; // Şekli gizle
    } else {
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 2000);
    }
}

function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
        dropzones.forEach(zone => zone.classList.add('bounce'));
    }
}

// Başlangıç rengi seçme işlemi
document.getElementById('orangeBtn').addEventListener('click', () => selectColor('orange'));
document.getElementById('greenBtn').addEventListener('click', () => selectColor('green'));
