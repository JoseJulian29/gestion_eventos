// Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

describe('Navbar Component', () => {
  it('should display "Iniciar Sesión" button when user is not logged in', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Verifica que el botón "Iniciar Sesión" esté presente
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('should display user name and "Cerrar Sesión" button when user is logged in', () => {
    const mockUser = { username: 'Juan', role: 'Admin' };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser, logout: jest.fn() }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Verifica que el saludo con el nombre del usuario esté presente
    expect(screen.getByText('Hola, Juan')).toBeInTheDocument();

    // Verifica que el botón "Cerrar Sesión" esté presente
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
  });

  it('should call the logout function when "Cerrar Sesión" button is clicked', () => {
    const mockLogout = jest.fn();
    const mockUser = { username: 'Juan', role: 'Admin' };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser, logout: mockLogout }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // Simula el click en el botón "Cerrar Sesión"
    fireEvent.click(screen.getByText('Cerrar Sesión'));

    // Verifica que la función logout haya sido llamada
    expect(mockLogout).toHaveBeenCalled();
  });
});
