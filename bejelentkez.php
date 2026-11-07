
<?php

header("Content-Type: application/json; charset=UTF-8");

// Csak POST-kérés elfogadása
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
    exit;
}

// JSON fogadása
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid JSON."]);
    exit;
}

$username = trim($data["username"] ?? "");
$password = $data["password"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Fill in all the fields."]);
    exit;
}

// Adatbázis-kapcsolat
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=irogatos;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    // Felhasználó keresése
    $stmt = $pdo->prepare(
        "SELECT id, felhasznalonev, jelszo
         FROM felhasznalok
         WHERE felhasznalonev = ?"
    );

    $stmt->execute([$username]);

    $user = $stmt->fetch();

    // Jelszó ellenőrzése
    if (!$user || !password_verify($password, $user["jelszo"])) {
        http_response_code(401);
        echo json_encode([
            "message" => "Your username or your password is invalid. :("
        ]);
        exit;
    }

    // Session létrehozása
    session_start();

    // Session fixation elleni védelem
    session_regenerate_id(true);

    $_SESSION["user_id"] = $user["id"];
    $_SESSION["username"] = $user["felhasznalonev"];

    // Sikeres bejelentkezés
    echo json_encode([
        "success" => true,
        "message" => "Successful login!",
        "redirectUrl" => "mainScreen"
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "message" => "Database error."
    ]);
}

?>