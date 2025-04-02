const draggables = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');
const message = document.getElementById('message');

let currentPattern = [];

draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', e => {
        e.dataTransfer.setData('color', e.target.classList.contains('green') ? 'green' : 'orange');
    });
});

dropzones.forEach((dropzone, index) => {
    dropzone.addEventListener('dragover', e => {
        e.preventDefault();
    });

    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        const color = e.dataTransfer.getData('color');
        
        // Eğer boşsa ve doğru örüntüye uyuyorsa ekle
        if (!dropzone.classList.contains('filled')) {
            dropzone.style.backgroundColor = color;
            dropzone.classList.add('filled');
            currentPattern.push(color);

            // Oyunun bitip bitmediğini kontrol et
            if (currentPattern.length === 6) {
                checkPattern();
            }
        }
    });
});

function checkPattern() {
    const correctPattern1 = ["green", "orange", "green", "orange", "green", "orange"];
    const correctPattern2 = ["orange", "green", "orange", "green", "orange", "green"];

    if (JSON.stringify(currentPattern) === JSON.stringify(correctPattern1) ||
        JSON.stringify(currentPattern) === JSON.stringify(correctPattern2)) {
        message.textContent = "Tebrikler! Örüntüyü doğru tamamladınız.";
    } else {
        message.textContent = "Yanlış örüntü! Lütfen tekrar deneyin.";
        resetGame();
    }
}

function resetGame() {
    dropzones.forEach(dropzone => {
        dropzone.style.backgroundColor = "#fff";
        dropzone.classList.remove('filled');
    });
    currentPattern = [];
}
