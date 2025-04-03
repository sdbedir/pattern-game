const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const chooseMessage = document.getElementById('chooseMessage');
const errorSound = document.getElementById('errorSound');
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
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('dragenter', dragEnter);
    dropzone.addEventListener('dragleave', dragLeave);
    dropzone.addEventListener('drop', drop);
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
        shape.style.cursor = 'grab'; // Sürüklenebilir
    });
    initializeShapesOrder();
}

function initializeShapesOrder() {
    const shapeOrder = firstColor === 'orange' ? ['orange', 'green', 'orange', 'green', 'orange', 'green'] : ['green', 'orange', 'green', 'orange', 'green', 'orange'];

    for (let i = 0; i < shapes.length; i++) {
        shapes[i].classList.remove('green', 'orange');
        shapes[i].classList.add(shapeOrder[i]);
    }
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
        playErrorSound();
        resetShape(currentShape);
    }
}

function playErrorSound() {
    errorSound.play();
}

function resetShape(shape) {
    setTimeout(() => {
        shape.style.display = 'block'; // Şekli tekrar göster
        shape.style.position = 'initial';
    }, 1000); // 1 saniye sonra geri gelmesi için
}

function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
    }
}
