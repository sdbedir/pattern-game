const shapesContainer = document.querySelector('.shapes-container');
const patternContainer = document.querySelector('.pattern-container');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const chooseMessage = document.getElementById('chooseMessage');
const errorSound = document.getElementById('errorSound');

let matchedShapes = 0;
let gameStarted = false;
let firstColor = ''; 

function selectColor(color) {
    firstColor = color;
    gameStarted = true;
    chooseMessage.style.display = 'none';
    resetGame();
}

function resetGame() {
    shapesContainer.innerHTML = '';
    patternContainer.innerHTML = '';
    matchedShapes = 0;
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    // Dairelerin sol tarafa sıralanması (Yeşil Yeşil Yeşil Turuncu Turuncu Turuncu)
    const shapeColors = ['green', 'green', 'green', 'orange', 'orange', 'orange'];
    shapeColors.forEach(color => {
        const shape = document.createElement('div');
        shape.classList.add('shape', color);
        shape.setAttribute('draggable', 'true');
        shape.addEventListener('dragstart', dragStart);
        shape.addEventListener('dragend', dragEnd);
        shapesContainer.appendChild(shape);
    });

    // Dropzone sıralaması (Oyuncu seçimine göre örüntü)
    let patternOrder = firstColor === 'orange' 
        ? ['orange', 'green', 'orange', 'green', 'orange', 'green']
        : ['green', 'orange', 'green', 'orange', 'green', 'orange'];

    patternOrder.forEach(color => {
        const dropzone = document.createElement('div');
        dropzone.classList.add('dropzone');
        dropzone.setAttribute('data-color', color);
        dropzone.addEventListener('dragover', dragOver);
        dropzone.addEventListener('dragenter', dragEnter);
        dropzone.addEventListener('dragleave', dragLeave);
        dropzone.addEventListener('drop', drop);
        patternContainer.appendChild(dropzone);
    });
}

function dragStart(e) {
    if (!gameStarted) return;
    e.dataTransfer.setData('color', e.target.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => e.target.classList.add('hidden'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('hidden');
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

// En soldaki boş alanı bulan fonksiyon
function getLeftmostUnfilledDropzone() {
    return [...document.querySelectorAll('.dropzone')].find(zone => !zone.classList.contains('filled'));
}

function drop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('color');
    const targetColor = e.target.getAttribute('data-color');
    const leftmostZone = getLeftmostUnfilledDropzone();

    // Eğer en soldaki boş dropzone'a yerleştirmiyorsa hata ver
    if (e.target !== leftmostZone) {
        playErrorSound();
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.style.display = 'none', 1000);
        return;
    }

    if (color === targetColor) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color;
        matchedShapes++;
        checkWin();
    } else {
        playErrorSound();
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.style.display = 'none', 1000);
    }
}

function playErrorSound() {
    errorSound.play();
}

function checkWin() {
    if (matchedShapes === 6) {
        successMessage.style.display = 'block';
    }
}
