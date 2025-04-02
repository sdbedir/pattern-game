const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
let matchedShapes = 0;
let currentPattern = []; // Oyuncunun seçtiği sıralama

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

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.classList.contains('green') ? 'green' : 'orange');
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

function drop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('text/plain');
    const targetColor = e.target.getAttribute('data-color');

    if (color === targetColor && !e.target.classList.contains('filled')) {
        // Şekil doğru yere yerleştirildiğinde
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color === 'green' ? 'green' : 'orange';
        matchedShapes++;
        currentPattern.push(color);
        
        // Şekil sol taraftan kaybolacak
        const shape = document.querySelector(`.shape.${color}`);
        shape.style.visibility = 'hidden';

        checkWin();
    } else {
        // Eğer yanlış yerleştirildiyse şekil geri dönecek
        const shape = document.querySelector(`.shape.${color}`);
        shape.style.visibility = 'visible';
    }
}

function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
        dropzones.forEach(zone => zone.classList.add('bounce'));
    }
}
