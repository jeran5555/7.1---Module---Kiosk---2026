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
        <!-- Top Header & Navigation -->
        <header class="header-container">
            <div class="header-top">
                <div class="brand-mini">Happy <span>Herbivore</span></div>
            </div>
            <nav class="category-nav">
                <button class="category-chip active" onclick="filterCategory(event, 'all')">
                    <span class="category-icon">🌿</span>
                    <span class="category-label">All</span>
                </button>
                <?php foreach ($categories as $category): ?>
                    <button class="category-chip" onclick="filterCategory(event, <?php echo $category['category_id']; ?>)">
                        <span class="category-icon">
                            <?php
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
                        <span class="category-label"><?php echo htmlspecialchars($category['name']); ?></span>
                    </button>
                <?php endforeach; ?>
            </nav>
        </header>

        <!-- Main Content (Grid) -->
        <main class="menu-section">
            <h2 id="section-title" class="section-title">Our Menu</h2>
            <div id="menu-grid" class="menu-grid">
                <!-- Menu items injected here -->
            </div>
        </main>

        <!-- Bottom Cart Bar -->
        <div class="bottom-bar">
            <div class="cart-summary-text">
                <span class="summary-label">Your Tray</span>
                <span id="bar-total" class="summary-total">€0.00</span>
            </div>
            <button class="view-order-btn" onclick="toggleCart()">View Order</button>
        </div>

        <!-- Cart Modal Overlay -->
        <div id="cart-modal" class="cart-modal">
            <div class="cart-content">
                <div class="modal-header">
                    <h2>Your Order</h2>
                    <button class="close-btn" onclick="toggleCart()">✕</button>
                </div>
                <div id="cart-items-list" class="cart-items-list">
                    <!-- Cart items here -->
                </div>
                <div class="modal-footer">
                    <div class="summary-total" style="margin-bottom: 20px;">
                        <span>Total:</span>
                        <span id="modal-total">€0.00</span>
                    </div>
                    <button id="checkout-btn" class="checkout-btn"
                        style="width: 100%; padding: 1.2rem; background: var(--primary-green); color: white; border: none; border-radius: 50px; font-weight: 700; font-size: 1.2rem;">Pay
                        Now</button>
                </div>
            </div>
        </div>

        <!-- Extras Modal Overlay -->
        <div id="extras-modal" class="cart-modal">
            <div class="cart-content" style="height: 60%;">
                <div class="modal-header">
                    <h2>Zou je er nog wat bij willen?</h2>
                    <button class="close-btn" onclick="closeExtras()">✕</button>
                </div>
                <div id="extras-list" class="cart-items-list">
                    <!-- Extras items injected here -->
                </div>
                <div class="modal-footer">
                    <button onclick="addSelectedExtras()" class="checkout-btn"
                        style="width: 100%; padding: 1.2rem; background: var(--primary-orange); color: white; border: none; border-radius: 50px; font-weight: 700; font-size: 1.2rem;">Add
                        to Order</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Data from Database
        const dbMenuItems = <?php echo $productsJson; ?>;
    </script>
    <script src="script.js"></script>
</body>

</html>