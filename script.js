const shapesContainer = document.querySelector('.shapes-container');
const patternContainer = document.querySelector('.pattern-container');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const chooseMessage = document.getElementById('chooseMessage');
const errorSound = document.getElementById('errorSound');
let matchedShapes = 0;
let currentShape = null;
let gameStarted = false;
let firstColor = ''; // 'green' veya 'orange'
let patternOrder = [];

// Başlangıç mesajını göster
chooseMessage.style.display = 'block';

// Renk seçimi yapıldığında oyunu başlat
function selectColor(color) {
  firstColor = color;
  gameStarted = true;
  chooseMessage.style.display = 'none';
  resetGame();
}

function resetGame() {
  // Önceki içerikleri temizle
  shapesContainer.innerHTML = '';
  patternContainer.innerHTML = '';
  matchedShapes = 0;
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
  
  // Bırakma alanları (dropzone) sırası; soldan sağa belirli örüntü
  if (firstColor === 'orange') {
    patternOrder = ['orange', 'green', 'orange', 'green', 'orange', 'green'];
  } else {
    patternOrder = ['green', 'orange', 'green', 'orange', 'green', 'orange'];
  }
  
  // Dropzone'ları oluştur
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
  
  // Draggable daireleri oluştur (her renkten 3 adet, toplam 6 adet)
  let shapesArray = [];
  for (let i = 0; i < 3; i++) {
    let shapeOrange = document.createElement('div');
    shapeOrange.classList.add('shape', 'orange');
    shapeOrange.setAttribute('draggable', 'true');
    shapesArray.push(shapeOrange);
    
    let shapeGreen = document.createElement('div');
    shapeGreen.classList.add('shape', 'green');
    shapeGreen.setAttribute('draggable', 'true');
    shapesArray.push(shapeGreen);
  }
  
  // Rastgele sıralama: Böylece oyuncuya ipucu verilmemiş olur
  shapesArray = shuffleArray(shapesArray);
  
  shapesArray.forEach(shape => {
    addDragListeners(shape);
    shapesContainer.appendChild(shape);
  });
}

// Diziyi rastgele karıştıran yardımcı fonksiyon
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Draggable daireye olay dinleyicileri ekle
function addDragListeners(shape) {
  shape.addEventListener('dragstart', dragStart);
  shape.addEventListener('dragend', dragEnd);
  // Mobil dokunmatik olayları
  shape.addEventListener('touchstart', touchStart, {passive: false});
  shape.addEventListener('touchmove', touchMove, {passive: false});
  shape.addEventListener('touchend', touchEnd);
}

function dragStart(e) {
  if (!gameStarted) return;
  currentShape = e.target;
  e.dataTransfer.setData('text/plain', currentShape.classList.contains('green') ? 'green' : 'orange');
  setTimeout(() => currentShape.style.visibility = 'hidden', 0);
}

function dragEnd(e) {
  if (currentShape) {
    currentShape.style.visibility = 'visible';
    currentShape = null;
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
  e.target.classList.remove('hover');
  const draggedColor = e.dataTransfer.getData('text/plain');
  const targetColor = e.target.getAttribute('data-color');
  
  if (draggedColor === targetColor && !e.target.classList.contains('filled')) {
    e.target.classList.add('filled');
    e.target.appendChild(currentShape);
    currentShape.style.visibility = 'visible';
    currentShape.style.cursor = 'default';
    matchedShapes++;
    checkWin();
  } else {
    playErrorSound();
    errorMessage.style.display = 'block';
    setTimeout(() => errorMessage.style.display = 'none', 1000);
  }
}

// Dokunmatik olaylar için yardımcı değişkenler
let touchOffsetX = 0;
let touchOffsetY = 0;

function touchStart(e) {
  if (!gameStarted) return;
  currentShape = e.target;
  const touch = e.touches[0];
  const rect = currentShape.getBoundingClientRect();
  touchOffsetX = touch.clientX - rect.left;
  touchOffsetY = touch.clientY - rect.top;
  e.preventDefault();
}

function touchMove(e) {
  e.preventDefault();
  if (!currentShape) return;
  const touch = e.touches[0];
  currentShape.style.position = 'absolute';
  currentShape.style.left = (touch.clientX - touchOffsetX) + 'px';
  currentShape.style.top = (touch.clientY - touchOffsetY) + 'px';
}

function touchEnd(e) {
  if (!currentShape) return;
  const touch = e.changedTouches[0];
  // Dropzone'ı belirle
  const dropzone = document.elementFromPoint(touch.clientX, touch.clientY);
  if (dropzone && dropzone.classList.contains('dropzone') && !dropzone.classList.contains('filled')) {
    const shapeColor = currentShape.classList.contains('green') ? 'green' : 'orange';
    const targetColor = dropzone.getAttribute('data-color');
    if (shapeColor === targetColor) {
      dropzone.classList.add('filled');
      dropzone.appendChild(currentShape);
      currentShape.style.position = 'static';
      currentShape.style.cursor = 'default';
      matchedShapes++;
      checkWin();
    } else {
      playErrorSound();
      errorMessage.style.display = 'block';
      setTimeout(() => errorMessage.style.display = 'none', 1000);
      currentShape.style.position = 'static';
    }
  } else {
    // Geçerli dropzone bulunamadıysa, orijinal konuma dön
    currentShape.style.position = 'static';
  }
  currentShape = null;
}

function playErrorSound() {
  errorSound.play();
}

function checkWin() {
  if (matchedShapes === patternOrder.length) {
    successMessage.style.display = 'block';
  }
}
