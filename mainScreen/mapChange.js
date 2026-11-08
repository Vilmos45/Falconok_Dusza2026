import { map, mapX, mapY, generateTable } from "./ui.js";

const toggleBtn = document.getElementById("mapChangeButton");
const editorTools = document.getElementById("editorTools");
const palette = document.getElementById("palette");
const mapXInput = document.getElementById("mapXInput");
const mapYInput = document.getElementById("mapYInput");
const fileInput = document.getElementById("fileInput");
const importBtn = document.getElementById("importBtn");
const exportBtn = document.getElementById("exportBtn");
const uploadBtn = document.getElementById("uploadBtn");

export let isEditing = false;
let selectedTool = ".";

toggleBtn.onclick = () => {
    isEditing = !isEditing;
    editorTools.classList.toggle("hidden", !isEditing);
    palette.classList.toggle("hidden", !isEditing);
    toggleBtn.textContent = isEditing ? "<< Vissza" : "térkép szerkesztés";
};

let robotRotationIndex = 1; 
const rotations = [">", "^", "<", "v"];

palette.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
        palette.querySelectorAll("button").forEach(b => b.style.border = "1px solid rgb(45, 255, 45)");
        btn.style.border = "2px solid white";
        
        selectedTool = btn.getAttribute("data-type");
        
        if (selectedTool === "robot") {
            robotRotationIndex = (robotRotationIndex + 1) % 4;
            btn.textContent = rotations[robotRotationIndex];
            selectedTool = btn.textContent;
        }
    };
});

window.addEventListener("cellClicked", (e) => {
    if (!isEditing) return;
    const { x, y } = e.detail;

    if ([">", "<", "^", "v"].includes(selectedTool)) {
        if (map[y][x] === "@") return;
        for (let i = 0; i < mapY; i++) {
            for (let j = 0; j < mapX; j++) {
                if ("> < ^ v".includes(map[i][j])) map[i][j] = ".";
            }
        }
        map[y][x] = selectedTool;
    } else {
        map[y][x] = selectedTool;
    }
    generateTable(mapX, mapY, map, false);
});

mapXInput.onchange = mapYInput.onchange = () => {
    let newX = parseInt(mapXInput.value) || 10;
    let newY = parseInt(mapYInput.value) || 15;
    if (newX < 1) newX = 1; if (newX > 15) newX = 15;
    if (newY < 1) newY = 1; if (newY > 15) newY = 15;
    
    let newMap = [];
    for (let y = 0; y < newY; y++) {
        newMap.push([]);
        for (let x = 0; x < newX; x++) {
            newMap[y].push(map[y]?.[x] || ".");
        }
    }
    generateTable(newX, newY, newMap, false);
};

importBtn.onclick = () => fileInput.click();
fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const lines = event.target.result.trim().split("\n");
        const [h, w] = lines[0].split(" ").map(Number);
        
        mapXInput.value = w;
        mapYInput.value = h;
        
        let newMap = [];
        for (let y = 0; y < h; y++) {
            newMap.push(lines[y + 1].split(""));
        }
        generateTable(w, h, newMap, true); 
    };
    reader.readAsText(file);
    fileInput.value = "";
};

exportBtn.onclick = () => {
    let currentX = parseInt(mapXInput.value);
    let currentY = parseInt(mapYInput.value);
    
    let text = `${currentY} ${currentX}\n`;
    for (let y = 0; y < currentY; y++) {
        let rowString = "";
        for (let x = 0; x < currentX; x++) {
            rowString += map[y]?.[x] || ".";
        }
        text += rowString + "\n";
    }
    
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "terkep.txt";
    a.click();
};


const saveMapDialog = document.getElementById("saveMapDialog");
const saveMapForm = document.getElementById("saveMapForm");
const mapNameInput = document.getElementById("mapNameInput");
const mapSaveError = document.getElementById("mapSaveError");
const cancelMapSave = document.getElementById("cancelMapSave");

// Pálya tartalmának előállítása
function getMapContent() {
    const currentX = parseInt(mapXInput.value);
    const currentY = parseInt(mapYInput.value);

    let text = `${currentY} ${currentX}\n`;

    for (let y = 0; y < currentY; y++) {
        let rowString = "";

        for (let x = 0; x < currentX; x++) {
            rowString += map[y]?.[x] || ".";
        }

        text += rowString + "\n";
    }

    return text;
}

/* PÁLYA MENTÉSE SZERVERRE */

// Mentési ablak megnyitása
uploadBtn.onclick = () => {
    mapSaveError.textContent = "";
    mapNameInput.value = "";
    saveMapDialog.showModal();
    mapNameInput.focus();
};

// Ablak bezárása
cancelMapSave.onclick = () => {
    saveMapDialog.close();
};

// Mentés
saveMapForm.onsubmit = async (event) => {
    event.preventDefault();

    let name = mapNameInput.value.trim();

    // A .map kiterjesztést automatikusan hozzáadjuk
    name = name.replace(/\.map$/i, "");

    if (!name || !/^[\p{L}\p{N}_-]+$/u.test(name)) {
        mapSaveError.textContent =
            "Érvénytelen fájlnév! Csak betűk, számok, kötőjelek és aláhúzások használhatók.";
        return;
    }

    name += ".map";

    const content = getMapContent();

    try {
        const response = await fetch("./createmap.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                content: content
            })
        });

        const result = await response.json();

        if (result.success) {
            // Pályaválasztó frissítése
            const mapSelect = document.getElementById("palyaSelect");

            let option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            mapSelect.appendChild(option);
            mapSelect.value = name;

            mapSelect.dispatchEvent(new Event("change"));
            
            document.getElementById("palyaBetoltesButton").textContent = name;

            saveMapDialog.close();
            return;
        }

        if (result.error === "exists") {
            mapSaveError.textContent = "Ez a fájlnév már foglalt!";
            mapNameInput.focus();
            mapNameInput.select();
        } else {
            mapSaveError.textContent =
                result.message || "Hiba történt a mentés során.";
        }

    } catch (error) {
        console.error(error);
        mapSaveError.textContent = "Nem sikerült kapcsolódni a szerverhez.";
    }
};
