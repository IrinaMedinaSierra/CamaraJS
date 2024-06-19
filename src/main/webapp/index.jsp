<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Galeria de Fotos</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/script.js"></script>
    <link rel="icon" href="img/camara.jpg">
</head>
<body>
<div class="enVivo">
    <h1>Foto Matón</h1>
    <video id="camara" autoplay playsinline></video>
    <p>
        <button id="take-photo">Tomar Foto</button>
        <button id="clear-photo">Borrar todas las Fotos</button>
    </p>
    <hr>
    <h2>Galería de Fotos</h2>
    <div id="photo-galery"></div>
</div>
</body>
</html>