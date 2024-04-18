import React from 'react';
import DynamicInputForm from './DynamicInputForm';
import './ui.css'; // Importing your CSS for styling

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Place Information Collector</h1>
            </header>
            <div className="form-container">
                <DynamicInputForm />
            </div>
        </div>
    );
}

export default App;
