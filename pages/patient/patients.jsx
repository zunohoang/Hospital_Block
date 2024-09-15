import React, { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import Navbar from '../../components/Navbar';

const Patients = () => {
    const [tokens, setTokens] = useState([]);
    const [accessLink, setAccessLink] = useState('');
    const [metadata, setMetadata] = useState(null); // State to store metadata
    const [htmlContent, setHtmlContent] = useState(''); // State to store HTML content
    const [error, setError] = useState(''); // State to store any errors
    const [transactionHash, setTransactionHash] = useState(''); // State to store transaction hash
    const [spanContent, setSpanContent] = useState(''); // State to store content from span
    const [nameContent, setnameContent] = useState(''); // State to store content from span

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
    ];
    const userNavigation = [
        { name: 'Sign out', href: '/login' },
    ];

    // Fetch HTML content and search for anchor tags
    const fetchMetadata = async (url) => {
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
            extractAnchorTag(html); // Extract content from anchor tags
        } catch (error) {
            setError(error.message); // Set error message to state if any error occurs
        }
    };

    const fetchHtmlFromUrl = async (link) => {
        try {
            const response = await fetch(link, {
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

    const extractSpanContent = (html) => {
        // Use DOMParser to parse HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find all span elements with the specified class
        const spans = doc.querySelectorAll('span.text-xs.font-medium.textColor1.break-all');

        // Check if spans exist
        if (spans.length === 0) {
            console.log('No span elements found');
            return;
        }

        // Loop through each span element
        spans.forEach((span) => {
            const spanText = span.textContent;

            // Check if the content contains the "721" form
            if (spanText.includes('"721":{')) {
                try {
                    const jsonData = JSON.parse(spanText);
                    for (const key in jsonData["721"]) {
                        if (jsonData["721"].hasOwnProperty(key)) {
                            const assetData = jsonData["721"][key];

                            // Duyệt qua các tài sản bên trong
                            for (const asset in assetData) {
                                if (assetData.hasOwnProperty(asset)) {
                                    let { name, image } = assetData[asset];

                                    // Trả về giá trị name và image
                                    let header_link = "https://blue-implicit-felidae-194.mypinata.cloud/ipfs/"
                                    image = image.split("//")[1];
                                    image = header_link + image;

                                    const spanContentEncoded = encodeUrl(image);
                                    setSpanContent(spanContentEncoded);
                                    setnameContent(name);
                                    // console.log(image);
                                    return { name, image };
                                }
                            }
                        }
                    }
                    return;
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        });
    };


    // Function to parse HTML and extract content from <a> tags
    const extractAnchorTag = (html) => {
        // Use DOMParser to parse HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Find all <a> tags with the specified class
        const anchors = doc.querySelectorAll('a.font-mono.link');

        // Loop through the anchors to find transaction links
        anchors.forEach((anchor) => {
            const href = anchor.getAttribute('href');

            // Check if href contains "transaction" (indicating a transaction link)
            if (href.includes('transaction')) {
                // Extract the transaction hash (the part after "/transaction/")
                const transactionHash = href.split('/transaction/')[1].split('?')[0];
                setTransactionHash(transactionHash); // Set the transaction hash to state

                const link = `https://preview.cardanoscan.io/transaction/${transactionHash}?tab=metadata`;
                // console.log('Fetching metadata from:', link);
                fetchHtmlFromUrl(link);
            }
        });
    };

    const handleShare = (token) => {
        const fingerprint = token.fingerprint;
        const link = `https://preview.cardanoscan.io/token/${fingerprint}?tab=minttransactions`;
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

    const encodeUrl = (url) => {
        return btoa(url); // Mã hóa URL
    };

    const decodeUrl = (encodedUrl) => {
        return atob(encodedUrl); // Giải mã URL
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
                <h2 style={{ textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '20px' }}>Danh sách hồ sơ bệnh án</h2>
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
                                    <button style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleShare(token)}>View</button>
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

                {/* Display iframe for access link */}
                {spanContent && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '20px', color: '#4CAF50', fontWeight: 'bold', marginBottom: '20px' }}>Record Health Details</h3>
                        <div style={{
                            position: 'relative',
                            paddingBottom: '56.25%', // This maintains a 16:9 aspect ratio for the iframe
                            height: '0',
                            overflow: 'hidden',
                            maxWidth: '100%',
                            backgroundColor: '#000',
                            borderRadius: '10px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}>
                            <iframe
                                src={decodeUrl(spanContent)}
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    borderRadius: '10px'
                                }}
                                title={nameContent}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ marginTop: '20px', textAlign: 'center', color: 'red' }}>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Patients;
