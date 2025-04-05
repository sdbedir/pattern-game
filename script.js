const shapes = document.querySelectorAll('.shape');
const dropzones = document.querySelectorAll('.dropzone');
const successMessage = document.getElementById('successMessage');
const restartBtn = document.getElementById('restartBtn');

let placedColors = [];

shapes.forEach(shape => {
    shape.addEventListener('dragstart', dragStart);
});

dropzones.forEach(zone => {
    zone.addEventListener('dragover', dragOver);
    zone.addEventListener('drop', handleDrop);
});

function dragStart(e) {
    e.dataTransfer.setData('color', e.target.dataset.color);
    e.dataTransfer.setData('elementId', e.target.id);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const color = e.dataTransfer.getData('color');
    const draggedElement = document.querySelector('.dragging');

    if (e.target.classList.contains('dropzone') && !e.target.hasChildNodes()) {
        const lastColor = placedColors[placedColors.length - 1];

        // İlk taşımı serbest bırakıyoruz
        if (placedColors.length === 0 || lastColor !== color) {
            const newShape = document.createElement('div');
            newShape.className = `shape ${color}`;
            e.target.appendChild(newShape);
            placedColors.push(color);
            draggedElement.remove(); // Taşınan öğeyi orijinal yerinden kaldır

            checkPattern();
        }
    }

    draggedElement.classList.remove('dragging');
}

function checkPattern() {
    if (placedColors.length === 6) {
        const pattern1 = ['orange', 'green', 'orange', 'green', 'orange', 'green'];
        const pattern2 = ['green', 'orange', 'green', 'orange', 'green', 'orange'];

        const win = JSON.stringify(placedColors) === JSON.stringify(pattern1) ||
                    JSON.stringify(placedColors) === JSON.stringify(pattern2);

        if (win) {
            successMessage.style.display = 'block';
        } else {
            successMessage.textContent = "Yanlış örüntü, lütfen tekrar deneyin.";
            successMessage.style.display = 'block';
        }

        restartBtn.style.display = 'inline-block';
    }
}

restartBtn.addEventListener('click', () => {
    location.reload();
});
