import React, { useState, useEffect } from 'react';
import './ui.css';

function SearchForm({ onSearchSubmit }) {
    const [searchTerms, setSearchTerms] = useState('');
    const [searchRadius, setSearchRadius] = useState('');
    const [country, setCountry] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [countries, setCountries] = useState([]);  // State to hold the loaded list of countries
    const [results, setResults] = useState([]);  // State to store the results

    useEffect(() => {
        fetch('/data/countries.txt')
            .then(response => response.text())
            .then(text => {
                const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
                setCountries(lines);
            })
            .catch(error => console.error('Error loading countries:', error));
    }, []);  // The empty array ensures this effect runs only once after the initial render

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
        if (event.target.value.length > 0) {
            const match = countries.filter(c => c.toLowerCase().includes(event.target.value.toLowerCase()));
            setFilteredCountries(match);
        } else {
            setFilteredCountries([]);
        }
    };

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

    // List of European countries
    // const countries = ["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", 
    // "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", 
    // "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", 
    // "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", 
    // "Ukraine", "United Kingdom", "Vatican City"];

    const handleSearchTermsChange = (event) => {
        setSearchTerms(event.target.value);
    };

    const handleSearchRadiusChange = (event) => {
        const radius = event.target.value;
        // Only allow numbers
        if (/^\d*$/.test(radius)) {
            setSearchRadius(radius);
        }
    };

    const selectCountry = (name) => {
        setCountry(name);
        setFilteredCountries([]);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Convert radius to integer before submitting
        onSearchSubmit(searchTerms, parseInt(searchRadius, 10) || 0, country);
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
                    {filteredCountries.length > 0 && (
                        <ul className="autocomplete-list">>
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
