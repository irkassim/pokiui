import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
// Add this to avoid 'isolatedModules' error

