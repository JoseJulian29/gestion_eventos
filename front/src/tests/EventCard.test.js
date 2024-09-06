// src/components/EventCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from '../components/EventCard';
import { AuthContext } from '../context/AuthContext';
import EventModal from '../components/EventFormModal';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Mock the EventModal component
jest.mock('../components/EventFormModal', () => () => <div>Event Modal</div>);

describe('EventCard Component', () => {
  const event = {
    _id: '1',
    title: 'Test Event',
    banner: 'http://example.com/banner.jpg',
    dscription: 'Event description',
  };

  test('should render event details and the view details button', () => {
    render(
      <AuthContext.Provider value={{ user: { role: 'Participante' } }}>
        <EventCard event={event} onEdit={() => {}} onDelete={() => {}} />
      </AuthContext.Provider>
    );

    // Check if event details are rendered
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Event description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/banner.jpg');
    expect(screen.getByText('Ver Detalles')).toBeInTheDocument();
  });

  test('should call onEdit with the event when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <AuthContext.Provider value={{ user: { role: 'Organizador' } }}>
        <EventCard event={event} onEdit={mockOnEdit} onDelete={() => {}} />
      </AuthContext.Provider>
    );

    // Simulate button click
    fireEvent.click(screen.getByLabelText('Editar'));

    // Verify the callback was called with the correct event
    expect(mockOnEdit).toHaveBeenCalledWith(event);
  });

  test('should call onDelete with the event ID when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(
      <AuthContext.Provider value={{ user: { role: 'Taquilla' } }}>
        <EventCard event={event} onEdit={() => {}} onDelete={mockOnDelete} />
      </AuthContext.Provider>
    );

    // Simulate button click
    fireEvent.click(screen.getByLabelText('Eliminar'));

    // Verify the callback was called with the correct event ID
    expect(mockOnDelete).toHaveBeenCalledWith(event._id);
  });

  test('should not render edit and delete buttons for non-admin roles', () => {
    render(
      <AuthContext.Provider value={{ user: { role: 'Participante' } }}>
        <EventCard event={event} onEdit={() => {}} onDelete={() => {}} />
      </AuthContext.Provider>
    );

    // Check that edit and delete buttons are not present
    expect(screen.queryByLabelText('Editar')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Eliminar')).not.toBeInTheDocument();
  });

  test('should render edit and delete buttons for admin roles', () => {
    render(
      <AuthContext.Provider value={{ user: { role: 'Organizador' } }}>
        <EventCard event={event} onEdit={() => {}} onDelete={() => {}} />
      </AuthContext.Provider>
    );

    // Check that edit button is present
    expect(screen.getByLabelText('Editar')).toBeInTheDocument();
    expect(screen.queryByLabelText('Eliminar')).not.toBeInTheDocument();
  });

  test('should render delete button for taquilla role', () => {
    render(
      <AuthContext.Provider value={{ user: { role: 'Taquilla' } }}>
        <EventCard event={event} onEdit={() => {}} onDelete={() => {}} />
      </AuthContext.Provider>
    );

    // Check that delete button is present
    expect(screen.getByLabelText('Eliminar')).toBeInTheDocument();
  });
});
