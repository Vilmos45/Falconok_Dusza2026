
<?php

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Nem megfelelő HTTP metódus!"
    ]);

    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["filename"]) || !is_string($data["filename"])) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Hiányzó fájlnév!"
    ]);

    exit;
}

$filename = $data["filename"];

// Csak egyszerű .map fájlneveket fogadunk el
if (!preg_match('/^[a-zA-Z0-9_-]+\.map$/', $filename)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Érvénytelen fájlnév!"
    ]);

    exit;
}

$directory = realpath(__DIR__ . "/../palyak");
$filePath = realpath($directory . DIRECTORY_SEPARATOR . $filename);

if (
    $directory === false ||
    $filePath === false ||
    !is_file($filePath) ||
    dirname($filePath) !== $directory
) {
    http_response_code(404);

    echo json_encode([
        "success" => false,
        "message" => "A keresett pálya nem található!"
    ]);

    exit;
}

$content = file_get_contents($filePath);

if ($content === false) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Nem sikerült beolvasni a pályát!"
    ]);

    exit;
}

echo json_encode([
    "success" => true,
    "filename" => $filename,
    "content" => $content
], JSON_UNESCAPED_UNICODE);

