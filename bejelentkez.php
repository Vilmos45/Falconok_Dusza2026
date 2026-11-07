
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
$regisztracio_e = $data["regisztracio_e"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["message" => "Fill in all the fields."]);
    exit;
}

// Adatbázis-kapcsolat
try {
    $pdo = new PDO(
        "mysql:host=localhost;dbname=robotszim;charset=utf8mb4",
        "root",
        "",
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    if ($regisztracio_e) {
        // Check if username already exists
        $stmt = $pdo->prepare(
            "SELECT username
            FROM users
            WHERE username = ?"
        );
        $stmt->execute([$username]);

        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "message" => "Ez a felhasználónév már foglalt."
            ]);
            exit;
        }

        // Register new user
        // $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $hashedPassword = $password;

        $stmt = $pdo->prepare(
            "INSERT INTO users (username, password) VALUES (?, ?)"
        );
        $stmt->execute([$username, $hashedPassword]);

        echo json_encode([
            "success" => true,
            "message" => "Sikeres regisztráció!"
        ]);
        exit;
    }

    // Felhasználó keresése
    $stmt = $pdo->prepare(
        "SELECT username, password
         FROM users
         WHERE username = ?"
    );

    $stmt->execute([$username]);

    $user = $stmt->fetch();

    // Jelszó ellenőrzése
    // if (!$user || !password_verify($password, $user["jelszo"])) {
    if (!$user || $password != $user["password"]) {
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

    $_SESSION["username"] = $user["username"];

    // Sikeres bejelentkezés
    echo json_encode([
        "success" => true,
        "message" => "Successful login!",
        "redirectUrl" => "mainScreen",
        "ok" => true
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "message" => "Database error. : " . $e->getMessage()
    ]);
}

?>