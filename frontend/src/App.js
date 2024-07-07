import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavBarAdmin from './components/NavbarAdmin';
import Login from './pages/Login';
import './App.css';
import { AuthProvider, AuthContext } from '../src/contexts/AuthContext';
import Teams from './pages/Team';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
  <div className='app'>
    {isLoggedIn ? <NavBarAdmin /> : <Navbar />}
    <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
  </div>
      
   
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
