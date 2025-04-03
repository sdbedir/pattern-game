const draggables = document.querySelectorAll('.draggable');
const dropzone = document.querySelector('.dropzone');
let isCompleted = false; // Oyunun bitip bitmediğini takip et

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', e => {
    e.dataTransfer.setData('color', e.target.style.backgroundColor);
  });
});

dropzone.addEventListener('dragover', e => {
  e.preventDefault();
});

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  const color = e.dataTransfer.getData('color');
  const correctColor = dropzone.getAttribute('data-correct-color');

  if (!isCompleted) {
    if (color === correctColor) {
      dropzone.style.backgroundColor = color;
      dropzone.classList.remove('dropzone');
      dropzone.classList.add('correct');
      isCompleted = true; // Oyunu tamamla
    } else {
      dropzone.classList.add('incorrect');
      setTimeout(() => dropzone.classList.remove('incorrect'), 1000);
    }
  }
});
