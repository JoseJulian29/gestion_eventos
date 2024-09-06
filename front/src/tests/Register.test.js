// src/components/Register.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios'); // Mock axios
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderRegister = () =>
  render(
    <Router>
      <Register />
    </Router>
  );

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the register form correctly', () => {
    renderRegister();
    
    // Verify the header and button
    const heading = screen.getByRole('heading', { name: /Registro/i });
    expect(heading).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    expect(submitButton).toBeInTheDocument();
    
    // Verify other fields
    expect(screen.getByLabelText(/Nombre de Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rol/i)).toBeInTheDocument();
  });

  test('should call axios.post and navigate on form submit if registration is successful', async () => {
    const mockNavigate = jest.fn();
    jest.mocked(require('react-router-dom').useNavigate).mockImplementation(() => mockNavigate);
    
    axios.post.mockResolvedValue({ data: { message: 'User registered successfully' } });
    renderRegister();
    
    fireEvent.change(screen.getByLabelText(/Nombre de Usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Rol/i), { target: { value: 'Organizador' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5001/api/auth/register', {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        role: 'Organizador',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('should show error message when registration fails', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Error registering user' } } });
    renderRegister();
    
    fireEvent.change(screen.getByLabelText(/Nombre de Usuario/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Rol/i), { target: { value: 'Organizador' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Error registering user/i)).toBeInTheDocument();
    });
  });
});
