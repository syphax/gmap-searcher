import React, { useState } from 'react';
import { fetchPlaces } from './apiService'; // Import the API service function

function DynamicInputForm() {
    const [inputRows, setInputRows] = useState([{ searchText: '', maxResults: 20 }]);
    const [apiKey, setApiKey] = useState('');
    const [keywords, setKeywords] = useState('DAF,Iveco,Mercedes,Renault,Scania,VW,Volkswagen,Volvo');
    const [csvData, setCsvData] = useState('');

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

        // Split keywords into an array
        const keywordsArray = keywords.split(',').map(keyword => keyword.trim().toLowerCase());

        // Add "Likely Dealer" flag to each row
        allPlaces = allPlaces.map(place => {
            const displayName = place.displayName.text.toLowerCase();
            const websiteUri = place.websiteUri ? place.websiteUri.toLowerCase() : '';
            const isLikelyDealer = keywordsArray.some(keyword =>
                displayName.includes(keyword) || websiteUri.includes(keyword)
            );
            return { ...place, likelyDealer: isLikelyDealer };
        });

        // Convert allPlaces to CSV format
        const csvString = convertToCSV(allPlaces);
        setCsvData(csvString);
    };

    const convertToCSV = (data) => {
        const headers = [
            'ID',
            'Name',
            'Display Name',
            'Primary Type', 
            'Types',
            'National Phone Number',
            'Formatted Address',
            'Rating',
            'User Rating Count',
            'Google Maps URI',
            'Website URI',
            'Likely Dealer'
        ].join(',');
        const rows = data.map(row => {
            return [
                row.id,
                row.name,
                row.displayName.text,
                row.primaryType || '',
                row.types ? row.types.join(';') : '', // Check if types is defined before joining
                row.nationalPhoneNumber || '',
                row.formattedAddress,
                row.rating || '',
                row.userRatingCount || '',
                row.googleMapsUri,
                row.websiteUri || 'NULL',
                row.likelyDealer ? 'TRUE' : 'FALSE'
            ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',');
        });

        return [headers, ...rows].join('\n');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 4fr', alignItems: 'center', marginBottom: '10px' }}>
                    <label htmlFor="apiKey" style={{ marginRight: '10px' }}>API Key:</label>
                    <input
                        type="text"
                        id="apiKey"
                        value={apiKey}
                        onChange={(event) => setApiKey(event.target.value)}
                        placeholder="Enter API Key"
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 4fr', alignItems: 'center', marginBottom: '10px' }}>
                    <label htmlFor="keywords" style={{ marginRight: '10px' }}>Keywords to ID Dealers:</label>
                    <input
                        type="text"
                        id="keywords"
                        value={keywords}
                        onChange={(event) => setKeywords(event.target.value)}
                        placeholder="Enter comma-separated keywords"
                        style={{ width: '100%' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr', alignItems: 'center', marginBottom: '10px' }}>
                    <label style={{ marginRight: '10px' }}>Search Terms:</label>
                    <label style={{ marginRight: '10px' }}>Max Results:</label>
                    <label style={{ marginRight: '10px' }}>Delete</label>
                    
                </div>
                {inputRows.map((input, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                            type="text"
                            name="searchText"
                            value={input.searchText}
                            onChange={(event) => handleInputChange(index, event)}
                            placeholder="Search Text"
                            style={{ marginRight: '10px' }}
                        />
                        <input
                            type="number"
                            name="maxResults"
                            value={input.maxResults}
                            onChange={(event) => handleInputChange(index, event)}
                            placeholder="Max Results"
                            style={{ marginRight: '10px' }}
                        />
                        <button 
                            type="button" 
                            onClick={() => handleDeleteRow(index)}
                            style={{ flex: 1 }} 
                            >
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