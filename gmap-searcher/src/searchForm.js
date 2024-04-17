import React, { useState, useEffect } from 'react';
import './ui.css';

function SearchForm({ onSearchSubmit }) {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchRadius, setSearchRadius] = useState('');
    const [country, setCountry] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [countries, setCountries] = useState([]);
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetch('/data/countries.txt')
            .then(response => response.text())
            .then(text => {
                const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
                setCountries(lines);
            })
            .catch(error => console.error('Error loading countries:', error));
    }, []);

    const handleInputChange = (setter) => (event) => {
        const value = event.target.value;
        setter(value);
        if (setter === setCountry) {
            if (value.length > 0) {
                const match = countries.filter(c => c.toLowerCase().includes(value.toLowerCase()));
                setFilteredCountries(match);
                setShowDropdown(true);  // Show dropdown when there are matches
            } else {
                setFilteredCountries([]);
                setShowDropdown(false);  // Hide dropdown when input is cleared
                setShowDropdown(false);
            }
        }
    };

    const handleBlur = () => {
        // Delay hiding to allow click event on list item to fire
        setTimeout(() => setShowDropdown(false), 100);
    };

    const selectCountry = (name) => {
        setCountry(name);
        setFilteredCountries([]);
        setShowDropdown(false);  // Hide dropdown when a selection is made
    };
    
    const handleSubmit = async (event) => {
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
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-field">
                    <label>Search terms:</label>
                    <input
                        type="text"
                        value={searchTerms}
                        onChange={handleInputChange(setSearchTerms)}
                    />
                </div>
                <div className="form-field">
                    <label>Search radius (in meters):</label>
                    <input
                        type="text"
                        value={searchRadius}
                        onChange={handleInputChange(setSearchRadius)}
                    />
                </div>
                <div className="form-field">
                    <label>Country:</label>
                    <input
                    type="text"
                    value={country}
                    onChange={handleInputChange(setCountry)}
                    onBlur={handleBlur}
                    autoComplete="off"
                />

                    {showDropdown && filteredCountries.length > 0 && (
                        <ul className="autocomplete-list">
                            {filteredCountries.map((c) => (
                                <li key={c} onClick={() => selectCountry(c)} style={{ cursor: 'pointer' }}>
                                    {c}
                                </li>
                            ))}
                        </ul>
                    )}
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
