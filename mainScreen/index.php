<?php
session_start();

if(!isset($_SESSION["username"])){
    header("Location: ../"); 
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
    <script type="module" src="robot.js" defer></script>
    <link rel="stylesheet" href="style.css">
    <title>Miner script</title>
    <script type="module" src="code.js" defer></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <span>Írányítsd a robotot Miner Script kóddal!</span>

        <div id="profileContainer">
            <button id="profil" title="kijelentkezés">
                <?= htmlspecialchars($_SESSION["username"]) ?>
            </button>

            <div id="profileMenu" class="hidden">
                <a href="../logout.html">Kijelentkezés</a>

                <!-- <button id="deleteProfile">
                    Profil törlése
                </button> -->
            </div>
        </div>
    </header>
    <main>
        <div id="parentDiv">
            <div id="map">
                <button id="mapChangeButton">térkép szerkesztés</button>
                <div id="table"></div>
                <input type="file" id="mapInput" accept=".txt,.map,.csv,.tsv">
            </div>
            <div id="codingSide">
                <h2 id="codeTitle">Code</h2>
                <div id="terminal">></div>
                <div id="editor">
                    <div id="highlightLayer"></div>
                    <textarea id="codeInput" spellcheck="false" placeholder="set arany to isThere 2&#10;print arany"></textarea>
                </div>
                <input type="file" id="codeFileInp" accept=".txt,.ms,.minescript">
                <br>
                <button id="startTheCodeButton" class="btn btn-primary">Start</button>
            </div>
        </div>
    </main>
    <footer>
        Csakis a Falconok! 2026. Dusza (Vilmos, Maxim és Ádám)
    </footer>
</body>
</html>