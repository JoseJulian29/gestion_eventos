// src/components/CategoryFilter.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryFilter = ({ setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-4">
      <select
        onChange={e => setSelectedCategory(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="All">Todas las Categorías</option>
        {categories.map(category => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
