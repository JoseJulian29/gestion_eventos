import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.get('http://localhost:5001/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(response => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      });
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      const { token, user } = response.data;
      console.log('Response Data:', response.data);

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
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
