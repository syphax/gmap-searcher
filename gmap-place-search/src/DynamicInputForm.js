import React, { useState } from 'react';
import { fetchPlaces } from './apiService'; // Import the API service function

function DynamicInputForm() {
    const [inputRows, setInputRows] = useState([{ searchText: '', maxResults: 20 }]);

    const [csvData, setCsvData] = useState('');
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY; // Load the API key from environment variables

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newInputRows = inputRows.map((row, i) => {
            if (i === index) {
                return { ...row, [name]: value };
            }
            return row;
        });

        setInputRows(newInputRows);
        // Automatically add a new row if the current row being edited is the last row
        if (index === inputRows.length - 1) {
            setInputRows([...newInputRows, { searchText: '', maxResults: 20 }]);
        }
    };

    const handleDeleteRow = (index) => {
        setInputRows(inputRows.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let allPlaces = [];

        for (let { searchText, maxResults } of inputRows) {
            if (!searchText.trim()) continue; // Skip empty search terms
            const places = await fetchPlaces(searchText, apiKey, maxResults);
            allPlaces.push(...places); // Concatenate results
        }

        // Convert allPlaces to CSV format
        const csvString = convertToCSV(allPlaces);
        setCsvData(csvString);
    };

    // Function to convert JSON data to CSV
// Function to convert JSON data to CSV
const convertToCSV = (data) => {
    const headers = [
        'ID',
        'Name',
        'Display Name',
        'Types',
        'National Phone Number',
        'Formatted Address',
        'Rating',
        'User Rating Count',
        'Google Maps URI',
        'Website URI'
    ].join(',');
    const rows = data.map(row => {
        return [
            row.id,
            row.name,
            row.displayName.text,
            row.types ? row.types.join(';') : '', // Check if types is defined before joining
            row.nationalPhoneNumber || '',
            row.formattedAddress,
            row.rating || '',
            row.userRatingCount || '',
            row.googleMapsUri,
            row.websiteUri || 'NULL'
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',');
    });

    return [headers, ...rows].join('\n');
};


    return (
        <div>
            <form onSubmit={handleSubmit}>
                {inputRows.map((input, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                        <input
                            type="text"
                            name="searchText"
                            value={input.searchText}
                            onChange={(event) => handleInputChange(index, event)}
                            placeholder="Search Text"
                            style={{ flex: 3, marginRight: '10px' }}
                        />
                        <input
                            type="number"
                            name="maxResults"
                            value={input.maxResults}
                            onChange={(event) => handleInputChange(index, event)}
                            placeholder="Max Results"
                            style={{ width: '20%' }}
                        />
                        <button type="button" onClick={() => handleDeleteRow(index)} style={{ flex: 1 }}>
                            🗑️
                        </button>
                    </div>
                ))}
                <button type="submit">Search!</button>
            </form>
            {csvData && (
                <div>
                    <textarea value={csvData} readOnly style={{ width: '100%', height: '400px' }} />
                    <button onClick={() => downloadCSV(csvData)}>Save results as CSV</button>
                </div>
            )}
        </div>
    );
}

// Function to trigger CSV file download
const downloadCSV = (csvData) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'google_places_search_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default DynamicInputForm;
