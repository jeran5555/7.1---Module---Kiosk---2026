<?php
$host = 'localhost';
$db = 'u240162_kiosk';
$user = 'u240162_kiosk';
$pass = 'CgPVFbx8a6Xat8XsnBcc';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int) $e->getCode());
}

/**
 * Fetch all categories from the database.
 */
function getCategories($pdo)
{
    $stmt = $pdo->query("SELECT * FROM categories");
    return $stmt->fetchAll();
}

/**
 * Fetch all active products with their associated image filenames.
 */
function getProducts($pdo)
{
    $stmt = $pdo->query("
        SELECT p.*, i.filename as image 
        FROM products p 
        LEFT JOIN images i ON p.image_id = i.image_id 
        WHERE p.available = 1
    ");
    return $stmt->fetchAll();
}
?>