import express from 'express';
import cors from 'cors';
import productoRoutes from './routes/productos.routes.js';

const app = express();

app.use(cors()); // Importante para que React se conecte
app.use(express.json());
app.use('/api', productoRoutes);

export default app;