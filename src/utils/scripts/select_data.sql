-- 1. Ver productos por categoría
SELECT c.name as categoria, p.name as producto, p.price as precio
FROM product p
JOIN category c ON p.category_id = c.id
ORDER BY c.name, p.name;

-- 2. Ver carritos de usuarios con items
SELECT u.name as usuario, p.name as producto, ci.quantity as cantidad, ci.unit_price as precio_unitario
FROM cart_items ci
JOIN cart c ON ci.cart_id = c.id
JOIN users u ON c.user_id = u.id
JOIN product p ON ci.product_id = p.id;

-- 3. Ver órdenes completas con detalles
SELECT 
    o.order_number,
    u.name as cliente,
    os.status as estado_orden,
    ps.status as estado_pago,
    pm.name as metodo_pago,
    o.total_amount as total
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_status os ON o.order_status = os.id
JOIN payment_status ps ON o.payment_status = ps.id
JOIN payment_method pm ON o.payment_method = pm.id;

-- 4. Ver items de una orden específica
SELECT 
    oi.product_name,
    oi.quantity,
    oi.unit_price,
    oi.subtotal
FROM order_items oi
WHERE oi.order_id = 1;

-- 5. Historial de precios de productos
SELECT 
    p.name as producto,
    ph.old_price as precio_anterior,
    ph.new_price as precio_nuevo,
    ph.changed_at as fecha_cambio
FROM product_price_history ph
JOIN product p ON ph.product_id = p.id
ORDER BY ph.changed_at DESC;