import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/productos');
        } catch (err) {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <div style={{
            background: '#FFD8B1', // Naranja Pastel Suave
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Segoe UI", Roboto, sans-serif'
        }}>

            <div style={{
                background: '#FFFFFF', 
                padding: '40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 20px 40px rgba(255, 150, 79, 0.2)' // Sombra naranja sutil
            }}>

                {/* TÍTULO */}
                <h2 style={{
                    textAlign: 'center',
                    color: '#FF7043', // Naranja fuerte para resaltar
                    marginBottom: '10px',
                    fontWeight: '800'
                }}>
                    Bienvenido
                </h2>
                <p style={{ 
                    textAlign: 'center', 
                    color: '#FFAB91', 
                    marginBottom: '30px',
                    fontSize: '14px' 
                }}>
                    Ingresa tus datos para continuar
                </p>

                {/* FORMULARIO */}
                <form onSubmit={handleLogin}>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={labelStyle}>Usuario</label>
                        <input
                            type="text"
                            placeholder="Tu nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={labelStyle}>Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button type="submit" style={btnLogin}>
                        Entrar al Sistema
                    </button>

                </form>

                {/* PIE */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '25px',
                    fontSize: '12px',
                    color: '#FFCCBC',
                    fontWeight: '600'
                }}>
                    SISTEMA DE GESTIÓN
                </p>

            </div>
        </div>
    );
};

// 🎨 ESTILOS UNIFICADOS (NARANJA PASTEL)
const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#FF8A65',
    fontSize: '13px',
    fontWeight: '700',
    textTransform: 'uppercase'
};

const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #FFECB3', // Amarillo/Naranja muy claro
    borderRadius: '12px',
    background: '#FFFFFF',
    color: '#BF360C',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease'
};

const btnLogin = {
    width: '100%',
    background: '#FF964F', // Naranja principal
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(255, 150, 79, 0.3)',
    transition: 'transform 0.2s ease'
};

export default Login;