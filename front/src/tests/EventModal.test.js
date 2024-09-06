// src/tests/EventModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventModal from '../components/EventModal';

jest.mock('react-icons/fa', () => ({
  FaTimes: () => <svg data-testid="fa-times-icon" /> // Mock as an SVG or any other element that doesn't create nesting issues
}));

describe('EventModal Component', () => {
  const event = {
    banner: 'http://example.com/banner.jpg',
    title: 'Test Event',
    description: 'Event description',
    date: '2024-09-01T00:00:00Z',
    time: '18:00',
    location: 'Event Location',
    category: 'Event Category',
    createdBy: 'Admin',
  };

  test('should call onClose when the close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<EventModal event={event} onClose={mockOnClose} />);

    // Simulate button click
    fireEvent.click(screen.getByTestId('fa-times-icon'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should call onClose when clicking outside the modal', () => {
    const mockOnClose = jest.fn();
    render(<EventModal event={event} onClose={mockOnClose} />);

    // Simulate clicking outside the modal
    fireEvent.mouseDown(document.body);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('should not render modal if no event is provided', () => {
    const { container } = render(<EventModal event={null} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
