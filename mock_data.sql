-- BECAUSE OF MOCKING, DATA CAN BE NOT REALISTIC BASE ON REALITY, USE WITH CAUTION ⚠️⚠️⚠️
USE smartwatch_db;

SET foreign_key_checks = 0;

-- DELETE ALL DATA IN TABLES ALSO RESET AUTO INCREMENT.

TRUNCATE TABLE role_permissions;
ALTER TABLE role_permissions AUTO_INCREMENT = 1;

TRUNCATE TABLE permissions;
ALTER TABLE permissions AUTO_INCREMENT = 1;

TRUNCATE TABLE order_items;
ALTER TABLE order_items AUTO_INCREMENT = 1;

TRUNCATE TABLE orders;
ALTER TABLE orders AUTO_INCREMENT = 1;

TRUNCATE TABLE user_addresses;
ALTER TABLE user_addresses AUTO_INCREMENT = 1;

TRUNCATE TABLE carts;
ALTER TABLE carts AUTO_INCREMENT = 1;

TRUNCATE TABLE user_roles;

TRUNCATE TABLE roles;
ALTER TABLE roles AUTO_INCREMENT = 1;

TRUNCATE TABLE order_delivery_states;
ALTER TABLE order_delivery_states AUTO_INCREMENT = 1;

TRUNCATE TABLE product_instances;

TRUNCATE TABLE goods_receipt_notes;
ALTER TABLE goods_receipt_notes AUTO_INCREMENT = 1;

TRUNCATE TABLE users;
ALTER TABLE users AUTO_INCREMENT = 1;

TRUNCATE TABLE providers;
ALTER TABLE providers AUTO_INCREMENT = 1;

TRUNCATE TABLE product_variations;
ALTER TABLE product_variations AUTO_INCREMENT = 1;

TRUNCATE TABLE product_os;
ALTER TABLE product_os AUTO_INCREMENT = 1;

TRUNCATE TABLE products;
ALTER TABLE products AUTO_INCREMENT = 1;

TRUNCATE TABLE product_brands;
ALTER TABLE product_brands AUTO_INCREMENT = 1;

TRUNCATE TABLE product_categories;
ALTER TABLE product_categories AUTO_INCREMENT = 1;


-- FUNDAMENTAL DATA OF "ORDER_DELIVERY_STATES, ROLES, PERMISSIONS" TABLES 🔑🔑🔑

INSERT INTO order_delivery_states (id, name) VALUES
  (1, 'order placed'),
  (2, 'order confirmed'),
  (3, 'processing'),
  (4, 'shipped'),
  (5, 'out for delivery'),
  (6, 'delivered'),
  (7, 'received'),
  (8, 'canceled'),
  (9, 'returned');


INSERT INTO roles (id, name, user_assigned, is_deleted) VALUES
  (1, 'admin', 1, '0'),
  (2, 'buyer', 5, '0');


INSERT INTO permissions (id, action_name, action_code) VALUES
  (1, 'create product', 'create_product'),
  (2, 'read product', 'read_product'),
  (3, 'update product', 'update_product'),
  (4, 'delete product', 'delete_product'),

  (5, 'create product brand', 'create_product_brand'),
  (6, 'read product brand', 'read_product_brand'),
  (7, 'update product brand', 'update_product_brand'),
  (8, 'delete product brand', 'delete_product_brand'),

  (9, 'create product category', 'create_product_category'),
  (10, 'read product category', 'read_product_category'),
  (11, 'update product category', 'update_product_category'),
  (12, 'delete product category', 'delete_product_category'),

  (13, 'create product os', 'create_product_os'),
  (14, 'read product os', 'read_product_os'),
  (15, 'update product os', 'update_product_os'),
  (16, 'delete product os', 'delete_product_os'),

  (17, 'create product variation', 'create_product_variation'),
  (18, 'read product variation', 'read_product_variation'),
  (19, 'update product variation', 'update_product_variation'),
  (20, 'delete product variation', 'delete_product_variation'),

  (21, 'create product instance', 'create_product_instance'),
  (22, 'read product instance', 'read_product_instance'),
  (23, 'update product instance', 'update_product_instance'),
  (24, 'delete product instance', 'delete_product_instance'),

  (25, 'create provider', 'create_provider'),
  (26, 'read provider', 'read_provider'),
  (27, 'update provider', 'update_provider'),
  (28, 'delete provider', 'delete_provider'),

  (29, 'create goods receipt note', 'create_goods_receipt_note'),
  (30, 'read goods receipt note', 'read_goods_receipt_note'),
  (31, 'update goods receipt note', 'update_goods_receipt_note'),
  (32, 'delete goods receipt note', 'delete_goods_receipt_note'),

  (33, 'create user', 'create_user'),
  (34, 'read user', 'read_user'),
  (35, 'update user', 'update_user'),
  (36, 'delete user', 'delete_user'),

  (37, 'create user address', 'create_user_address'),
  (38, 'read user address', 'read_user_address'),
  (39, 'update user address', 'update_user_address'),
  (40, 'delete user address', 'delete_user_address'),

  (41, 'create role', 'create_role'),
  (42, 'read role', 'read_role'),
  (43, 'update role', 'update_role'),
  (44, 'delete role', 'delete_role'),

  (45, 'read permission', 'read_permission'),

  (46, 'create cart', 'create_cart'),
  (47, 'read cart', 'read_cart'),
  (48, 'update cart', 'update_cart'),
  (49, 'delete cart', 'delete_cart'),

  (50, 'create order', 'create_order'),
  (51, 'read order', 'read_order'),
  (52, 'update order', 'update_order'),

  (53, 'read order delivery state', 'read_order_delivery_state');


INSERT INTO role_permissions (role_id, permission_id) VALUES
  -- Admin
  ('1', '1'),
  ('1', '2'),
  ('1', '3'),
  ('1', '4'),
  ('1', '5'),
  ('1', '6'),
  ('1', '7'),
  ('1', '8'),
  ('1', '9'),
  ('1', '10'),
  ('1', '11'),
  ('1', '12'),
  ('1', '13'),
  ('1', '14'),
  ('1', '15'),
  ('1', '16'),
  ('1', '17'),
  ('1', '18'),
  ('1', '19'),
  ('1', '20'),
  ('1', '21'),
  ('1', '22'),
  ('1', '23'),
  ('1', '24'),
  ('1', '25'),
  ('1', '26'),
  ('1', '27'),
  ('1', '28'),
  ('1', '29'),
  ('1', '30'),
  ('1', '31'),
  ('1', '32'),
  ('1', '33'),
  ('1', '34'),
  ('1', '35'),
  ('1', '36'),
  ('1', '37'),
  ('1', '38'),
  ('1', '39'),
  ('1', '40'),
  ('1', '41'),
  ('1', '42'),
  ('1', '43'),
  ('1', '44'),
  ('1', '45'),
  ('1', '46'),
  ('1', '47'),
  ('1', '48'),
  ('1', '49'),
  ('1', '50'),
  ('1', '51'),
  ('1', '52'),
  ('1', '53'),

  -- Buyer
  ('2', '34'),
  ('2', '35'),
  ('2', '36'),

  ('2', '37'),
  ('2', '38'),
  ('2', '39'),
  ('2', '40'),

  ('2', '46'),
  ('2', '47'),
  ('2', '48'),
  ('2', '49'),

  ('2', '50'),
  ('2', '51'),
  ('2', '52'),
  ('2', '53'),

  ('2', '2'),
  ('2', '6'),
  ('2', '10'),
  ('2', '14'),
  ('2', '18');

INSERT INTO users (id, full_name, email, phone_number, password, is_deleted) VALUES
  (1, 'admin', 'admin@gmail.com', '0900000000', '$2y$10$0VGoQdPBGr4Vava90ibLpumZHa6aJAAFUtltS5kKBOwT53M7fM9Bu', 0); -- Plain password for admin: password123456789


-- MOCKING DATA 🛢🛢🛢

/*
Mock 5 users with:
  - id: from 1-n (auto-increment).
  - phone_number: VN phone number.
  - password:
    + hashed.
    + also write a plain password as a comment for me.
    + password contains at least a letter + a number + length >= 15.
  - is_deleted: is false.
*/
INSERT INTO users (id, full_name, email, phone_number, password, is_deleted) VALUES
  (2, 'Nguyen Van A', 'nguyenvana@example.com', '0912345678', '$2y$10$aCwdx9CZVwJ1.jH9U3Mygeiiq9jJWKKpgJX7WzQ45VPFXwYqM4KAC', 0),
  (3, 'Tran Thi B', 'tranthib@example.com', '0987654321', '$2y$10$RKJcljZNU2Gj8TmCk9dQ6u8JhmKGlwJ99p3xVEmV9QsJZJlzj3r4e', 0),
  (4, 'Le Van C', 'levanc@example.com', '0934567890', '$2y$10$4wJvKe.wZS.F4UJUN.zKXuJ.fKtpTjK8PkKTsz3rKZdCwgJB2.tq', 0),
  (5, 'Pham Thi D', 'phamthid@example.com', '0976543210', '$2y$10$jUAI9jJj9RQwYJvnB7H9MO9jJ.ZKvhj9H9Wm.w9HL.mE9jF9j9j2', 0),
  (6, 'Hoang Van E', 'hoangvane@example.com', '0923456789', '$2y$10$XjM0hZ9j.AI9j.AI9j.AI9u9j.AI9j.AI9j.AI9j.AI9j.AI9', 0);

/*
Mock n addresses based on users table, each user has at least 2 or 3 addresses with one is a default:
  - id: from 1-n.
  - user_id: from users table.
  - is_default, is_deleted: is false.
*/
INSERT INTO user_addresses (id, name, user_id, street, apartment_number, ward, district, city_province, phone_number, is_default, is_deleted) VALUES
  (1, 'Home', 2, '123 Main St', 'Apt 1', 'Ward 1', 'District 1', 'Ho Chi Minh City', '0901234567', 0, 0),
  (4, 'Home', 2, '321 Pine St', 'Apt 4', 'Ward 4', 'District 4', 'Ho Chi Minh City', '0904567890', 1, 0),
  (5, 'Office', 2, '654 Maple St', 'Apt 5', 'Ward 5', 'District 5', 'Ho Chi Minh City', '0905678901', 0, 0),

  (2, 'Office', 3, '456 Elm St', 'Apt 2', 'Ward 2', 'District 2', 'Ho Chi Minh City', '0902345678', 0, 0),
  (6, 'Home', 3, '987 Cherry St', 'Apt 6', 'Ward 6', 'District 6', 'Ho Chi Minh City', '0906789012', 1, 0),
  (7, 'Office', 3, '147 Birch St', 'Apt 7', 'Ward 7', 'District 7', 'Ho Chi Minh City', '0907890123', 0, 0),
  (8, 'Second home', 3, '258 Willow St', 'Apt 8', 'Ward 8', 'District 8', 'Ho Chi Minh City', '0908901234', 0, 0),

  (3, 'Second home', 4, '789 Oak St', 'Apt 3', 'Ward 3', 'District 3', 'Ho Chi Minh City', '0903456789', 0, 0),
  (9, 'Home', 4, '369 Cedar St', 'Apt 9', 'Ward 9', 'District 9', 'Ho Chi Minh City', '0909012345', 1, 0),
  (10, 'Office', 4, '159 Alpha St', 'Apt 10', 'Ward 10', 'District 10', 'Ho Chi Minh City', '0910123456', 0, 0),

  (11, 'Home', 5, '753 Beta St', 'Apt 11', 'Ward 11', 'District 11', 'Ho Chi Minh City', '0911234567', 1, 0),
  (12, 'Office', 5, '951 Gamma St', 'Apt 12', 'Ward 12','District 11' , 'Ho Chi Minh City', '0912345678', 0, 0),
  (13, 'Second home', 5, '864 Delta St', 'Apt 13', 'Ward 13', 'Thu Duc City', 'Ho Chi Minh City', '0913456789', 0, 0),

  (14, 'Home', 6, '246 Epsilon St', 'Apt 14', 'Ward 14', 'Binh Thanh District', 'Ho Chi Minh City', '0914567890', 1, 0),
  (15, 'Office', 6, '852 Zeta St', 'Apt 15', 'Ward 15', 'Go Vap District', 'Ho Chi Minh City', '0915678901', 0, 0);

INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 1), -- Admin
  (2, 2),
  (3, 2),
  (4, 2),
  (5, 2),
  (6, 2);

-- Mock 10 of smartwatch/smartband brands.
INSERT INTO product_brands (id, name, is_deleted) VALUES
  (1, 'Apple', 0),
  (2, 'Samsung', 0),
  (3, 'Fitbit', 0),
  (4, 'Garmin', 0),
  (5, 'Huawei', 0),
  (6, 'Xiaomi', 0),
  (7, 'Amazfit', 0),
  (8, 'Fossil', 0),
  (9, 'Casio', 0),
  (10, 'Suunto', 0),
  (11, 'Google', 0),
  (12, 'OnePlus', 0);

-- Mock 10 of smartwatch/smartband categories.
INSERT INTO product_categories (id, name, is_deleted) VALUES
  (1, 'Smartwatch', 0),
  (2, 'Fitness Tracker', 0),
  (3, 'Hybrid Watch', 0),
  (4, 'Luxury Watch', 0),
  (5, 'Outdoor Watch', 0),
  (6, 'Kids Watch', 0),
  (7, 'Health Watch', 0),
  (8, 'Sports Watch', 0),
  (9, 'Classic Watch', 0),
  (10, 'Fashion Watch', 0);

-- Mock 20 of smartwatch/smartband OS.
INSERT INTO product_os (id, name, is_deleted) VALUES
  (1, 'watchOS', 0),
  (2, 'Tizen', 0),
  (3, 'Wear OS', 0),
  (4, 'Fitbit OS', 0),
  (5, 'Garmin OS', 0),
  (6, 'HarmonyOS', 0),
  (7, 'Zepp OS', 0),
  (8, 'Amazfit OS', 0),
  (9, 'Fossil OS', 0),
  (10, 'Casio OS', 0),
  (11, 'Suunto OS', 0),
  (12, 'Polar OS', 0),
  (13, 'Pebble OS', 0),
  (14, 'Realme OS', 0),
  (15, 'OnePlus OS', 0),
  (16, 'Oppo OS', 0),
  (17, 'Xiaomi OS', 0),
  (18, 'Huawei Lite OS', 0),
  (19, 'Samsung One UI Watch', 0),
  (20, 'Google Pixel Watch OS', 0);


/*
Mock 10 products:
  - id: from 1-n.
  - brand_id: taken from product_brands table.
  - category_id: taken from product_categories table.
  - image_name: is null.
  - stop_selling: is false.
  - is_deleted: is false.
*/
INSERT INTO products (id, name, brand_id, model, category_id, description, image_name, stop_selling, is_deleted) VALUES
  (1, 'Apple Watch Series 8', 1, 'S8', 1, 'Latest Apple smartwatch with advanced health features.', NULL, 0, 0),
  (2, 'Samsung Galaxy Watch 5', 2, 'GW5', 1, 'Samsung smartwatch with durable design and health tracking.', NULL, 0, 0),
  (3, 'Fitbit Charge 5', 3, 'C5', 2, 'Fitness tracker with heart rate monitoring and GPS.', NULL, 0, 0),
  (4, 'Garmin Fenix 7', 4, 'F7', 5, 'Outdoor smartwatch with GPS and long battery life.', NULL, 0, 0),
  (5, 'Huawei Watch GT 3', 5, 'GT3', 1, 'Stylish smartwatch with health and fitness tracking.', NULL, 0, 0),
  (6, 'Xiaomi Mi Band 7', 6, 'MB7', 2, 'Affordable fitness tracker with AMOLED display.', NULL, 0, 0),
  (7, 'Amazfit GTR 4', 7, 'GTR4', 1, 'Smartwatch with long battery life and fitness features.', NULL, 0, 0),
  (8, 'Fossil Gen 6', 8, 'G6', 3, 'Hybrid smartwatch with classic design and smart features.', NULL, 0, 0),
  (9, 'Casio Pro Trek', 9, 'PT', 5, 'Outdoor watch with rugged design and GPS.', NULL, 0, 0),
  (10, 'Suunto 9 Peak', 10, 'S9P', 5, 'Premium outdoor watch with advanced tracking features.', NULL, 0, 0),
  (11, 'Google Pixel Watch 2', 11, 'PW2', 1, 'Google Pixel Watch 2 with Wear OS and advanced health tracking.', NULL, 0, 0),
  (12, 'OnePlus Watch 2', 12, 'OW2', 1, 'OnePlus Watch 2 with long battery life and Wear OS.', NULL, 0, 0),
  (13, 'Garmin Venu 3', 4, 'VN3', 7, 'Garmin Venu 3 health and fitness smartwatch with AMOLED display.', NULL, 0, 0),
  (14, 'Xiaomi Smart Band 8 Pro', 6, 'S8P', 2, 'Xiaomi Smart Band 8 Pro with large AMOLED display and GPS.', NULL, 0, 0),
  (15, 'Apple Watch Ultra 2', 1, 'WU2', 5, 'Apple Watch Ultra 2, rugged and capable for endurance athletes and adventurers.', NULL, 0, 0);

/*
1.
Mock n variations from products table, each of product has at least 3-4 variations:
  - id: from 1-n.
  - product_id: taken from products table.
  - watch_color, band_color: hex code.
  - stock_quantity: leave at -1.
  - price_cents, base_price_cents: US dollar cents.
  - image_name: is null.
  - os_id: taken from product_os table.
  - stop_selling, is_deleted: is false.

2.
Base on product_instances table, modify manually the stock_quantity for each variation.
*/
INSERT INTO product_variations (
  id, product_id, watch_size_mm, watch_color, stock_quantity, price_cents, base_price_cents, image_name, display_size_mm, display_type,
  resolution_h_px, resolution_w_px, ram_bytes, rom_bytes, os_id, connectivity, battery_life_mah, water_resistance_value, water_resistance_unit,
  sensor, case_material, band_material, band_size_mm, band_color, weight_milligrams, release_date, stop_selling, is_deleted
) VALUES
  (1, 1, 45, '#000000', 5, 39900, 34900, NULL, 1.9, 'OLED', 396, 484, 1024000, 32768000, 1, 'Bluetooth, Wi-Fi', 308, 50, 'meters', 'Heart Rate, ECG', 'Aluminum', 'Silicone', 22, '#ffffff', 32000, '2022-09-16', 0, 0),
  (2, 1, 41, '#ffffff', 5, 34900, 29900, NULL, 1.7, 'OLED', 352, 430, 1024000, 32768000, 1, 'Bluetooth, Wi-Fi', 284, 50, 'meters', 'Heart Rate, ECG', 'Aluminum', 'Silicone', 20, '#000000', 29000, '2022-09-16', 0, 0),
  (3, 2, 44, '#808080', 5, 32900, 29900, NULL, 1.4, 'Super AMOLED', 450, 450, 1536000, 8192000, 19, 'Bluetooth, Wi-Fi', 361, 50, 'meters', 'Heart Rate, SpO2', 'Stainless Steel', 'Leather', 22, '#A52A2A', 28000, '2022-08-26', 0, 0),
  (4, 2, 40, '#0000ff', 5, 29900, 26900, NULL, 1.2, 'Super AMOLED', 396, 396, 1536000, 8192000, 19, 'Bluetooth, Wi-Fi', 284, 50, 'meters', 'Heart Rate, SpO2', 'Stainless Steel', 'Silicone', 20, '#ffd700', 26000, '2022-08-26', 0, 0),
  (5, 3, 40, '#FF4500', 5, 17900, 15900, NULL, 1.04, 'AMOLED', 260, 260, 0, 0, 4, 'Bluetooth', 200, 50, 'meters', 'Heart Rate, GPS', 'Plastic', 'Rubber', 18, '#32CD32', 24000, '2021-09-27', 0, 0),
  (6, 3, 40, '#8a2be2', 5, 19900, 17900, NULL, 1.04, 'AMOLED', 260, 260, 0, 0, 4, 'Bluetooth', 200, 50, 'meters', 'Heart Rate, GPS', 'Plastic', 'Rubber', 18, '#FF69B4', 24000, '2021-09-27', 0, 0),
  (7, 4, 47, '#708090', 5, 69900, 64900, NULL, 1.3, 'MIP', 260, 260, 0, 0, 5, 'Bluetooth, GPS', 500, 100, 'meters', 'Heart Rate, Altimeter', 'Titanium', 'Nylon', 24, '#000000', 53000, '2022-01-18', 0, 0),
  (8, 4, 47, '#2f4f4f', 5, 74900, 69900, NULL, 1.3, 'MIP', 260, 260, 0, 0, 5, 'Bluetooth, GPS', 500, 100, 'meters', 'Heart Rate, Altimeter', 'Titanium', 'Silicone', 24, '#8b0000', 53000, '2022-01-18', 0, 0),
  (9, 5, 46, '#ffd700', 5, 39900, 36900, NULL, 1.43, 'AMOLED', 466, 466, 0, 0, 6, 'Bluetooth, GPS', 455, 50, 'meters', 'Heart Rate, SpO2', 'Stainless Steel', 'Leather', 22, '#8B4513', 42000, '2021-10-22', 0, 0),
  (10, 5, 46, '#dc143c', 5, 42900, 39900, NULL, 1.43, 'AMOLED', 466, 466, 0, 0, 6, 'Bluetooth, GPS', 455, 50, 'meters', 'Heart Rate, SpO2', 'Stainless Steel', 'Silicone', 22, '#000000', 42000, '2021-10-22', 0, 0),
  (11, 6, 40, '#ff6347', 5, 4990, 4590, NULL, 1.62, 'AMOLED', 192, 490, 0, 0, 17, 'Bluetooth', 180, 50, 'meters', 'Heart Rate, SpO2', 'Plastic', 'Rubber', 18, '#4682b4', 13000, '2022-05-24', 0, 0),
  (12, 6, 40, '#4682b4', 5, 5290, 4990, NULL, 1.62, 'AMOLED', 192, 490, 0, 0, 17, 'Bluetooth', 180, 50, 'meters', 'Heart Rate, SpO2', 'Plastic', 'Rubber', 18, '#ff6347', 13000, '2022-05-24', 0, 0),
  (13, 7, 46, '#000000', 5, 19900, 17900, NULL, 1.39, 'AMOLED', 454, 454, 0, 0, 7, 'Bluetooth, GPS', 475, 50, 'meters', 'Heart Rate, SpO2', 'Aluminum', 'Leather', 22, '#ffffff', 32000, '2022-09-01', 0, 0),
  (14, 7, 46, '#ffffff', 9, 21900, 19900, NULL, 1.39, 'AMOLED', 454, 454, 0, 0, 7, 'Bluetooth, GPS', 475, 50, 'meters', 'Heart Rate, SpO2', 'Aluminum', 'Silicone', 22, '#000000', 32000, '2022-09-01', 0, 0),
  (15, 8, 44, '#a9a9a9', 5, 29900, 27900, NULL, 1.28, 'AMOLED', 416, 416, 1024000, 8192000, 3, 'Bluetooth, Wi-Fi', 310, 30, 'meters', 'Heart Rate, SpO2', 'Stainless Steel', 'Leather', 22, '#8B4513', 36000, '2021-08-30', 0, 0),
  (16, 8, 44, '#696969', 5, 31900, 29900, NULL, 1.28, 'AMOLED', 416, 416, 1024000, 8192000, 3, 'Bluetooth, Wi-Fi', 310, 30, 'meters', 'Heart Rate, SpO2', 'Stainless Steel', 'Silicone', 22, '#000000', 36000, '2021-08-30', 0, 0),
  (17, 9, 50, '#556b2f', 5, 49900, 46900, NULL, 1.32, 'MIP', 240, 240, 0, 0, 10, 'Bluetooth, GPS', 600, 100, 'meters', 'Altimeter, Barometer', 'Resin', 'Nylon', 24, '#8b0000', 67000, '2020-06-15', 0, 0),
  (18, 9, 50, '#8b0000', 6, 52900, 49900, NULL, 1.32, 'MIP', 240, 240, 0, 0, 10, 'Bluetooth, GPS', 600, 100, 'meters', 'Altimeter, Barometer', 'Resin', 'Silicone', 24, '#556b2f', 67000, '2020-06-15', 0, 0),
  (19, 10, 43, '#4682b4', 5, 59900, 56900, NULL, 1.2, 'AMOLED', 240, 240, 0, 0, 11, 'Bluetooth, GPS', 300, 100, 'meters', 'Heart Rate, SpO2', 'Titanium', 'Leather', 22, '#ffd700', 45000, '2021-05-20', 0, 0),
  (20, 10, 43, '#ffd700', 8, 62900, 59900, NULL, 1.2, 'AMOLED', 240, 240, 0, 0, 11, 'Bluetooth, GPS', 300, 100, 'meters', 'Heart Rate, SpO2', 'Titanium', 'Silicone', 22, '#4682b4', 45000, '2021-05-20', 0, 0),
  (21, 11, 41, '#000000', 4, 34900, 32900, NULL, 30, 'AMOLED', 384, 384, 2048000, 32768000, 20, 'Bluetooth, Wi-Fi, LTE', 306, 50, 'meters', 'Heart Rate, ECG, SpO2, EDA', 'Aluminum', 'Fluoroelastomer', 20, '#1F1F1F', 31000, '2023-10-12', 0, 0),
  (22, 11, 41, '#E0E0E0', 4, 34900, 32900, NULL, 30, 'AMOLED', 384, 384, 2048000, 32768000, 20, 'Bluetooth, Wi-Fi, LTE', 306, 50, 'meters', 'Heart Rate, ECG, SpO2, EDA', 'Aluminum', 'Fluoroelastomer', 20, '#F0EBE0', 31000, '2023-10-12', 0, 0),
  (23, 12, 47, '#202124', 6, 29900, 27900, NULL, 36, 'AMOLED', 466, 466, 2048000, 32768000, 3, 'Bluetooth, Wi-Fi, LTE', 500, 50, 'meters', 'Heart Rate, SpO2, GPS', 'Stainless Steel', 'Fluororubber', 22, '#000000', 49000, '2024-02-26', 0, 0);

/*
1.
Mock n instances from product_variations table, each variation has one instance:
  - sku:
    + formatted with "category-brand-model-watch_size-watch_color-band_material-millisecs-created", example: "sw-app-s8-45-000000-sil-1746033627".
    + category, model, watch_size: 2 chars.
    + brand, band_material: 3 chars.
    + watch_color: remove # symbol of hex code.
    + millisecs-created: milliseconds.
  - product_variation_id: taken from product_variations table.
  - supplier_serial_number: unique for each.
  - supplier_imei_number: can be null depend on product or variation.
  - goods_receipt_note_id: is null.
  - is_sold, is_deleted: is false.

2.
For each instances, duplicate it to 5-10 times:
  - remember sku, supplier_serial_number, supplier_imei_number(if has) are unique.
*/
INSERT INTO product_instances (sku, product_variation_id, supplier_serial_number, supplier_imei_number, goods_receipt_note_id, is_sold, is_deleted) VALUES
  -- Variation id 1: 6
  ('sw-app-s8-45-000000-sil-1746033627000', 1, 'SN1234567890010', NULL, NULL, 1, 0),
  ('sw-app-s8-45-000000-sil-1746033627001', 1, 'SN1234567890011', NULL, NULL, 0, 0),
  ('sw-app-s8-45-000000-sil-1746033627002', 1, 'SN1234567890012', NULL, NULL, 0, 0),
  ('sw-app-s8-45-000000-sil-1746033627003', 1, 'SN1234567890013', NULL, NULL, 0, 0),
  ('sw-app-s8-45-000000-sil-1746033627004', 1, 'SN1234567890014', NULL, NULL, 0, 0),
  ('sw-app-s8-45-000000-sil-1746033627005', 1, 'SN1234567890015', NULL, NULL, 0, 0),
  -- Variation id 2: 6
  ('sw-app-s8-41-ffffff-sil-1746033628000', 2, 'SN1234567890020', NULL, NULL, 1, 0),
  ('sw-app-s8-41-ffffff-sil-1746033628001', 2, 'SN1234567890021', NULL, NULL, 0, 0),
  ('sw-app-s8-41-ffffff-sil-1746033628002', 2, 'SN1234567890022', NULL, NULL, 0, 0),
  ('sw-app-s8-41-ffffff-sil-1746033628003', 2, 'SN1234567890023', NULL, NULL, 0, 0),
  ('sw-app-s8-41-ffffff-sil-1746033628004', 2, 'SN1234567890024', NULL, NULL, 0, 0),
  ('sw-app-s8-41-ffffff-sil-1746033628005', 2, 'SN1234567890025', NULL, NULL, 0, 0),
  -- Variation id 3: 6
  ('sw-sam-gw-44-808080-lea-1746033629000', 3, 'SN1234567890030', NULL, NULL, 1, 0),
  ('sw-sam-gw-44-808080-lea-1746033629001', 3, 'SN1234567890031', NULL, NULL, 0, 0),
  ('sw-sam-gw-44-808080-lea-1746033629002', 3, 'SN1234567890032', NULL, NULL, 0, 0),
  ('sw-sam-gw-44-808080-lea-1746033629003', 3, 'SN1234567890033', NULL, NULL, 0, 0),
  ('sw-sam-gw-44-808080-lea-1746033629004', 3, 'SN1234567890034', NULL, NULL, 0, 0),
  ('sw-sam-gw-44-808080-lea-1746033629005', 3, 'SN1234567890035', NULL, NULL, 0, 0),
  -- Variation id 4: 6
  ('sw-sam-gw-40-0000ff-sil-1746033630000', 4, 'SN1234567890040', NULL, NULL, 1, 0),
  ('sw-sam-gw-40-0000ff-sil-1746033630001', 4, 'SN1234567890041', NULL, NULL, 0, 0),
  ('sw-sam-gw-40-0000ff-sil-1746033630002', 4, 'SN1234567890042', NULL, NULL, 0, 0),
  ('sw-sam-gw-40-0000ff-sil-1746033630003', 4, 'SN1234567890043', NULL, NULL, 0, 0),
  ('sw-sam-gw-40-0000ff-sil-1746033630004', 4, 'SN1234567890044', NULL, NULL, 0, 0),
  ('sw-sam-gw-40-0000ff-sil-1746033630005', 4, 'SN1234567890045', NULL, NULL, 0, 0),
  -- Variation id 5: 6
  ('ft-fit-c5-40-ff4500-rub-1746033631000', 5, 'SN1234567890050', NULL, NULL, 1, 0),
  ('ft-fit-c5-40-ff4500-rub-1746033631001', 5, 'SN1234567890051', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-ff4500-rub-1746033631002', 5, 'SN1234567890052', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-ff4500-rub-1746033631003', 5, 'SN1234567890053', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-ff4500-rub-1746033631004', 5, 'SN1234567890054', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-ff4500-rub-1746033631005', 5, 'SN1234567890055', NULL, NULL, 0, 0),
  -- Variation id 6: 6
  ('ft-fit-c5-40-8a2be2-rub-1746033632000', 6, 'SN1234567890060', NULL, NULL, 1, 0),
  ('ft-fit-c5-40-8a2be2-rub-1746033632001', 6, 'SN1234567890061', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-8a2be2-rub-1746033632002', 6, 'SN1234567890062', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-8a2be2-rub-1746033632003', 6, 'SN1234567890063', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-8a2be2-rub-1746033632004', 6, 'SN1234567890064', NULL, NULL, 0, 0),
  ('ft-fit-c5-40-8a2be2-rub-1746033632005', 6, 'SN1234567890065', NULL, NULL, 0, 0),
  -- Variation id 7: 6
  ('ow-gar-f7-47-708090-nyl-1746033633000', 7, 'SN1234567890070', NULL, NULL, 1, 0),
  ('ow-gar-f7-47-708090-nyl-1746033633001', 7, 'SN1234567890071', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-708090-nyl-1746033633002', 7, 'SN1234567890072', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-708090-nyl-1746033633003', 7, 'SN1234567890073', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-708090-nyl-1746033633004', 7, 'SN1234567890074', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-708090-nyl-1746033633005', 7, 'SN1234567890075', NULL, NULL, 0, 0),
  -- Variation id 8: 6
  ('ow-gar-f7-47-2f4f4f-sil-1746033634000', 8, 'SN1234567890080', NULL, NULL, 1, 0),
  ('ow-gar-f7-47-2f4f4f-sil-1746033634001', 8, 'SN1234567890081', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-2f4f4f-sil-1746033634002', 8, 'SN1234567890082', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-2f4f4f-sil-1746033634003', 8, 'SN1234567890083', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-2f4f4f-sil-1746033634004', 8, 'SN1234567890084', NULL, NULL, 0, 0),
  ('ow-gar-f7-47-2f4f4f-sil-1746033634005', 8, 'SN1234567890085', NULL, NULL, 0, 0),
  -- Variation id 9: 6
  ('sw-hua-gt-46-ffd700-lea-1746033635000', 9, 'SN1234567890090', NULL, NULL, 1, 0),
  ('sw-hua-gt-46-ffd700-lea-1746033635001', 9, 'SN1234567890091', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-ffd700-lea-1746033635002', 9, 'SN1234567890092', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-ffd700-lea-1746033635003', 9, 'SN1234567890093', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-ffd700-lea-1746033635004', 9, 'SN1234567890094', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-ffd700-lea-1746033635005', 9, 'SN1234567890095', NULL, NULL, 0, 0),
  -- Variation id 10: 6
  ('sw-hua-gt-46-dc143c-sil-1746033636000', 10, 'SN1234567890100', NULL, NULL, 1, 0),
  ('sw-hua-gt-46-dc143c-sil-1746033636001', 10, 'SN1234567890101', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-dc143c-sil-1746033636002', 10, 'SN1234567890102', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-dc143c-sil-1746033636003', 10, 'SN1234567890103', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-dc143c-sil-1746033636004', 10, 'SN1234567890104', NULL, NULL, 0, 0),
  ('sw-hua-gt-46-dc143c-sil-1746033636005', 10, 'SN1234567890105', NULL, NULL, 0, 0),
  -- Variation id 11: 6
  ('ft-xia-mb-40-ff6347-rub-1746033637000', 11, 'SN1234567890110', NULL, NULL, 1, 0),
  ('ft-xia-mb-40-ff6347-rub-1746033637001', 11, 'SN1234567890111', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-ff6347-rub-1746033637002', 11, 'SN1234567890112', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-ff6347-rub-1746033637003', 11, 'SN1234567890113', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-ff6347-rub-1746033637004', 11, 'SN1234567890114', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-ff6347-rub-1746033637005', 11, 'SN1234567890115', NULL, NULL, 0, 0),
  -- Variation id 12: 6
  ('ft-xia-mb-40-4682b4-rub-1746033638000', 12, 'SN1234567890120', NULL, NULL, 1, 0),
  ('ft-xia-mb-40-4682b4-rub-1746033638001', 12, 'SN1234567890121', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-4682b4-rub-1746033638002', 12, 'SN1234567890122', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-4682b4-rub-1746033638003', 12, 'SN1234567890123', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-4682b4-rub-1746033638004', 12, 'SN1234567890124', NULL, NULL, 0, 0),
  ('ft-xia-mb-40-4682b4-rub-1746033638005', 12, 'SN1234567890125', NULL, NULL, 0, 0),
  -- Variation id 13: 6
  ('sw-ama-gr-46-000000-lea-1746033639000', 13, 'SN1234567890130', NULL, NULL, 1, 0),
  ('sw-ama-gr-46-000000-lea-1746033639001', 13, 'SN1234567890131', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-000000-lea-1746033639002', 13, 'SN1234567890132', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-000000-lea-1746033639003', 13, 'SN1234567890133', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-000000-lea-1746033639004', 13, 'SN1234567890134', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-000000-lea-1746033639005', 13, 'SN1234567890135', NULL, NULL, 0, 0),
  -- Variation id 14: 10
  ('sw-ama-gr-46-ffffff-sil-1746033640000', 14, 'SN1234567890140', NULL, NULL, 1, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640001', 14, 'SN1234567890141', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640002', 14, 'SN1234567890142', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640003', 14, 'SN1234567890143', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640004', 14, 'SN1234567890144', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640005', 14, 'SN1234567890145', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640006', 14, 'SN1234567890146', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640007', 14, 'SN1234567890147', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640008', 14, 'SN1234567890148', NULL, NULL, 0, 0),
  ('sw-ama-gr-46-ffffff-sil-1746033640009', 14, 'SN1234567890149', NULL, NULL, 0, 0),
  -- Variation id 15: 6
  ('hy-fos-g6-44-a9a9a9-lea-1746033641000', 15, 'SN1234567890150', NULL, NULL, 1, 0),
  ('hy-fos-g6-44-a9a9a9-lea-1746033641001', 15, 'SN1234567890151', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-a9a9a9-lea-1746033641002', 15, 'SN1234567890152', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-a9a9a9-lea-1746033641003', 15, 'SN1234567890153', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-a9a9a9-lea-1746033641004', 15, 'SN1234567890154', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-a9a9a9-lea-1746033641005', 15, 'SN1234567890155', NULL, NULL, 0, 0),
  -- Variation id 16: 6
  ('hy-fos-g6-44-696969-sil-1746033642000', 16, 'SN1234567890160', NULL, NULL, 1, 0),
  ('hy-fos-g6-44-696969-sil-1746033642001', 16, 'SN1234567890161', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-696969-sil-1746033642002', 16, 'SN1234567890162', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-696969-sil-1746033642003', 16, 'SN1234567890163', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-696969-sil-1746033642004', 16, 'SN1234567890164', NULL, NULL, 0, 0),
  ('hy-fos-g6-44-696969-sil-1746033642005', 16, 'SN1234567890165', NULL, NULL, 0, 0),
  -- Variation id 17: 6
  ('ow-cas-pt-50-556b2f-nyl-1746033643000', 17, 'SN1234567890170', NULL, NULL, 1, 0),
  ('ow-cas-pt-50-556b2f-nyl-1746033643001', 17, 'SN1234567890171', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-556b2f-nyl-1746033643002', 17, 'SN1234567890172', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-556b2f-nyl-1746033643003', 17, 'SN1234567890173', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-556b2f-nyl-1746033643004', 17, 'SN1234567890174', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-556b2f-nyl-1746033643005', 17, 'SN1234567890175', NULL, NULL, 0, 0),
  -- Variation id 18: 7
  ('ow-cas-pt-50-8b0000-sil-1746033644000', 18, 'SN1234567890180', NULL, NULL, 1, 0),
  ('ow-cas-pt-50-8b0000-sil-1746033644001', 18, 'SN1234567890181', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-8b0000-sil-1746033644002', 18, 'SN1234567890182', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-8b0000-sil-1746033644003', 18, 'SN1234567890183', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-8b0000-sil-1746033644004', 18, 'SN1234567890184', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-8b0000-sil-1746033644005', 18, 'SN1234567890185', NULL, NULL, 0, 0),
  ('ow-cas-pt-50-8b0000-sil-1746033644006', 18, 'SN1234567890186', NULL, NULL, 0, 0),
  -- Variation id 19: 6
  ('ow-suu-s9-43-4682b4-lea-1746033645000', 19, 'SN1234567890190', NULL, NULL, 1, 0),
  ('ow-suu-s9-43-4682b4-lea-1746033645001', 19, 'SN1234567890191', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-4682b4-lea-1746033645002', 19, 'SN1234567890192', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-4682b4-lea-1746033645003', 19, 'SN1234567890193', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-4682b4-lea-1746033645004', 19, 'SN1234567890194', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-4682b4-lea-1746033645005', 19, 'SN1234567890195', NULL, NULL, 0, 0),
  -- Variation id 20: 10
  ('ow-suu-s9-43-ffd700-sil-1746033646000', 20, 'SN1234567890200', NULL, NULL, 1, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646001', 20, 'SN1234567890201', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646002', 20, 'SN1234567890202', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646003', 20, 'SN1234567890203', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646004', 20, 'SN1234567890204', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646005', 20, 'SN1234567890205', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646006', 20, 'SN1234567890205', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646007', 20, 'SN1234567890205', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646008', 20, 'SN1234567890205', NULL, NULL, 0, 0),
  ('ow-suu-s9-43-ffd700-sil-1746033646009', 20, 'SN1234567890205', NULL, NULL, 0, 0),
  -- Variation 21 (Google Pixel Watch 2, Black): 5 instances
  ('SW-GOO-PW2-41-000000-FEL-1750000000001', 21, 'SN2000000000001', '352000000000001', NULL, 1, 0),
  ('SW-GOO-PW2-41-000000-FEL-1750000000002', 21, 'SN2000000000002', '352000000000002', NULL, 0, 0),
  ('SW-GOO-PW2-41-000000-FEL-1750000000003', 21, 'SN2000000000003', '352000000000003', NULL, 0, 0),
  ('SW-GOO-PW2-41-000000-FEL-1750000000004', 21, 'SN2000000000004', '352000000000004', NULL, 0, 0),
  ('SW-GOO-PW2-41-000000-FEL-1750000000005', 21, 'SN2000000000005', '352000000000005', NULL, 0, 0),
  -- Variation 22 (Google Pixel Watch 2, Silver): 5 instances
  ('SW-GOO-PW2-41-E0E0E0-FEL-1750000000006', 22, 'SN2000000000006', '352000000000006', NULL, 1, 0),
  ('SW-GOO-PW2-41-E0E0E0-FEL-1750000000007', 22, 'SN2000000000007', '352000000000007', NULL, 0, 0),
  ('SW-GOO-PW2-41-E0E0E0-FEL-1750000000008', 22, 'SN2000000000008', '352000000000008', NULL, 0, 0),
  ('SW-GOO-PW2-41-E0E0E0-FEL-1750000000009', 22, 'SN2000000000009', '352000000000009', NULL, 0, 0),
  ('SW-GOO-PW2-41-E0E0E0-FEL-1750000000010', 22, 'SN2000000000010', '352000000000010', NULL, 0, 0);

-- ADDING MOCK CART DATA --
INSERT INTO carts (user_id, product_variation_id, quantity) VALUES
  (2, 23, 1), -- User 2, OnePlus Watch 2 (Var ID 23), Qty 1
  (3, 24, 2), -- User 3, OnePlus Watch 2 (Var ID 24), Qty 2
  (4, 25, 1); -- User 4, Garmin Venu 3 (Var ID 25), Qty 1

-- ADDING MOCK ORDER DATA --
-- Orders (20 total, 10 received)
INSERT INTO orders (id, user_id, total_cents, delivery_address_id, delivery_state_id, order_date, estimate_received_date, received_date) VALUES
  -- Received Orders (State 7)
  (1, 2, 39900, 4, 7, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 5 DAY),
  (2, 3, 67800, 6, 7, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 6 DAY),
  (3, 4, 29900, 9, 7, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 4 DAY),
  (4, 5, 17900, 11, 7, NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 7 DAY),
  (5, 6, 19900, 14, 7, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 3 DAY),
  (6, 2, 69900, 1, 7, NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 8 DAY),
  (7, 3, 74900, 2, 7, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 2 DAY),
  (8, 4, 39900, 3, 7, NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 9 DAY),
  (9, 5, 42900, 12, 7, NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 0 DAY, NOW() - INTERVAL 1 DAY),
  (10, 6, 4990, 15, 7, NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 10 DAY),
  -- Other States
  (11, 2, 5290, 5, 6, NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY), -- Delivered
  (12, 3, 19900, 7, 5, NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 2 DAY, NULL), -- Out for Delivery
  (13, 4, 21900, 10, 4, NOW() - INTERVAL 1 DAY, NOW() + INTERVAL 2 DAY, NULL), -- Shipped
  (14, 5, 29900, 13, 3, NOW(), NOW() + INTERVAL 3 DAY, NULL), -- Processing
  (15, 6, 31900, 14, 2, NOW(), NOW() + INTERVAL 3 DAY, NULL), -- Confirmed
  (16, 2, 49900, 4, 1, NOW(), NOW() + INTERVAL 3 DAY, NULL), -- Placed
  (17, 3, 52900, 8, 6, NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 0 DAY, NOW() - INTERVAL 2 DAY), -- Delivered
  (18, 4, 59900, 9, 5, NOW() - INTERVAL 2 DAY, NOW() + INTERVAL 1 DAY, NULL), -- Out for Delivery
  (19, 5, 62900, 11, 4, NOW(), NOW() + INTERVAL 3 DAY, NULL), -- Shipped
  (20, 6, 69800, 15, 3, NOW(), NOW() + INTERVAL 3 DAY, NULL); -- Processing

-- ADDING MOCK ORDER ITEM DATA --
INSERT INTO order_items (order_id, product_instance_sku, price_cents) VALUES
  -- Order 1
  (1, 'sw-app-s8-45-000000-sil-1746033627000', 39900),
  -- Order 2
  (2, 'sw-app-s8-41-ffffff-sil-1746033628000', 34900),
  (2, 'sw-sam-gw-44-808080-lea-1746033629000', 32900),
  -- Order 3
  (3, 'sw-sam-gw-40-0000ff-sil-1746033630000', 29900),
  -- Order 4
  (4, 'ft-fit-c5-40-ff4500-rub-1746033631000', 17900),
  -- Order 5
  (5, 'ft-fit-c5-40-8a2be2-rub-1746033632000', 19900),
  -- Order 6
  (6, 'ow-gar-f7-47-708090-nyl-1746033633000', 69900),
  -- Order 7
  (7, 'ow-gar-f7-47-2f4f4f-sil-1746033634000', 74900),
  -- Order 8
  (8, 'sw-hua-gt-46-ffd700-lea-1746033635000', 39900),
  -- Order 9
  (9, 'sw-hua-gt-46-dc143c-sil-1746033636000', 42900),
  -- Order 10
  (10, 'ft-xia-mb-40-ff6347-rub-1746033637000', 4990),
  -- Order 11
  (11, 'ft-xia-mb-40-4682b4-rub-1746033638000', 5290),
  -- Order 12
  (12, 'sw-ama-gr-46-000000-lea-1746033639000', 19900),
  -- Order 13
  (13, 'sw-ama-gr-46-ffffff-sil-1746033640000', 21900),
  -- Order 14
  (14, 'hy-fos-g6-44-a9a9a9-lea-1746033641000', 29900),
  -- Order 15
  (15, 'hy-fos-g6-44-696969-sil-1746033642000', 31900),
  -- Order 16
  (16, 'ow-cas-pt-50-556b2f-nyl-1746033643000', 49900),
  -- Order 17
  (17, 'ow-cas-pt-50-8b0000-sil-1746033644000', 52900),
  -- Order 18
  (18, 'ow-suu-s9-43-4682b4-lea-1746033645000', 59900),
  -- Order 19
  (19, 'ow-suu-s9-43-ffd700-sil-1746033646000', 62900),
  -- Order 20
  (20, 'SW-GOO-PW2-41-000000-FEL-1750000000001', 34900),
  (20, 'SW-GOO-PW2-41-E0E0E0-FEL-1750000000006', 34900);

SET foreign_key_checks = 1;
