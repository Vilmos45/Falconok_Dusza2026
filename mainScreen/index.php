<?php
session_start();

if(!isset($_SESSION["username"])){
    header("Location: ../index.php"); 
    exit; 
}
 ?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script type="module" src="ui.js"  defer></script>
    <script type="module" src="readFile.js" defer></script>
    <link rel="stylesheet" href="style.css">
    <title>Miner script</title>
    <script src="code.js" defer></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <span>Írányítsd a robotot Miner Script kóddal!</span>

        <div id="profileContainer">
            <button id="profil">
                <?= htmlspecialchars($_SESSION["username"]) ?>
            </button>

            <div id="profileMenu" class="hidden">
                <a href="../logout.php">Kijelentkezés</a>

                <!-- <button id="deleteProfile">
                    Profil törlése
                </button> -->
            </div>
        </div>
    </header>
    <main>
        <div id="parentDiv">
            <div id="map">
                <div id="table"></div>
                <input type="file" id="fileInput" accept=".txt,.map,.csv">
            </div>
            <div id="codingSide">
                <h2 id="codeTitle">Code</h2>
                <div id="terminal">></div>
                <textarea id="codeInput" spellcheck="false" placeholder="set arany to isThere 2&#10;print arany"></textarea> <br>
                <button id="startTheCodeButton" class="btn btn-primary">Start</button>
            </div>
        </div>
    </main>
    <footer>
        Csakis a Falconok! 2026. Dusza (Vilmos, Maxim és Ádám)
    </footer>
</body>
</html>