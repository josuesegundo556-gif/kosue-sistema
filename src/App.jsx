import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Productos from './pages/Productos';
// Prueba quitando las llaves si te sigue marcando error 500
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Si entran a la raíz, mandarlos al Login directamente */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/productos" element={
          <ProtectedRoute>
            <Productos />
          </ProtectedRoute>
        } />
        
        {/* Ruta por si escriben cualquier otra cosa, que no se vea blanco */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;