DROP DATABASE smartwatch_db;
CREATE DATABASE IF NOT EXISTS smartwatch_db;
USE smartwatch_db; 

-- users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(155) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE users ADD UNIQUE INDEX idx_email(email);

-- roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(155) UNIQUE NOT NULL
);

-- user_roles
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

-- permissions 
CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action_name VARCHAR(155) UNIQUE NOT NULL,
  action_code VARCHAR(155) UNIQUE NOT NULL
);

-- role_permissions 
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

-- user_addresses 
CREATE TABLE user_addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  apartment_number VARCHAR(155) NOT NULL,
  ward VARCHAR(255) NOT NULL,
  district VARCHAR(255) NOT NULL,
  city_province VARCHAR(255) NOT NULL,
  phone_number VARCHAR(155) NOT NULL,
  is_default BOOLEAN NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
ALTER TABLE user_addresses ADD INDEX idx_user_id(user_id);
ALTER TABLE user_addresses ADD INDEX idx_user_id_is_default(user_id, is_default);


-- providers
CREATE TABLE providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- goods_receipt_notes
CREATE TABLE goods_receipt_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  provider_id INT NOT NULL,
  staff_id INT NOT NULL,
  total_price_cents INT NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provider_id) REFERENCES providers(id),
  FOREIGN KEY (staff_id) REFERENCES users(id)
);
ALTER TABLE goods_receipt_notes ADD INDEX idx_provider_id(provider_id);
ALTER TABLE goods_receipt_notes ADD INDEX idx_staff_id(staff_id);

-- product_brands 
CREATE TABLE product_brands (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- product_categories
CREATE TABLE product_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- products
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  brand_id INT NOT NULL,
  model VARCHAR(255) UNIQUE NOT NULL,
  category_id INT NOT NULL,
  description TEXT NOT NULL,
  stop_selling BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (brand_id) REFERENCES product_brands(id),
  FOREIGN KEY (category_id) REFERENCES product_categories(id)
);
ALTER TABLE products ADD INDEX idx_name_model(name, model);
ALTER TABLE products ADD INDEX idx_stop_selling(stop_selling);
ALTER TABLE products ADD INDEX idx_brand_id(brand_id);
ALTER TABLE products ADD INDEX idx_category_id(category_id);

-- product_os
CREATE TABLE product_os (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

-- product_variations
CREATE TABLE product_variations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  watch_size_mm INT NOT NULL,
  watch_color VARCHAR(155) NOT NULL,
  stock_quantity INT DEFAULT 0, -- add trigger event
  price_cents INT DEFAULT 0,
  base_price_cents INT DEFAULT 0,
  image_name VARCHAR(255) DEFAULT "default.webp", -- find default image
  display_size_mm INT NOT NULL,
  display_type VARCHAR(155) NOT NULL,
  resolution_h_px INT NOT NULL,
  resolution_w_px INT NOT NULL,
  ram_bytes INT,
  rom_bytes INT,
  os_id INT NOT NULL,
  connectivity VARCHAR(255) NOT NULL,
  battery_life_mah INT NOT NULL,
  water_resistance_value INT,
  water_resistance_unit VARCHAR(155),
  sensor VARCHAR(155) NOT NULL,
  case_material VARCHAR(155) NOT NULL,
  band_material VARCHAR(155) NOT NULL,
  band_size_mm INT NOT NULL,
  band_color VARCHAR(155) NOT NULL,
  weight_milligrams INT NOT NULL,
  release_date DATETIME NOT NULL,
  stop_selling BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (os_id) REFERENCES product_os(id)
);
ALTER TABLE product_variations ADD INDEX idx_price_cents(price_cents);
ALTER TABLE product_variations ADD INDEX idx_product_id(product_id);
ALTER TABLE product_variations ADD INDEX idx_os_id(os_id);
ALTER TABLE product_variations ADD INDEX idx_stop_selling(stop_selling);


-- product_instances
CREATE TABLE product_instances (
  sku VARCHAR(255) PRIMARY KEY, -- SW-APL-S8-45-BLK-SIL
  product_variation_id INT NOT NULL, 
  goods_receipt_note_id INT NOT NULL,
  is_sold BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (product_variation_id) REFERENCES product_variations(id),
  FOREIGN KEY (goods_receipt_note_id) REFERENCES goods_receipt_notes(id)
);
ALTER TABLE product_instances ADD INDEX idx_product_variation_id(product_variation_id);
ALTER TABLE product_instances ADD INDEX idx_is_sold(is_sold);
ALTER TABLE product_instances ADD INDEX idx_variation_id_is_sold(product_variation_id, is_sold);
ALTER TABLE product_instances ADD INDEX idx_goods_id(goods_receipt_note_id);

-- carts
CREATE TABLE carts (
  user_id INT NOT NULL,
  product_variation_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_variation_id) REFERENCES product_variations(id),
  PRIMARY KEY (user_id, product_variation_id)
);
ALTER TABLE carts ADD INDEX idx_user_id(user_id);
ALTER TABLE carts ADD INDEX idx_product_variation_id(product_variation_id);


-- order_delivery_states
CREATE TABLE order_delivery_states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(155) UNIQUE NOT NULL
);

-- orders
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_cents INT NOT NULL,
  delivery_address VARCHAR(255),
  delivery_state_id INT NOT NULL,
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estimate_received_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  received_date TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (delivery_state_id) REFERENCES order_delivery_states(id)
);
ALTER TABLE orders ADD INDEX idx_user_id(user_id);
ALTER TABLE orders ADD INDEX idx_delivery_state_id(delivery_state_id);

-- order_items 
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_instance_sku VARCHAR(255) NOT NULL,
  price_cents INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_instance_sku) REFERENCES product_instances(sku)
);
ALTER TABLE order_items ADD INDEX idx_order_id(order_id);
ALTER TABLE order_items ADD INDEX idx_product_instance_sku(product_instance_sku);