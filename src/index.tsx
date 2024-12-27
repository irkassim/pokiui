import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import {UsersProvider} from '../src/context/UsersContext';
import { FeaturesProvider } from './context/FeaturesContext';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <BrowserRouter>
    {/* <FeaturesProvider> */}  
    <UsersProvider>
    <AuthProvider>
      <App />
      </AuthProvider> 
      </UsersProvider> 
      {/* <FeaturesProvider> */}  
      </BrowserRouter>
     
  
  </React.StrictMode>
);


