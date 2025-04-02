const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const errorSound = document.getElementById('errorSound');

let userPattern = [];
let correctPattern = [];
let firstShape = null;

// Sürükleme işlemleri hem dokunmatik hem de mouse ile çalışacak şekilde ayarlandı
shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
    shape.addEventListener('dragend', dragEnd);

    // Dokunmatik için
    shape.addEventListener('touchstart', touchStart);
    shape.addEventListener('touchmove', touchMove);
    shape.addEventListener('touchend', touchEnd);
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

// Dokunmatik fonksiyonları
let selectedElement = null;

function touchStart(e) {
    selectedElement = e.target;
    e.target.style.opacity = "0.5";
}

function touchMove(e) {
    e.preventDefault();
    let touch = e.touches[0];
    selectedElement.style.position = "absolute";
    selectedElement.style.left = touch.pageX - 50 + "px";
    selectedElement.style.top = touch.pageY - 50 + "px";
}

function touchEnd(e) {
    let touch = e.changedTouches[0];
    let dropzone = document.elementFromPoint(touch.pageX, touch.pageY);

    if (dropzone.classList.contains("dropzone") && !dropzone.hasChildNodes()) {
        let color = selectedElement.dataset.color;
        let dropzoneIndex = Array.from(dropzones).indexOf(dropzone);

        if (color === correctPattern[userPattern.length]) {
            userPattern.push(color);
            dropzone.style.backgroundColor = color;
            selectedElement.classList.add("hidden");
        } else {
            errorSound.play();
            selectedElement.style.opacity = "1";
        }
    } else {
        selectedElement.style.opacity = "1";
    }

    selectedElement.style.position = "static";
    selectedElement = null;

    if (userPattern.length === correctPattern.length) {
        successMessage.style.display = 'block';
    }
}
