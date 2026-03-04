<?php
require_once 'db.php';

$categories = getCategories($pdo);
$products = getProducts($pdo);

// Encode products for JavaScript
$productsJson = json_encode($products);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Happy Herbivore Kiosk</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>

    <!-- Start Screen Overlay -->
    <div id="start-screen" class="start-screen">
        <img src="logo/logo_big_dinosaur_transparent.webp" alt="Happy Herbivore Logo" class="start-logo-img">
        <div class="start-logo">Happy <span>Herbivore</span></div>
        <div class="start-cta" onclick="hideStartScreen()">Touch To Start</div>
    </div>

    <div class="app-container">
        <!-- Sidebar Navigation (Icons) -->
        <nav class="category-sidebar">
            <button class="category-btn active" onclick="filterCategory(event, 'all')">
                <span class="category-icon">🌿</span>
                <span class="category-label">All</span>
            </button>
            <?php foreach ($categories as $category): ?>
                <button class="category-btn" onclick="filterCategory(event, <?php echo $category['category_id']; ?>)">
                    <span class="category-icon">
                        <?php
                        // Simple icon mapping based on name
                        $name = strtolower($category['name']);
                        if (strpos($name, 'breakfast') !== false)
                            echo '🍳';
                        elseif (strpos($name, 'lunch') !== false)
                            echo '🥗';
                        elseif (strpos($name, 'handhelds') !== false)
                            echo '🌯';
                        elseif (strpos($name, 'sides') !== false)
                            echo '🍟';
                        elseif (strpos($name, 'dips') !== false)
                            echo '🏺';
                        elseif (strpos($name, 'drinks') !== false)
                            echo '🥤';
                        else
                            echo '🍴';
                        ?>
                    </span>
                    <span class="category-label">
                        <?php echo htmlspecialchars($category['name']); ?>
                    </span>
                </button>
            <?php endforeach; ?>
        </nav>

        <!-- Main Content (Grid) -->
        <main class="menu-section">
            <h2 id="section-title" class="section-title">Our Menu</h2>
            <div id="menu-grid" class="menu-grid">
                <!-- Menu items injected here -->
            </div>
        </main>

        <!-- Right Cart Sidebar -->
        <aside class="cart-sidebar">
            <div class="cart-header">My Order</div>

            <div id="cart-items" class="cart-items">
                <!-- Cart items here -->
                <div style="text-align: center; margin-top: auto; margin-bottom: auto; color: #aaa;">
                    Your tray is empty
                </div>
            </div>

            <div class="cart-summary">
                <div class="summary-total">
                    <span style="font-size: 1rem; color: #777;">Total</span>
                    <span id="total-price">€0.00</span>
                </div>
                <button id="checkout-btn" class="checkout-btn">Pay Now</button>
            </div>
        </aside>
    </div>

    <script>
        // Data from Database
        const dbMenuItems = <?php echo $productsJson; ?>;
    </script>
    <script src="script.js"></script>
</body>

</html>