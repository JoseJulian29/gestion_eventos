// src/components/SearchBar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

describe('SearchBar Component', () => {
  test('should render the search input correctly', () => {
    render(<SearchBar setSearchQuery={() => {}} />);

    // Verify that the input is rendered
    const input = screen.getByPlaceholderText(/Buscar eventos.../i);
    expect(input).toBeInTheDocument();
  });

  test('should call setSearchQuery with the input value when changed', () => {
    const mockSetSearchQuery = jest.fn();
    render(<SearchBar setSearchQuery={mockSetSearchQuery} />);

    // Simulate a change in the input
    fireEvent.change(screen.getByPlaceholderText(/Buscar eventos.../i), {
      target: { value: 'New search query' },
    });

    // Verify that setSearchQuery was called with the correct value
    expect(mockSetSearchQuery).toHaveBeenCalledWith('New search query');
  });
});
