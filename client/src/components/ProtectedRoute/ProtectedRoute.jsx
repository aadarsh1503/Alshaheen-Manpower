import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ ES Module safe import

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/alshaheen-pro-login" replace />;
  }

  try {
    const decoded = jwtDecode(token); // ✅ This works
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('adminToken');
      alert("Session expired. Please login again.");
      return <Navigate to="/alshaheen-pro-login" replace />;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('adminToken');
    return <Navigate to="/alshaheen-pro-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
