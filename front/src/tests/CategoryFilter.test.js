// src/components/CategoryFilter.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CategoryFilter from '../components/CategoryFilter';

jest.mock('axios');

describe('CategoryFilter Component', () => {
  test('should render the select element and options after fetching categories', async () => {
    // Mock categories response
    const categories = [
      { _id: '1', name: 'Music' },
      { _id: '2', name: 'Sports' },
    ];
    axios.get.mockResolvedValue({ data: categories });

    render(<CategoryFilter setSelectedCategory={() => {}} />);

    // Verify that the select element is rendered
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();

    // Wait for categories to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Music')).toBeInTheDocument();
      expect(screen.getByText('Sports')).toBeInTheDocument();
    });
  });

  test('should call setSelectedCategory with the selected value', async () => {
    // Mock categories response
    const categories = [
      { _id: '1', name: 'Music' },
      { _id: '2', name: 'Sports' },
    ];
    axios.get.mockResolvedValue({ data: categories });

    const mockSetSelectedCategory = jest.fn();
    render(<CategoryFilter setSelectedCategory={mockSetSelectedCategory} />);

    // Wait for categories to be fetched
    await waitFor(() => {
      // Simulate selecting a category
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Music' },
      });

      // Verify that setSelectedCategory was called with the correct value
      expect(mockSetSelectedCategory).toHaveBeenCalledWith('Music');
    });
  });
});
