// PÁLYA BETÖLTÉSE SZERVERRŐL

import { isEditing } from "./mapChange.js";

export let betoltott_palya = ">..............\n...............\n...............\n...............\n...............\n...............\n...............\n...............\n...............\n...............";

const palyaDialog = document.getElementById("palyaDialog");
const palyaSelect = document.getElementById("palyaSelect");

document.getElementById("palyaBetoltesButton").addEventListener("click", () => {
    if(isEditing){
        alert("Mielőtt pályát váltasz, fejezd be az aktuális pálya szerkesztését.");
        return;
    }
    palyaDialog.showModal();
});

document.getElementById("palyaBetoltesMegse").addEventListener("click", () => {
    palyaDialog.close();
});

document.getElementById("palyaBetoltesMegerosit").addEventListener("click", async () => {
    const filename = palyaSelect.value;

    if (!filename) {
        alert("Válassz ki egy pályát!");
        return;
    }

    try {
        const response = await fetch("loadmap.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                filename: filename
            })
        });

        const data = await response.json();

        
        if (!response.ok || !data.success) {
            alert(data.message || "Hiba történt a pálya betöltésekor!");
            return;
        }

        console.log("Megérkezett a pálya, csak be kell tölteni.", data.filename, data.content);

        /*
        const [y, x] = data.content.split("\n")[0].trim().split(/\s+/).map(Number);

        betoltott_palya.x = x;
        betoltott_palya.y = y;
        */
        betoltott_palya = data.content.split('\n').slice(1).join('\n');

        document.dispatchEvent(new CustomEvent("mapLoaded", {
            detail: {
                filename: data.filename,
                content: data.content
            }
        }));

        palyaDialog.close();

        document.getElementById("palyaBetoltesButton").textContent =
            data.filename;
        
    } catch (error) {
        console.error(error);
        alert("Nem sikerült kommunikálni a szerverrel!");
    }
});
