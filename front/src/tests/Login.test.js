import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { AuthContext } from '../context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const mockLogin = jest.fn();

const renderLogin = () =>
  render(
    <Router>
      <AuthContext.Provider value={{ login: mockLogin }}>
        <Login />
      </AuthContext.Provider>
    </Router>
  );

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the login form correctly', () => {
    renderLogin();
    
    // Verify the header and button
    const heading = screen.getByRole('heading', { name: /Iniciar Sesión/i });
    expect(heading).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });
    expect(submitButton).toBeInTheDocument();
    
    // Verify other fields
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  test('should call login and navigate on form submit if login is successful', async () => {
    mockLogin.mockResolvedValue({ role: 'User' });
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  test('should show error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Credenciales inválidas'));
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar Sesión/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});
