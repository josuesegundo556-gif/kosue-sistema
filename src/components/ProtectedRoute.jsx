import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // Si no hay token, redirige al login inmediatamente
    if (!token) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

export default ProtectedRoute;