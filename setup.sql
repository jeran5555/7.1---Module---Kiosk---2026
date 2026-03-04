-- Database creation
CREATE DATABASE IF NOT EXISTS healthy_restaurant;
USE healthy_restaurant;

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Table: images
CREATE TABLE IF NOT EXISTS images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    description TEXT
);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    image_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    kcal INT,
    available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (image_id) REFERENCES images(image_id)
);

-- Table: order_status
CREATE TABLE IF NOT EXISTS order_status (
    order_status_id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_status_id INT,
    pickup_number VARCHAR(10),
    price_total DECIMAL(10, 2),
    datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_status_id) REFERENCES order_status(order_status_id)
);

-- Table: order_product
CREATE TABLE IF NOT EXISTS order_product (
    order_id INT,
    product_id INT,
    price DECIMAL(10, 2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Insert categories
INSERT INTO categories (name) VALUES 
('Breakfast'),
('Lunch & Dinner'),
('Handhelds (Wraps & Sandwiches)'),
('Sides & Small Plates'),
('Signature Dips'),
('Drinks');

-- Insert images (placeholder URLs for now)
INSERT INTO images (filename, description) VALUES 
('acai_bowl.png', 'Morning Boost Açaí Bowl'),
('garden_wrap.png', 'The Garden Breakfast Wrap'),
('peanut_toast.png', 'Peanut Butter & Cacao Toast'),
('overnight_oats.png', 'Overnight Oats: Apple Pie Style'),
('tofu_bowl.png', 'Tofu Power Tahini Bowl'),
('supergreen_harvest.png', 'The Supergreen Harvest'),
('falafel_bowl.png', 'Mediterranean Falafel Bowl'),
('teriyaki_tempeh.png', 'Warm Teriyaki Tempeh Bowl'),
('chickpea_wrap.png', 'Zesty Chickpea Hummus Wrap'),
('avocado_toastie.png', 'Avocado & Halloumi Toastie'),
('jackfruit_slider.png', 'Smoky BBQ Jackfruit Slider'),
('sweet_potato_wedges.png', 'Oven-Baked Sweet Potato Wedges'),
('zucchini_fries.png', 'Zucchini Fries'),
('falafel_bites.png', 'Baked Falafel Bites'),
('veggie_platter.png', 'Mini Veggie Platter & Hummus'),
('classic_hummus.png', 'Classic Hummus'),
('avocado_crema.png', 'Avocado Lime Crema'),
('yogurt_ranch.png', 'Greek Yogurt Ranch'),
('sriracha_mayo.png', 'Spicy Sriracha Mayo'),
('peanut_satay.png', 'Peanut Satay Sauce'),
('green_glow.png', 'Green Glow Smoothie'),
('matcha_latte.png', 'Iced Matcha Latte'),
('infused_water.png', 'Fruit-Infused Water'),
('berry_blast.png', 'Berry Blast Smoothie'),
('citrus_cooler.png', 'Citrus Cooler');

-- Insert products
-- Breakfast (category_id = 1)
INSERT INTO products (category_id, image_id, name, description, price, kcal) VALUES 
(1, 1, 'Morning Boost Açaí Bowl (VG)', 'A chilled blend of açaí and banana topped with crunchy granola, chia seeds, and coconut.', 7.50, 320),
(1, 2, 'The Garden Breakfast Wrap (V)', 'Whole-grain wrap with fluffy scrambled eggs, baby spinach, and a light yogurt-herb sauce.', 6.50, 280),
(1, 3, 'Peanut Butter & Cacao Toast (VG)', 'Sourdough toast with 100% natural peanut butter, banana, and a sprinkle of cacao nibs.', 5.00, 240),
(1, 4, 'Overnight Oats: Apple Pie Style (VG)', 'Oats soaked in almond milk with grated apple, cinnamon, and crushed walnuts.', 5.50, 290);

-- Lunch & Dinner (category_id = 2)
INSERT INTO products (category_id, image_id, name, description, price, kcal) VALUES 
(2, 5, 'Tofu Power Tahini Bowl (VG)', 'Tri-color quinoa, maple-glazed tofu, roasted sweet potatoes, and kale with tahini dressing.', 10.50, 480),
(2, 6, 'The Supergreen Harvest (VG)', 'Massaged kale, edamame, avocado, cucumber, and toasted pumpkin seeds with lemon-olive oil.', 9.50, 310),
(2, 7, 'Mediterranean Falafel Bowl (VG)', 'Baked falafel, hummus, pickled red onions, cherry tomatoes, and cucumber on a bed of greens.', 10.00, 440),
(2, 8, 'Warm Teriyaki Tempeh Bowl (VG)', 'Steamed brown rice, seared tempeh, broccoli, and shredded carrots with a ginger-soy glaze.', 11.00, 500);

-- Handhelds (Wraps & Sandwiches) (category_id = 3)
INSERT INTO products (category_id, image_id, name, description, price, kcal) VALUES 
(3, 9, 'Zesty Chickpea Hummus Wrap (VG)', 'Spiced chickpeas, shredded carrots, crisp lettuce, and signature hummus in a whole-wheat wrap.', 8.50, 410),
(3, 10, 'Avocado & Halloumi Toastie (V)', 'Grilled halloumi cheese, smashed avocado, and chili flakes on thick-cut multi-grain bread.', 9.00, 460),
(3, 11, 'Smoky BBQ Jackfruit Slider (VG)', 'Pulled jackfruit in BBQ sauce with a crunchy purple slaw on a vegan brioche bun.', 7.50, 350);

-- Sides & Small Plates (category_id = 4)
INSERT INTO products (category_id, image_id, name, description, price, kcal) VALUES 
(4, 12, 'Oven-Baked Sweet Potato Wedges (VG)', 'Seasoned with smoked paprika. (Best with Avocado Lime Dip).', 4.50, 260),
(4, 13, 'Zucchini Fries (V)', 'Crispy breaded zucchini sticks. (Best with Greek Yogurt Ranch).', 4.50, 190),
(4, 14, 'Baked Falafel Bites - 5pcs (VG)', 'Crispy baked falafel balls served with a side of hummus.', 5.00, 230),
(4, 15, 'Mini Veggie Platter & Hummus (VG)', 'Fresh crunch: Celery, carrots, and cucumber.', 4.00, 160);

-- Signature Dips (category_id = 5)
INSERT INTO products (category_id, image_id, name, description, price, kcal) VALUES 
(5, 16, 'Classic Hummus (VG)', 'Our signature creamy hummus.', 1.00, 120),
(5, 17, 'Avocado Lime Crema (VG)', 'Creamy avocado with Zesty Lime.', 1.00, 110),
(5, 18, 'Greek Yogurt Ranch (V)', 'Refreshing yogurt ranch.', 1.00, 90),
(5, 19, 'Spicy Sriracha Mayo (VG)', 'A kick of heat.', 1.00, 180),
(5, 20, 'Peanut Satay Sauce (VG)', 'Rich and savory peanut sauce.', 1.00, 200);

-- Drinks (category_id = 6)
INSERT INTO products (category_id, image_id, name, description, price, kcal) VALUES 
(6, 21, 'Green Glow Smoothie (VG)', 'Spinach, pineapple, cucumber, and coconut water.', 3.50, 120),
(6, 22, 'Iced Matcha Latte (VG)', 'Lightly sweetened matcha green tea with almond milk.', 3.00, 90),
(6, 23, 'Fruit-Infused Water (VG)', 'Freshly infused water with a choice of lemon-mint, strawberry-basil, or cucumber-lime.', 1.50, 0),
(6, 24, 'Berry Blast Smoothie (VG)', 'A creamy blend of strawberries, blueberries, and raspberries with almond milk.', 3.80, 140),
(6, 25, 'Citrus Cooler (VG)', 'A refreshing mix of orange juice, sparkling water, and a hint of lime.', 3.00, 90);

-- Insert order statuses
INSERT INTO order_status (description) VALUES 
('Started'),
('Placed and paid'),
('Preparing'),
('Ready for pickup'),
('Picked up');
