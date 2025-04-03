const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const resetButton = document.getElementById('resetButton');
let placedShapes = [];

// Sürüklemeye başlama
shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);
});

// Sürüklenen nesneyi bırakılabilir bölgeye bırakma
dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
});

// Sürükleme başlatıldığında
function dragStart(e) {
    e.dataTransfer.setData('color', e.target.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => e.target.classList.add('hidden'), 0);
}

// Sürükleme bittiğinde
function dragEnd(e) {
    e.target.classList.remove('hidden');
}

// Sürükleme işlemi devam ederken (bırakılabilir bölgeye girerken)
function dragOver(e) {
    e.preventDefault();
}

// Öğe bırakıldığında
function drop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('color');

    if (!e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = color;
        placedShapes.push(color);
        checkWin();
    }
}

// Kazanma koşullarını kontrol et
function checkWin() {
    if (placedShapes.length === dropzones.length) {
        const pattern1 = ['orange', 'green', 'orange', 'green', 'orange', 'green'];
        const pattern2 = ['green', 'orange', 'green', 'orange', 'green', 'orange'];

        if (JSON.stringify(placedShapes) === JSON.stringify(pattern1) || JSON.stringify(placedShapes) === JSON.stringify(pattern2)) {
            successMessage.style.display = 'block';
        }
    }
}

// Oyunu sıfırla
resetButton.addEventListener('click', () => {
    placedShapes = [];
    successMessage.style.display = 'none';
    dropzones.forEach(zone => {
        zone.classList.remove('filled');
        zone.style.backgroundColor = 'transparent';
    });
});
