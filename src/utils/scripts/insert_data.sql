-- 1. Insertar roles
INSERT INTO roles (name) VALUES
('admin'),
('customer'),
('vendor');

-- 2. Insertar estados de orden
INSERT INTO order_status (status) VALUES
('pending'),
('confirmed'),
('processing'),
('shipped'),
('delivered'),
('cancelled');

-- 3. Insertar estados de pago
INSERT INTO payment_status (status) VALUES
('pending'),
('paid'),
('failed'),
('refunded');

-- 4. Insertar métodos de pago
INSERT INTO payment_method (name) VALUES
('credit_card'),
('debit_card'),
('paypal'),
('bank_transfer');

-- 5. Insertar categorías
INSERT INTO category (name) VALUES
('Electrónicos'),
('Ropa'),
('Hogar'),
('Deportes'),
('Libros'),
('Juguetes');

-- 6. Insertar usuarios
INSERT INTO users (name, email, password, address, phone, country, city, roles) VALUES
('Admin User', 'admin@tienda.com', 'hashed_password_123', 'Calle Principal 123', '+1234567890', 'España', 'Madrid', 1),
('Juan Pérez', 'juan.perez@email.com', 'hashed_password_456', 'Avenida Central 456', '+1234567891', 'España', 'Barcelona', 2),
('María García', 'maria.garcia@email.com', 'hashed_password_789', 'Plaza Mayor 789', '+1234567892', 'España', 'Valencia', 2),
('Carlos López', 'carlos.lopez@email.com', 'hashed_password_101', 'Calle Secundaria 101', '+1234567893', 'España', 'Sevilla', 2);

-- 7. Insertar productos
INSERT INTO product (name, description, price, stock, imgUrl, category_id) VALUES
('iPhone 14', 'Smartphone Apple iPhone 14 con 128GB', 999.99, 50, '/images/iphone14.jpg', 1),
('Samsung Galaxy S23', 'Smartphone Samsung Galaxy S23 256GB', 849.99, 30, '/images/galaxy-s23.jpg', 1),
('Camiseta Básica', 'Camiseta de algodón 100% básica', 19.99, 100, '/images/camiseta-basica.jpg', 2),
('Zapatillas Running', 'Zapatillas deportivas para running', 79.99, 25, '/images/zapatillas-running.jpg', 4),
('Sartén Antiadherente', 'Sartén de 28cm antiadherente', 29.99, 40, '/images/sarten-antiadherente.jpg', 3),
('Libro de Cocina', 'Libro de recetas mediterráneas', 24.99, 15, '/images/libro-cocina.jpg', 5),
('Tablet Android', 'Tablet Android 10 pulgadas 64GB', 199.99, 20, '/images/tablet-android.jpg', 1),
('Jeans Slim Fit', 'Vaqueros slim fit color azul', 49.99, 60, '/images/jeans-slim.jpg', 2);

-- 8. Insertar carritos de compra
INSERT INTO cart (user_id) VALUES
(2), -- Juan Pérez
(3), -- María García
(4); -- Carlos López

-- 9. Insertar items en carritos
INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, created_by) VALUES
(1, 1, 1, 999.99, 2),   -- Juan tiene iPhone en carrito
(1, 3, 2, 19.99, 2),    -- Juan tiene 2 camisetas
(2, 2, 1, 849.99, 3),   -- María tiene Samsung
(2, 4, 1, 79.99, 3),    -- María tiene zapatillas
(3, 5, 1, 29.99, 4),    -- Carlos tiene sartén
(3, 6, 1, 24.99, 4);    -- Carlos tiene libro

-- 10. Insertar órdenes
INSERT INTO orders (user_id, order_number, total_amount, order_status, shipping_address, payment_status, payment_method) VALUES
(2, 'ORD-001', 1039.97, 4, 'Avenida Central 456, Barcelona', 2, 1),
(3, 'ORD-002', 929.98, 3, 'Plaza Mayor 789, Valencia', 2, 3),
(4, 'ORD-003', 54.98, 5, 'Calle Secundaria 101, Sevilla', 2, 2);

-- 11. Insertar items de órdenes
INSERT INTO order_items (order_id, product_id, cart_item_id, product_name, product_description, quantity, unit_price) VALUES
(1, 1, 1, 'iPhone 14', 'Smartphone Apple iPhone 14 con 128GB', 1, 999.99),
(1, 3, 2, 'Camiseta Básica', 'Camiseta de algodón 100% básica', 2, 19.99),
(2, 2, 3, 'Samsung Galaxy S23', 'Smartphone Samsung Galaxy S23 256GB', 1, 849.99),
(2, 4, 4, 'Zapatillas Running', 'Zapatillas deportivas para running', 1, 79.99),
(3, 5, 5, 'Sartén Antiadherente', 'Sartén de 28cm antiadherente', 1, 29.99),
(3, 6, 6, 'Libro de Cocina', 'Libro de recetas mediterráneas', 1, 24.99);

-- 12. Insertar historial de carritos
INSERT INTO cart_history (user_id, product_id, action, quantity, unit_price) VALUES
(2, 1, 'added', 1, 999.99),
(2, 3, 'added', 2, 19.99),
(2, 1, 'purchased', 1, 999.99),
(2, 3, 'purchased', 2, 19.99),
(3, 2, 'added', 1, 849.99),
(3, 4, 'added', 1, 79.99),
(3, 2, 'purchased', 1, 849.99),
(3, 4, 'purchased', 1, 79.99);

-- 13. Insertar historial de precios de productos
INSERT INTO product_price_history (product_id, old_price, new_price, changed_by) VALUES
(1, 949.99, 999.99, 1),    -- iPhone aumentó precio
(2, 899.99, 849.99, 1),    -- Samsung bajó precio
(3, 24.99, 19.99, 1),      -- Camiseta bajó precio
(4, 89.99, 79.99, 1);      -- Zapatillas bajó precio

-- 14. Consultas de verificación (opcional)
SELECT 'Roles insertados: ' || COUNT(*) FROM roles
UNION ALL
SELECT 'Usuarios insertados: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Productos insertados: ' || COUNT(*) FROM product
UNION ALL
SELECT 'Órdenes insertadas: ' || COUNT(*) FROM orders
UNION ALL
SELECT 'Items en carritos: ' || COUNT(*) FROM cart_items;