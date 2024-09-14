import React, { useState } from 'react';

const FetchMetadata = () => {
    const [htmlContent, setHtmlContent] = useState(''); // State to store HTML content
    const [error, setError] = useState(''); // State to store any errors
    const [spanContent, setSpanContent] = useState(''); // State to store content from span

    // Function to fetch HTML content from the given URL
    const fetchHtmlFromUrl = async () => {
        const url = 'https://preview.cardanoscan.io/transaction/fb168a1437efe1d9ff75eddc93d35493ba3ace16e9a82ecdedaad10db0043150?tab=metadata';

        try {
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors', // Enable CORS
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching URL: ${response.status} ${response.statusText}`);
            }

            const html = await response.text(); // Get HTML content as text
            setHtmlContent(html); // Set the fetched HTML content to state
            extractSpanContent(html); // Extract content from the span tag
        } catch (error) {
            setError(error.message); // Set error message to state if any error occurs
        }
    };

    // Function to parse HTML and extract content from span
    const extractSpanContent = (html) => {
        // Use DOMParser to parse HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find the span with the specified class
        const span = doc.querySelector('span.text-xs.font-medium.textColor1.break-all');

        // If span exists, extract the content
        if (span) {
            setSpanContent(span.textContent); // Set the span content to state
        } else {
            setSpanContent('No span tag found with the specified class.');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Fetch and Display Metadata HTML Content</h1>
            <button
                onClick={fetchHtmlFromUrl}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                Fetch HTML Content
            </button>

            {/* Display span content */}
            {spanContent && (
                <div style={{ whiteSpace: 'pre-wrap', marginTop: '20px', textAlign: 'left' }}>
                    <h2>Span Content:</h2>
                    <pre style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '5px' }}>
                        {spanContent}
                    </pre>
                </div>
            )}
            {/* Display error message */}
            {error && (
                <div style={{ color: 'red', marginTop: '20px' }}>
                    <h2>Error:</h2>
                    {error}
                </div>
            )}
        </div>
    );
};

export default FetchMetadata;
