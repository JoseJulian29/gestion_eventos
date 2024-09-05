import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const response = await axios.get('http://localhost:5001/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);

      return user;
    } catch (error) {
      throw new Error('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
