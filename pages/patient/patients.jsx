import React, { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import Navbar from '../../components/Navbar';

const Patients = () => {
    const [tokens, setTokens] = useState([]);
    const [accessLink, setAccessLink] = useState('');
    const [metadata, setMetadata] = useState(null); // State to store metadata
    const user = {
        name: 'Admin',
        email: 'admin@admin.com',
        imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
    };
    const navigation = [
        { name: 'Dashboard', href: 'dashboard', current: false },
        { name: 'Hospitals', href: 'hospitals', current: false },
        { name: 'Doctors', href: 'doctors', current: false },
        { name: 'Patients', href: 'patients', current: true },
        { name: 'About', href: 'about', current: false },
    ];
    const userNavigation = [
        { name: 'Your Profile', href: '#' },
        { name: 'Sign out', href: '/login' },
    ];

    // Fetch metadata by parsing the HTML content
    const fetchMetadata = async (url) => {
        try {
            const response = await fetch(url);
            const text = await response.text(); // Get HTML as a string
            console.log('HTML content:', text);

            // Parse the HTML and extract the content inside the <pre> tag
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const preTag = doc.querySelector('pre');
            if (preTag) {
                setMetadata(preTag.textContent); // Set the content of <pre> tag as metadata
            } else {
                console.error('No <pre> tag found in the HTML content');
                setMetadata('No metadata found.');
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
            setMetadata('Error fetching metadata.');
        }
    };

    const handleShare = (token) => {
        const fingerprint = token.fingerprint;
        const link = `https://preview.cexplorer.io/asset/${fingerprint}/metadata#data`;
        setAccessLink(link);

        // Fetch the metadata from the link
        fetchMetadata(link);
    };

    const getTokens = async () => {
        try {
            const wallet = await BrowserWallet.enable('nami');
            return await wallet.getAssets();
        } catch (error) {
            console.error('Error fetching tokens:', error);
        }
    };

    useEffect(() => {
        const fetchTokens = async () => {
            const tokens = await getTokens();
            setTokens(tokens || []);
        };
        fetchTokens();
    }, []);

    const shortenString = (str) => {
        if (str.length <= 12) return str;
        return `${str.substring(0, 6)}...${str.substring(str.length - 6)}`;
    };

    return (
        <>
            <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />
            <div style={{ width: '80%', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', fontFamily: 'Arial, sans-serif' }}>
                <h2 style={{ textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '20px' }}>List of Tokens</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                    <tr>
                        <th style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', textAlign: 'left', fontSize: '16px' }}>Token Name</th>
                        <th style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', textAlign: 'left', fontSize: '16px' }}>Fingerprint</th>
                        <th style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', textAlign: 'left', fontSize: '16px' }}>Policy ID</th>
                        <th style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', textAlign: 'left', fontSize: '16px' }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tokens.length > 0 ? (
                        tokens.map((token, index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{shortenString(token.assetName)}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{shortenString(token.fingerprint)}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{shortenString(token.policyId)}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <button style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleShare(token)}>Share</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ padding: '10px', textAlign: 'center' }}>No tokens available</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {accessLink && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '18px', color: '#333' }}>Access Link</h3>
                        <p><a href={accessLink} target="_blank" rel="noopener noreferrer">{accessLink}</a></p>
                    </div>
                )}

                {metadata && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '18px', color: '#333' }}>Metadata Content</h3>
                        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', textAlign: 'left' }}>{metadata}</pre>
                    </div>
                )}
            </div>
        </>
    );
};

export default Patients;
