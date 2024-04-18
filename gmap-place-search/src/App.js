import React from 'react';
import DynamicInputForm from './DynamicInputForm';
import './ui.css'; // Importing your CSS for styling

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <ul>
                <h1>Google Places Batch Search</h1>
                <li>Enter one or more search terms below</li>
                <li>Click the "Search" button to get results</li>
                <li>Click on "Save results as CSV" to save the results as a CSV</li>
                </ul>
            </header>
            <div className="form-container">
                <DynamicInputForm />
            </div>
        </div>
    );
}

export default App;
