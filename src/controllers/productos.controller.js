import { pool } from '../db.js';

// 1. OBTENER PRODUCTOS
export const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');

        const mappedRows = rows.map(item => ({
            id: item.id,
            producto: item.nombre || '',
            nombre: item.nombre || '',
            precio: item.precio || 0,
            stock: item.stock || 0,
            imagen_url: item.imagen_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200' // Imagen por defecto si no tiene
        }));

        return res.json(mappedRows);
    } catch (error) {
        console.error("Error GET:", error);
        return res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// 2. CREAR PRODUCTO 
export const createProducto = async (req, res) => {
    try {
        const entradaProducto = req.body.producto || req.body.nombre || 'Sin nombre';
        const entradaPrecio = req.body.precio ? parseFloat(req.body.precio) : 0.0;
        const entradaStock = req.body.stock ? parseInt(req.body.stock) : 0;
        // Capturamos la URL de la imagen que mande el frontend
        const entradaImagen = req.body.imagen_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200';

        let userId = null;
        const [users] = await pool.query('SELECT id FROM users LIMIT 1');
        if (users.length > 0) {
            userId = users[0].id;
        }

        // Insertamos incluyendo la nueva columna imagen_url
        const [result] = await pool.query(
            'INSERT INTO products (nombre, precio, stock, user_id, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [entradaProducto, entradaPrecio, entradaStock, userId, entradaImagen]
        );

        return res.json({
            id: result.insertId,
            producto: entradaProducto,
            nombre: entradaProducto,
            precio: entradaPrecio,
            stock: entradaStock,
            imagen_url: entradaImagen,
            user_id: userId
        });

    } catch (error) {
        console.error("Error POST:", error);
        return res.status(500).json({ message: 'Error interno en la base de datos', error: error.message });
    }
};

// 3. ACTUALIZAR PRODUCTO
export const updateProducto = async (req, res) => {
    const { id } = req.params;
    const nombreProd = req.body.producto || req.body.nombre;
    const precioProd = req.body.precio;
    const stockProd = req.body.stock;
    const imagenProd = req.body.imagen_url;

    try {
        const [result] = await pool.query(
            'UPDATE products SET nombre = ?, precio = ?, stock = ?, imagen_url = ? WHERE id = ?',
            [nombreProd, precioProd, stockProd, imagenProd, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error("Error PUT:", error);
        return res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

// 4. ELIMINAR PRODUCTO
export const deleteProducto = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error("Error DELETE:", error);
        return res.status(500).json({ message: 'Error al eliminar producto' });
    }
};