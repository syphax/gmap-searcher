import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm() {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchRadius, setSearchRadius] = useState('');
    const [country, setCountry] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [results, setResults] = useState([]);  // State to store the results

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        const url = `https://places.googleapis.com/v1/places/${searchTerms}?fields=addressComponents&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setResults(data.results);  // Assuming the response has a results field
        } catch (error) {
            console.error('Error fetching data from Google Places API:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearchSubmit} className="form-container">
                <div className="form-field">
                    <label>Search terms:</label>
                    <input
                        type="text"
                        value={searchTerms}
                        onChange={(e) => setSearchTerms(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Search radius (in meters):</label>
                    <input
                        type="text"
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(e.target.value)}
                    />
                </div>
                <div className="form-field">
                    <label>Country:</label>
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        autoComplete="off"
                    />
                    <ul className="autocomplete-list">
                        {filteredCountries.map((c) => (
                            <li key={c} onClick={() => setCountry(c)}>
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Search</button>
            </form>
            {results.length > 0 && (
                <div className="results-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.id}>
                                    <td>{result.name}</td>
                                    <td>{result.address}</td>
                                    <td>{result.city}</td>
                                    <td>{result.country}</td>
                                    <td>{result.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SearchForm;
