const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const resetButton = document.getElementById('resetButton');

let draggedElement = null;
let matchedShapes = 0;

// Fare ile sürükleme olaylarını ekleme
shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);

    // Dokunmatik için olayları ekleme
    shape.addEventListener('touchstart', touchStart);
    shape.addEventListener('touchmove', touchMove);
    shape.addEventListener('touchend', touchEnd);
});

// Bırakılabilir alanlara olay ekleme
dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('drop', drop);
});

// Fare ile sürükleme fonksiyonları
function dragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.setData('color', draggedElement.classList.contains('green') ? 'green' : 'orange');
    setTimeout(() => draggedElement.style.display = 'none', 0);
}

function dragEnd() {
    if (draggedElement) {
        draggedElement.style.display = 'block';
    }
}

// Dokunmatik sürükleme için fonksiyonlar
function touchStart(e) {
    draggedElement = e.target;
    draggedElement.style.opacity = "0.5";  // Hafif şeffaf yap
}

function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    draggedElement.style.position = "absolute";
    draggedElement.style.left = `${touch.clientX - 40}px`;
    draggedElement.style.top = `${touch.clientY - 40}px`;
}

function touchEnd(e) {
    const touch = e.changedTouches[0];
    let dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropTarget && dropTarget.classList.contains('dropzone')) {
        drop(e, dropTarget);
    }

    draggedElement.style.opacity = "1";
    draggedElement.style.position = "static";  // Orijinal konuma geri al
}

// Sürükleme alanlarına izin ver
function dragOver(e) {
    e.preventDefault();
}

// Bırakma fonksiyonu (Fare ve Dokunmatik İçin)
function drop(e, target = null) {
    e.preventDefault();
    const draggedColor = draggedElement.classList.contains('green') ? 'green' : 'orange';
    const targetDropzone = target || e.target;  // Dokunmatikse target parametresini kullan

    if (targetDropzone.classList.contains('dropzone') && !targetDropzone.classList.contains('filled')) {
        const targetColor = targetDropzone.getAttribute('data-color');

        if (draggedColor === targetColor) {
            targetDropzone.classList.add('filled');
            targetDropzone.style.backgroundColor = draggedColor;
            draggedElement.style.display = 'none';
            matchedShapes++;

            if (matchedShapes === dropzones.length) {
                successMessage.style.display = 'block';
                resetButton.style.display = 'block';
            }
        } else {
            draggedElement.style.display = 'block';
        }
    }
}

// Oyunu sıfırlama butonu
resetButton.addEventListener('click', () => {
    location.reload();
});
