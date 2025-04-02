const shapes = document.querySelectorAll('.shapes-container .shape');
const dropzones = document.querySelectorAll('.pattern-container .dropzone');
const successMessage = document.getElementById('successMessage');
let matchedShapes = 0;
let activeShape = null;
let isDragging = false;

shapes.forEach(shape => {
    shape.addEventListener('mousedown', dragStart);
    shape.addEventListener('touchstart', dragStart);  // Dokunmatik ekran desteği
    shape.addEventListener('mouseup', dragEnd);
    shape.addEventListener('touchend', dragEnd);  // Dokunmatik ekran desteği
    shape.addEventListener('mousemove', dragMove);
    shape.addEventListener('touchmove', dragMove);  // Dokunmatik ekran desteği
});

dropzones.forEach(dropzone => {
    dropzone.addEventListener('dragover', dragOver);
    dropzone.addEventListener('dragenter', dragEnter);
    dropzone.addEventListener('dragleave', dragLeave);
    dropzone.addEventListener('drop', drop);
    dropzone.addEventListener('touchenter', dragEnter); // Dokunmatik ekran desteği
    dropzone.addEventListener('touchleave', dragLeave); // Dokunmatik ekran desteği
    dropzone.addEventListener('touchmove', dragMove);  // Dokunmatik ekran desteği
}

function dragStart(e) {
    e.preventDefault();
    const target = e.target;
    activeShape = target;
    isDragging = true;
    
    // Mouse event için
    if (e.type === 'mousedown' || e.type === 'touchstart') {
        target.style.position = 'absolute';
        target.style.zIndex = 1000;
        document.body.appendChild(target); // Şekli en üstte yap
    }
}

function dragMove(e) {
    e.preventDefault();
    if (isDragging && activeShape) {
        const touch = e.touches ? e.touches[0] : e; // Dokunmatik ekran için
        const x = touch.clientX;
        const y = touch.clientY;
        activeShape.style.left = `${x - activeShape.offsetWidth / 2}px`; // Şekli sürükle
        activeShape.style.top = `${y - activeShape.offsetHeight / 2}px`;
    }
}

function dragEnd(e) {
    if (activeShape) {
        const dropzone = document.elementFromPoint(e.clientX, e.clientY); // Şekil bırakılan alanı bul
        if (dropzone && dropzone.classList.contains('dropzone') && dropzone.getAttribute('data-color') === activeShape.classList.contains('green') ? 'green' : 'orange') {
            dropzone.style.backgroundColor = activeShape.classList.contains('green') ? 'green' : 'orange';
            dropzone.classList.add('filled');
            matchedShapes++;
            checkWin();
        } else {
            activeShape.style.position = 'static';
        }

        isDragging = false;
        activeShape = null;
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
    const targetColor = e.target.getAttribute('data-color');
    const draggedColor = activeShape.classList.contains('green') ? 'green' : 'orange';

    if (targetColor === draggedColor && !e.target.classList.contains('filled')) {
        e.target.classList.add('filled');
        e.target.style.backgroundColor = draggedColor === 'green' ? 'green' : 'orange';
        matchedShapes++;
        checkWin();
    }
}

function checkWin() {
    if (matchedShapes === dropzones.length) {
        successMessage.style.display = 'block';
    }
}
