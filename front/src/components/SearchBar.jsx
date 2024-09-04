// src/components/SearchBar.js

import React from 'react';

const SearchBar = ({ setSearchQuery }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar eventos..."
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default SearchBar;
