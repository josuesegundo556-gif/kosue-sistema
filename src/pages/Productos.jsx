import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    // MODIFICACIÓN: Añadido imagen_url al estado inicial del formulario
    const [form, setForm] = useState({ nombre: '', precio: '', stock: '', imagen_url: '' });
    const [editando, setEditando] = useState(null);
    const navigate = useNavigate();

    const cargarProductos = async () => {
        try {
            const res = await api.get('/productos');
            setProductos(res.data);
        } catch (err) {
            console.error("Error al cargar productos", err);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await api.put(`/productos/${editando}`, form);
                setEditando(null);
            } else {
                await api.post('/productos', form);
            }
            limpiarFormulario();
            cargarProductos();
        } catch (err) {
            alert("Error al guardar el producto");
        }
    };

    const limpiarFormulario = () => {
        // MODIFICACIÓN: Limpiar también el campo de imagen_url
        setForm({ nombre: '', precio: '', stock: '', imagen_url: '' });
        setEditando(null);
    };

    const prepararEdicion = (p) => {
        setEditando(p.id);
        // Aseguramos que si viene una imagen de la DB se cargue en el formulario, si no, vacío
        setForm({
            id: p.id,
            nombre: p.nombre || p.producto,
            precio: p.precio,
            stock: p.stock,
            imagen_url: p.imagen_url || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Eliminar producto?")) {
            await api.delete(`/productos/${id}`);
            cargarProductos();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{
            background: '#FFD8B1',
            minHeight: '100vh',
            padding: '40px 20px',
            fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}>

            <div style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '35px',
                maxWidth: '1000px',
                margin: 'auto',
                boxShadow: '0 20px 40px rgba(255, 112, 67, 0.15)'
            }}>

                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                    <h2 style={{ margin: 0, color: '#E65100', fontWeight: '800', fontSize: '28px' }}>
                        Mi Inventario
                    </h2>
                    <button onClick={handleLogout} style={btnHeader}>
                        Cerrar sesión
                    </button>
                </div>

                {/* FORMULARIO */}
                <div style={formBox}>
                    <h4 style={{ marginTop: 0, color: '#F57C00', marginBottom: '20px' }}>
                        {editando ? ' Editando Producto' : ' Nuevo Registro '}
                    </h4>

                    <form onSubmit={handleSubmit}>
                        {/* MODIFICACIÓN: Cambiado a un grid de 2x2 para acomodar el nuevo input */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            <div style={inputGroup}>
                                <label style={labelStyle}>Producto</label>
                                <input
                                    placeholder="Nombre del artículo"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={inputGroup}>
                                <label style={labelStyle}>Precio ($)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={form.precio}
                                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={inputGroup}>
                                <label style={labelStyle}>Stock</label>
                                <input
                                    type="number"
                                    placeholder="Cantidad"
                                    value={form.stock}
                                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* MODIFICACIÓN: Nuevo input para pegar la dirección de la foto */}
                            <div style={inputGroup}>
                                <label style={labelStyle}>Enlace de la Imagen (URL)</label>
                                <input
                                    type="text"
                                    placeholder="https://ejemplo.com/foto.jpg"
                                    value={form.imagen_url}
                                    onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" style={btnAgregar}>
                                {editando ? 'Actualizar' : 'Registrar'}
                            </button>

                            {editando && (
                                <button type="button" onClick={limpiarFormulario} style={btnCancelar}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* TABLA */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ color: '#FB8C00' }}>
                                <th style={thStyle}>Detalle</th>
                                <th style={thStyle}>Precio</th>
                                <th style={thStyle}>Stock</th>
                                <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {productos.map(p => (
                                <tr key={p.id} style={trStyle}>
                                    {/* MODIFICACIÓN: La celda de detalle ahora agrupa la miniatura de la imagen y el nombre alineados */}
                                    <td style={{ ...tdStyle, borderRadius: '12px 0 0 12px', fontWeight: '600', color: '#BF360C' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img
                                                src={p.imagen_url || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100'}
                                                alt={p.nombre}
                                                style={{
                                                    width: '45px',
                                                    height: '45px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    border: '1px solid #FFCC80',
                                                    background: '#FFF3E0'
                                                }}
                                                onError={(e) => {
                                                    // Salvavidas por si la URL que peguemos se rompe o está caída
                                                    e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100';
                                                }}
                                            />
                                            <span>{p.nombre || p.producto}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>${parseFloat(p.precio).toLocaleString()}</td>
                                    <td style={tdStyle}>
                                        <span style={badgeStock}>{p.stock} pzas</span>
                                    </td>
                                    <td style={{ ...tdStyle, borderRadius: '0 12px 12px 0', textAlign: 'right' }}>
                                        <button onClick={() => prepararEdicion(p)} style={btnEditar}>✏️</button>
                                        <button onClick={() => eliminar(p.id)} style={btnEliminar}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- ESTILOS TEMÁTICA NARANJA PASTEL ---
const formBox = {
    background: '#FFF3E0',
    borderRadius: '18px',
    padding: '25px',
    border: '1px solid #FFCC80',
    marginBottom: '30px'
};

const labelStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#E65100',
    textTransform: 'uppercase',
    marginBottom: '5px',
    display: 'block'
};

const inputGroup = { display: 'flex', flexDirection: 'column' };

const inputStyle = {
    padding: '12px',
    border: '2px solid #FFE0B2',
    borderRadius: '10px',
    background: '#FFFFFF',
    color: '#BF360C',
    fontSize: '14px',
    outline: 'none'
};

const btnAgregar = {
    background: '#FF964F',
    color: '#FFF',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '10px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(255, 150, 79, 0.3)'
};

const btnCancelar = {
    background: '#FFCCBC',
    color: '#BF360C',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer'
};

const btnHeader = {
    background: '#FFF',
    border: '1.5px solid #FFB74D',
    padding: '10px 20px',
    borderRadius: '12px',
    color: '#E65100',
    fontWeight: '700',
    cursor: 'pointer'
};

const badgeStock = {
    background: '#FFE0B2',
    padding: '6px 15px',
    borderRadius: '10px',
    color: '#E65100',
    fontSize: '13px',
    fontWeight: '700',
    border: '1px solid #FFB74D'
};

const thStyle = { textAlign: 'left', padding: '10px 15px', fontSize: '13px' };
const tdStyle = { padding: '15px', background: '#FFFFFF', verticalAlign: 'middle' };
const trStyle = { boxShadow: '0 2px 8px rgba(255, 150, 79, 0.08)' };
const btnEditar = { background: '#FFF3E0', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px' };
const btnEliminar = { background: '#FFEBEE', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' };

export default Productos;