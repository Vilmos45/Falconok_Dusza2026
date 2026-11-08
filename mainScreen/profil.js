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
