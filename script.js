
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const loginStatus = document.getElementById("loginStatus");

const togglePassword = document.getElementById("togglePassword");

const forgotPassword = document.getElementById("forgotPassword");
const resetDialog = document.getElementById("resetDialog");
const resetForm = document.getElementById("resetForm");
const resetEmail = document.getElementById("resetEmail");
const resetButton = document.getElementById("resetButton");
const resetStatus = document.getElementById("resetStatus");
const closeReset = document.getElementById("closeReset");


// Státusz üzenetek kezelése
function setStatus(element, message, type = "") {
    element.textContent = message;
    element.className = "status " + type;
}


// API-kérések
async function postJSON(url, data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        credentials: "same-origin",
        body: JSON.stringify(data)
    });

    let result = {};

    try {
        result = await response.json();
    } catch {
        // Üres vagy nem JSON válasz
    }

    if (!response.ok) {
        throw new Error(
            result.message || "Your username or your password is invalid."
        );
    }

    return result;
}

// Bejelentkezés
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    setStatus(loginStatus, "");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        setStatus(loginStatus, "Fill in all the fields", "error");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";

    try {
        const result = await postJSON("/api/auth/login", {
            username: username,
            password: password
        });

        // Sikeres bejelentkezés utáni átirányítás
        if (result.redirectUrl) {
            const target = new URL(
                result.redirectUrl,
                window.location.origin
            );

            // Csak saját domainre engedünk átirányítást
            if (target.origin !== window.location.origin) {
                throw new Error("Unsuccesful redirection.");
            }

            window.location.assign(target.href);
            return;
        }

        setStatus(
            loginStatus,
            result.message || "Succesful login!",
            "success"
        );

    } catch (error) {
        setStatus(
            loginStatus,
            error instanceof TypeError
                ? "Szerver is not available."
                : error.message,
            "error"
        );

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});


// Jelszó-visszaállító ablak megnyitása
forgotPassword.addEventListener("click", () => {
    resetForm.reset();
    setStatus(resetStatus, "");

    resetDialog.showModal();
    resetEmail.focus();
});


// Ablak bezárása
closeReset.addEventListener("click", () => {
    resetDialog.close();
});

// Bezárás a háttérre kattintva
resetDialog.addEventListener("click", (event) => {
    if (event.target === resetDialog) {
        resetDialog.close();
    }
});

// Bezárás után fókusz visszaállítása
resetDialog.addEventListener("close", () => {
    forgotPassword.focus();
});


// Jelszó-visszaállítás kérése
resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = resetEmail.value.trim();

    if (!email) {
        setStatus(resetStatus, "Give your e-mail address!", "error");
        return;
    }

    resetButton.disabled = true;
    resetButton.textContent = "Sending...";

    try {
        await postJSON("/api/auth/password-reset", {
            email: email
        });

        // Szándékosan nem jelezzük, hogy létezik-e a fiók.
        setStatus(
            resetStatus,
            "If your e-mail is linked to your account, we will send you a recovery code.",
            "success"
        );

    } catch (error) {
        setStatus(
            resetStatus,
            error instanceof TypeError
                ? "Server is not available."
                : error.message,
            "error"
        );

    } finally {
        resetButton.disabled = false;
        resetButton.textContent = "Ask for a reset link";
    }
});
