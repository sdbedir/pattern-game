<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Örüntü Oyunu</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Örüntü Oyunu</h1>
    
    <div class="game-container">
        <div class="shapes-container">
            <div class="shape orange" draggable="true"></div>
            <div class="shape orange" draggable="true"></div>
            <div class="shape orange" draggable="true"></div>
            <div class="shape green" draggable="true"></div>
            <div class="shape green" draggable="true"></div>
            <div class="shape green" draggable="true"></div>
        </div>

        <div class="pattern-container">
            <div class="dropzone"></div>
            <div class="dropzone"></div>
            <div class="dropzone"></div>
            <div class="dropzone"></div>
            <div class="dropzone"></div>
            <div class="dropzone"></div>
        </div>
    </div>

    <p class="message" id="successMessage">Tebrikler! Örüntüyü başarıyla tamamladınız. 🎉</p>

    <button id="resetButton">Yeniden Başlat</button>

    <script src="script.js"></script>
</body>
</html>
