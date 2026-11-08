
<?php

header("Content-Type: application/json; charset=utf-8");

function respond($success, $error = null, $message = null) {
    echo json_encode([
        "success" => $success,
        "error" => $error,
        "message" => $message
    ]);
    exit;
}

// JSON beolvasása
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    respond(false, "invalid_json", "Érvénytelen JSON.");
}

$name = $data["name"] ?? "";
$content = $data["content"] ?? "";

// Alapvető típusellenőrzés
if (!is_string($name) || !is_string($content)) {
    respond(false, "invalid_data", "Érvénytelen adatok.");
}

// Fájlnév ellenőrzése
if (!preg_match('/^[\p{L}\p{N}_-]+\.map$/u', $name)) {
    respond(false, "invalid_name", "Érvénytelen fájlnév.");
}

// Pálya formátumának ellenőrzése
$lines = preg_split('/\r\n|\r|\n/', rtrim($content, "\r\n"));

if (count($lines) < 2) {
    respond(false, "invalid_map", "Hiányos pályafájl.");
}

// Első sor: magasság és szélesség
if (!preg_match('/^([1-9]\d*)\s+([1-9]\d*)$/', $lines[0], $matches)) {
    respond(false, "invalid_map", "Hibás dimenziók.");
}

$height = (int)$matches[1];
$width = (int)$matches[2];

// Maximális méret: 15x15
if ($height > 15 || $width > 15) {
    respond(false, "invalid_map", "A pálya túl nagy.");
}

// Pontosan annyi sor legyen, amennyit a magasság megad
if (count($lines) !== $height + 1) {
    respond(false, "invalid_map", "Hibás sorok száma.");
}

// Sorok ellenőrzése
for ($i = 1; $i <= $height; $i++) {
    if (strlen($lines[$i]) !== $width) {
        respond(false, "invalid_map", "Hibás sorhossz.");
    }

    if (!preg_match('/^[.#@<>^v]+$/', $lines[$i])) {
        respond(false, "invalid_map", "Érvénytelen karakter a pályában.");
    }
}

// Mappa elérési útja
$directory = __DIR__ . "/../palyak";

if (!is_dir($directory) || !is_writable($directory)) {
    respond(false, "directory_error", "A pályamappa nem írható.");
}

$path = $directory . "/" . $name;

// Fájl létrehozása kizárólag akkor, ha még nem létezik
$file = @fopen($path, "x");

if ($file === false) {
    if (file_exists($path)) {
        respond(false, "exists", "Ez a fájlnév már foglalt.");
    }

    respond(false, "write_error", "Nem sikerült létrehozni a fájlt.");
}

// Tartalom kiírása
$written = fwrite($file, $content);
$closed = fclose($file);

if ($written !== strlen($content) || !$closed) {
    @unlink($path);
    respond(false, "write_error", "Nem sikerült elmenteni a pályát.");
}

respond(true);

?>
