
<?php
session_start();

echo("Nem lehet profilt törölni.");
exit;

// Bejelentkezés ellenőrzése
if (!isset($_SESSION["username"])) {
    header("Location: ../index.php");
    exit;
}

// POST ellenőrzése
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed");
}

// CSRF ellenőrzése
if (
    !isset($_POST["csrf_token"]) ||
    !hash_equals($_SESSION["csrf_token"], $_POST["csrf_token"])
) {
    http_response_code(403);
    exit("Invalid request");
}

$username = $_SESSION["username"];

try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=robotszim;charset=utf8mb4",
        "robotszim_app",
        "IDE_JON_A_JELSZO"
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare(
        "DELETE FROM users WHERE username = ?"
    );

    $stmt->execute([$username]);

    // Session törlése
    session_unset();
    session_destroy();

    header("Location: ../index.php");
    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());
    http_response_code(500);
    exit("Database error");
}
