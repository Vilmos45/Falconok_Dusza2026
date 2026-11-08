// PROFIL 

const profilButton = document.getElementById("profil");
const profileMenu = document.getElementById("profileMenu");
const deleteProfileButton = document.getElementById("deleteProfile");

// Menü megnyitása és bezárása
profilButton.addEventListener("click", () => {
    profileMenu.classList.toggle("hidden");
});

// Kattintás a menün kívülre: bezárás
document.addEventListener("click", (event) => {
    if (!document.getElementById("profileContainer").contains(event.target)) {
        profileMenu.classList.add("hidden");
    }
});

/*
// Profil törlése
deleteProfileButton.addEventListener("click", () => {
    const confirmed = confirm(
        "Biztosan törölni szeretnéd a profilodat? Ez a művelet nem vonható vissza!"
    );

    if (confirmed) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "delete_profile.php";
        document.body.appendChild(form);
        form.submit();
    }
});
*/

// pálya betöltése szerverről

const palyaDialog = document.getElementById("palyaDialog");
const palyaSelect = document.getElementById("palyaSelect");

document.getElementById("palyaBetoltesButton").addEventListener("click", () => {
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

        // A betöltött pálya elérhetővé tétele
        window.currentMapContent = data.content;

        // Esemény küldése a térképkezelő kódnak - EZ FASZSÁG
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
