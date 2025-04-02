const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
const errorSound = document.getElementById('errorSound');
let matchedShapes = 0;
let patternStartedWithGreen = false;  // İlk şeklin rengini kontrol eden değişken
let currentPattern = [];  // Seçilen örüntü sırası

// Sürükleme olayları
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

// Başlangıç rengi seçme (yeşil veya turuncu)
document.querySelectorAll('.shapes-container .shape').forEach(shape => {
    shape.addEventListener('click', (e) => {
        const firstShapeColor = e.target.classList.contains('green') ? 'green' : 'orange';
        if (currentPattern.length === 0) {
            patternStartedWithGreen = firstShapeColor === 'green';  // Başlangıç rengini belirle
            setupPattern(firstShapeColor);
        }
    });
});

// Seçilen renge göre örüntü sırasını oluşturma
function setupPattern(startColor) {
    currentPattern = [];
    let color = startColor;
    for (let i = 0; i < dropzones.length; i++) {
        currentPattern.push(color);
        color = (color === 'green') ? 'orange' : 'green';  // Alternatif renk
    }
}

// Sürükleme başlangıcı
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => e.target.classList.add('hidden'), 0);
}

// Sürükleme bitişi
function dragEnd(e) {
    e.target.classList.remove('hidden');
}

// Alan üzerine sürükleme
function dragOver(e) {
    e.preventDefault();
}

// Alan üzerine girme
function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('hover');
}

// Alan dışına çıkma
function dragLeave(e) {
    e.target.classList.remove('hover');
}

// Alan üzerine bırakma
function drop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('text/plain');
    const targetColor = e.target.getAttribute('data-color');

    if (color === currentPattern[matchedShapes] && !e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color === 'green' ? 'green' : 'orange';
        matchedShapes++;
        checkWin();
    } else {
        // Yanlış yerleştirme durumunda
        errorSound.play(); // Sesli uyarı
        setTimeout(() => {
            e.target.style.backgroundColor = ''; // Yanlış yerleştirilen şekil eski yerine döner
            e.target.classList.remove('filled');
        }, 500);
    }
}

// Kazanma kontrolü
function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
        dropzones.forEach(zone => zone.classList.add('bounce'));
    }
}
