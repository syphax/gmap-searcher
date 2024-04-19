import React from 'react';
import DynamicInputForm from './DynamicInputForm';
import './ui.css'; // Importing your CSS for styling

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Google Places Batch Search</h1>
                <div class-name='instructions'><p>How to use:
                <ul>
                <li>Enter a valid Google Places API key</li>
                <li>Edit the keywords to ID dealers as desired</li>
                <li>Enter one or more search terms in the Search Terms entries</li>
                <li>Adjust the max results field as desired (current max = 20)</li>
                <li>Click the "Search" button to get results</li>
                <li>Click on "Save results as CSV" to save the results as a CSV</li>

                </ul>
                </p>
                </div>
            </header>
            <div className="form-container">
                <DynamicInputForm />
            </div>
        </div>
    );
}

export default App;
