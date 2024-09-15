import React, { useState } from 'react';
import Getinfofromweb from './Getinfofromweb'; // Adjust the path if necessary

const TestComponent = () => {
    const [token, setToken] = useState('token12345'); // Replace with an actual token or use state for dynamic input

    const { nameContent, spanContent, transactionHash } = Getinfofromweb({ token });

    return (
        <div>
            <h1>Testing Getinfofromweb Component</h1>

            <div>
                <label>Token: </label>
                <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter Token"
                />
            </div>

            <div>
                <h2>Results</h2>
                <p><strong>Name Content:</strong> {nameContent}</p>
                <p><strong>Span Content (Image URL):</strong> {spanContent}</p>
                <p><strong>Transaction Hash:</strong> {transactionHash}</p>
            </div>
        </div>
    );
};

export default TestComponent;
