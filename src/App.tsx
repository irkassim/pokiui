import  React from 'react';
//import { useEffect} from 'react';
import { BrowserRouter as Router, 
Route, Routes,
Navigate , BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import People from './pages/People';
import HomePage from './pages/HomePage';
import ProfileUpdate from './pages/ProfileUpdate';
import ErrorBoundary from './utils/ErrorBoundary';
//import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoutes';
import ProfilePage from './pages/Profile';


const App = () => {

/*    const navigate = useNavigate();
   const user = JSON.parse(localStorage.getItem('user') || '{}');
   useEffect(() => {
     if (!user?.isProfileComplete) {
       navigate('/profile/update'); // Redirect to Profile Update Page
     }
   }, [user, navigate]); */

  return (
    <Routes>
    <Route path="/" element={<HomePage />}>
      <Route index element={ <ProtectedRoute>
        <People />  
      </ProtectedRoute>
        } /> {/* Default content */}
       <Route path="profile/update" element={ <ProtectedRoute>
        <ErrorBoundary> <ProfileUpdate /></ErrorBoundary>
        
      </ProtectedRoute>
        } /> 
        <Route path="profile/user" element={ <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
        } />
      <Route path="home" element={
        <ProtectedRoute>
          <People />
        </ProtectedRoute>
        } />
       </Route>  
    
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
  </Routes>
    
  );
};

export default App;

