<?php

session_start();

if(isset($_SESSION["username"])){
    header("Location: mainScreen/"); 
    exit; 
}

 ?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login to Falcons'</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>

    <main class="auth-container">
        <section class="login-card">
            <h1>Welcome to the Falcons</h1>
            <p class="subtitle">
                Log in to your account to continue...
            </p>

            <form id="loginForm">

                <div class="form-group">
                    <label for="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        autocomplete="username"
                        required
                    >
                </div>

                <div class="form-group">
                    <div class="password-heading">
                        <label for="password">Password</label>
<!--
                        <button
                            type="button"
                            id="forgotPassword"
                            class="text-button"
                        >
                            Forgot your password?
                        </button>-->
                    </div>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Your password"
                            autocomplete="current-password"
                            required
                        >
                </div>

                <p id="loginStatus" class="status" aria-live="polite"></p>

                <button type="submit" id="loginButton" class="login-button">
                    Login
                </button>
                <button type="submit" id="registrate" class="login-button">
                    Registrate
                </button>

            </form>
        </section>
    </main>


    <!-- Jelszó-visszaállítás -->
    <dialog id="resetDialog" class="reset-dialog">

        <form id="resetForm">

            <button
                type="button"
                id="closeReset"
                class="close-button"
                aria-label="Bezárás"
            >
                &times;
            </button>

            <div class="reset-icon">?</div>

            <h2>Reset your password</h2>

            <p class="subtitle">
                If your e-mail is linked to your account, we will send you a recovery code.
            </p>

            <div class="form-group">
                <label for="resetEmail">E-mail</label>

                <input
                    type="email"
                    id="resetEmail"
                    name="email"
                    placeholder="example@freemail.com"
                    autocomplete="email"
                    required
                >
            </div>

            <p id="resetStatus" class="status" aria-live="polite"></p>

            <button type="submit" id="resetButton" class="login-button">
                Send me a link to reset my password!
            </button>

        </form>

    </dialog>

</body>
</html>
