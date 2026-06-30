import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Importante para leer el .env

export const login = async (req, res) => {
    // Aplicamos .trim() para asegurar que no se vayan espacios ocultos en el formulario
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    try {
        // Buscamos al usuario únicamente por su nombre de usuario o por su correo electrónico
        const [rows] = await pool.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (rows.length > 0) {
            const user = rows[0];

            // CORRECCIÓN: Comparamos directamente en texto plano saltándonos brypt
            if (password === user.password) {
                // USAMOS LA LLAVE DEL .ENV
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.json({ token });
            } else {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
        } else {
            return res.status(401).json({ message: "El usuario no existe" });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};