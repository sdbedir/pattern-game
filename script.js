const draggables = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');

let currentPattern = [];

// Örüntü kuralları
const correctPattern1 = ["green", "orange", "green", "orange", "green", "orange"];
const correctPattern2 = ["orange", "green", "orange", "green", "orange", "green"];

// Daireleri sürükleme işlevi
draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', e => {
        e.dataTransfer.setData('color', e.target.dataset.color);
    });
});

// Daireleri bırakma alanı
dropzones.forEach((dropzone, index) => {
    dropzone.addEventListener('dragover', e => {
        e.preventDefault();
    });

    dropzone.addEventListener('drop', e => {
        e.preventDefault();
        const color = e.dataTransfer.getData('color');

        // Eğer boşsa ekleyelim
        if (!dropzone.classList.contains('filled')) {
            dropzone.style.backgroundColor = color;
            dropzone.classList.add('filled');
            dropzone.dataset.color = color;
            currentPattern[index] = color; 

            // Örüntü tamamlandı mı kontrol et
            if (currentPattern.filter(Boolean).length === 6) {
                checkPattern();
            }
        }
    });
});

// Örüntü kontrolü
function checkPattern() {
    if (JSON.stringify(currentPattern) === JSON.stringify(correctPattern1) ||
        JSON.stringify(currentPattern) === JSON.stringify(correctPattern2)) {
        message.textContent = "Tebrikler! Örüntüyü doğru tamamladınız.";
        message.style.color = "green";
    } else {
        message.textContent = "Yanlış örüntü! Lütfen tekrar deneyin.";
        message.style.color = "red";
        setTimeout(resetGame, 1500);
    }
}

// Oyunu sıfırla
function resetGame() {
    dropzones.forEach(dropzone => {
        dropzone.style.backgroundColor = "#fff";
        dropzone.classList.remove('filled');
        delete dropzone.dataset.color;
    });
    currentPattern = [];
    message.textContent = "";
}

// Yeniden başlat butonu
restartButton.addEventListener('click', resetGame);
