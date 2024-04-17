import React from 'react';
import SearchForm from './SearchForm';

function App() {
    const handleSearchSubmit = (terms, radius) => {
        console.log('Search Terms:', terms);
        console.log('Search Radius:', radius);
        // Here you can integrate the Google Maps API or other search functionality
    };

    return (
        <div>
            <h1>Search Interface</h1>
            <SearchForm onSearchSubmit={handleSearchSubmit} />
        </div>
    );
}

export default App;
