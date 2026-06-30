import { Router } from 'express';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../controllers/productos.controller.js';
import { login } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint de login (Público)
router.post('/login', login);

// Endpoints protegidos (TODOS ahora requieren Token para saber qué usuario interactúa)
router.get('/productos', verifyToken, getProductos);
router.post('/productos', verifyToken, createProducto);
router.put('/productos/:id', verifyToken, updateProducto);
router.delete('/productos/:id', verifyToken, deleteProducto);

export default router;