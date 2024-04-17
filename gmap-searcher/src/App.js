import React from 'react';
import SearchForm from './searchForm';

//import logo from './logo.svg';

import './App.css';

function App() {
  const handleSearchSubmit = (terms, radius) => {
      console.log('Search Terms:', terms);
      console.log('Search Radius:', radius);
      // Here you can integrate the Google Maps API or other search functionality
  };

  return (
      <div className="app-container">

          <h1>Google Places Search</h1>
          <SearchForm onSearchSubmit={handleSearchSubmit} />
      </div>
  );
}

export default App;
