<?php
require 'db.php';

$sql = "
SELECT p.*, c.name as category_name, i.filename 
FROM products p
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN images i ON p.image_id = i.image_id
ORDER BY c.category_id
";

$stmt = $pdo->query($sql);
$products = $stmt->fetchAll();

$currentCategory = "";

foreach ($products as $product) {

    if ($currentCategory != $product['category_name']) {
        $currentCategory = $product['category_name'];
        echo "<h2 style='margin-top:40px;'>" . $currentCategory . "</h2>";
    }

    echo "<div style='
        border:1px solid #ddd;
        padding:15px;
        margin:15px 0;
        border-radius:10px;
        display:flex;
        gap:20px;
        align-items:center;
    '>";

    echo "<img src='images/" . $product['filename'] . "' 
              style='width:120px;height:120px;object-fit:cover;border-radius:10px;'>";

    echo "<div>";
    echo "<h3>" . $product['name'] . "</h3>";
    echo "<p>" . $product['description'] . "</p>";
    echo "<strong>€" . $product['price'] . " | " . $product['kcal'] . " kcal</strong>";
    echo "</div>";

    echo "</div>";
}
?>