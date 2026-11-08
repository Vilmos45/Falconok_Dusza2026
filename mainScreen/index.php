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

    <title>Falcons' Miner script</title>

    <script type="module" src="ui.js"  defer></script>
    <script type="module" src="readFile.js" defer></script>
    <script type="module" src="robot.js" defer></script>
    <script type="module" src="code.js" defer></script>
    <script type="module" src="szerverrol_palya.js" defer></script>
    <script type="module" src="profil.js" defer></script>
    <script type="module" src="mapChange.js" defer></script>

    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <span>Írányítsd a robotot Miner Script kóddal!</span>

        <div id="palyaBetoltesContainer">
            <button id="palyaBetoltesButton">
                Pálya betöltése
            </button>

            <dialog id="palyaDialog">
                <h2>Pálya kiválasztása</h2>

                <select id="palyaSelect">
                    <option value="">Válassz egy pályát!</option>

                    <?php
                    $palyak = glob(__DIR__ . "/../palyak/*.map");

                    foreach ($palyak as $palya) {
                        $nev = basename($palya);

                        echo '<option value="' .
                            htmlspecialchars($nev, ENT_QUOTES, 'UTF-8') .
                            '">' .
                            htmlspecialchars($nev, ENT_QUOTES, 'UTF-8') .
                            '</option>';
                    }
                    ?>
                </select>

                <div id="palyaDialogButtons">
                    <button id="palyaBetoltesMegse">Mégse</button>
                    <button id="palyaBetoltesMegerosit">Betöltés</button>
                </div>
            </dialog>
        </div>

        <div id="profileContainer">
            <button id="profil" title="kijelentkezés">
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
            <div id="topBar">
                <button id="mapChangeButton">térkép szerkesztés</button>

                <div id="editorTools" class="hidden">
                    <button id="uploadBtn">mentés</button>
                    <button id="importBtn">import</button>
                    <input type="file" id="fileInput" accept=".txt" style="display: none;">
                    <button id="exportBtn">export</button>
                    
                    <span id="sizeInputs">
                        x <input type="number" id="mapXInput" value="10" min="1" max="15">
                        y <input type="number" id="mapYInput" value="15" min="1" max="15">
                    </span>
                </div>
            </div>

            <div id="table"></div>

            <div id="palette" class="hidden">
                <button data-type=".">.</button>
                <button data-type="#">#</button>
                <button data-type="@">@</button>
                <button data-type="robot">></button>
            </div>
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
    
    <dialog id="saveMapDialog">
        <form id="saveMapForm">
            <h2>Pálya mentése</h2>

            <label for="mapNameInput">Fájl neve:</label>
            <div class="filenameInput">
                <input
                    type="text"
                    id="mapNameInput"
                    placeholder="palya_neve"
                    required
                    autocomplete="off"
                >
                <span>.map</span>
            </div>

            <p id="mapSaveError"></p>

            <div class="dialogButtons">
                <button type="submit">Mentés</button>
                <button type="button" id="cancelMapSave">Mégse</button>
            </div>
        </form>
    </dialog>

    <footer>
        Csakis a Falconok! 2026. Dusza (Vilmos, Maxim és Ádám)
    </footer>
</body>
</html>