use smartwatch_db;

-- product_brands
insert into product_brands (name) values
('apple'), ('samsung'), ('garmin'), ('fitbit'), ('huawei');

-- product_categories
insert into product_categories (name) values
('smartwatch'), ('fitness tracker'), ('gps watch'), ('kids watch');

-- products
insert into products (name, brand_id, model, category_id, description) values
('apple watch series 8', 1, 's8-45', 1, 'the latest apple watch with advanced health features.'),
('samsung galaxy watch 5', 2, 'gw5-44', 1, "samsung's flagship smartwatch with rotating bezel."),
('garmin forerunner 955', 3, 'fr955', 3, 'a premium gps watch for serious runners.'),
('fitbit sense 2', 4, 's2', 2, 'advanced health and fitness tracker with stress management.'),
('huawei watch gt 3', 5, 'wgt3-46', 1, 'stylish smartwatch with long battery life.');

-- product_os
insert into product_os (name) values
('watchos'), ('wear os'), ('garmin os'), ('fitbit os'), ('harmonyos');

-- product_variations
insert into product_variations (product_id, watch_size_mm, watch_color, stock_quantity, price_cents, display_size_mm, display_type, resolution_h_px, resolution_w_px, ram_bytes, rom_bytes, os_id, connectivity, battery_life_mah, water_resistance_value, water_resistance_unit, sensor, case_material, band_material, band_size_mm, band_color, weight_milligrams, release_date) values
(1, 45, 'black', 10, 49900, 45, 'oled', 396, 484, 1024, 32768, 1, 'bluetooth, wi-fi, cellular', 18, 50, 'meters', 'ecg, spo2, heart rate', 'aluminum', 'silicone', 200, 'black', 32000, '2022-09-07'),
(2, 44, 'silver', 5, 39900, 44, 'amoled', 396, 396, 1536, 16384, 2, 'bluetooth, wi-fi, cellular', 40, 50, 'meters', 'ecg, bia, heart rate', 'aluminum', 'leather', 220, 'brown', 30000, '2022-08-10'),
(3, 47, 'black', 20, 54900, 47, 'memory-in-pixel', 260, 260, null, null, 3, 'bluetooth, ant+', 120, 100, 'meters', 'gps, heart rate, barometer', 'fiber-reinforced polymer', 'silicone', 240, 'black', 53000, '2022-06-01'),
(4, 40, 'blue', 15, 29900, 40, 'amoled', 336, 336, null, null, 4, 'bluetooth, wi-fi', 60, 50, 'meters', 'eda, spo2, heart rate', 'aluminum', 'silicone', 180, 'blue', 25000, '2022-08-25'),
(5, 46, 'black', 8, 34900, 46, 'amoled', 466, 466, 128, 4096, 5, 'bluetooth, wi-fi', 14, 50, 'meters', 'heart rate, spo2', 'stainless steel', 'fluoroelastomer', 220, 'black', 48000, '2022-07-15');


-- product_instances  (example skus - adjust as needed)
insert into product_instances (sku, product_variation_id) values
('sw-apl-s8-45-blk-sil', 1),
('sw-sam-gw5-44-sil-lea', 2),
('sw-gar-fr955-47-blk-sil', 3),
('sw-fit-s2-40-blu-sil', 4),
('sw-hua-wgt3-46-blk-flu', 5);

-- users (remember to hash passwords securely)
insert into users (full_name, email, phone_number, password) values
('john doe', 'john.doe@example.com', '123-456-7890', 'hashed_password_1'),
('jane smith', 'jane.smith@example.com', '987-654-3210', 'hashed_password_2');

-- roles
insert into roles (name) values
('admin'), ('customer');

-- user_roles
insert into user_roles (user_id, role_id) values
(1, 1),  -- john doe is an admin
(2, 2);  -- jane smith is a customer

-- permissions
insert into permissions (action_name, action_code) values
('manage products', 'product_manage'),
('place orders', 'order_place'),
('view orders', 'order_view');

-- role_permissions
insert into role_permissions (role_id, permission_id) values
(1, 1), -- admin can manage products
(1, 2), -- admin can place orders
(1, 3), -- admin can view orders
(2, 2), -- customer can place orders
(2, 3); -- customer can view orders

-- user_addresses
insert into user_addresses (user_id, name, street, apartment_number, ward, district, city_province, country, phone_number, is_default) values
(1, 'john doe home', '123 main st', 'apt 1', 'ward 1', 'district 1', 'ho chi minh city', 'vietnam', '123-456-7890', 1),
(2, 'jane smith office', '456 oak ave', 'suite 200', 'ward 2', 'district 2', 'hanoi', 'vietnam', '987-654-3210', 1);

-- carts (example - jane smith adds an apple watch to her cart)
insert into carts (user_id, product_variation_id, quantity) values
(2, 1, 1);

-- order_delivery_states
insert into order_delivery_states (name) values
('pending'), ('shipped'), ('delivered'), ('cancelled');

-- orders (example - jane smith places an order)
insert into orders (user_id, delivery_address_id, delivery_state_id, estimate_received_date) values
(2, 2, 1, '2023-11-20 10:00:00'); -- example estimated date

-- order_items (relating to the order above)
insert into order_items (order_id, product_instance_sku, price_cents) values
(1, 'sw-apl-s8-45-blk-sil', 49900); -- price of the apple watch variation