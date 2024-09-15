import {useEffect, useState} from 'react';

const Getinfofromweb = ({ token }) => {
    const [transactionHash, setTransactionHash] = useState(''); // State to store transaction hash
    const [spanContent, setSpanContent] = useState(''); // State to store image URL from span
    const [nameContent, setNameContent] = useState(''); // State to store asset name
    const [htmlContent, setHtmlContent] = useState(''); // State to store HTML content
    const [error, setError] = useState(''); // State to store errors

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

                            // Loop through the assets inside
                            for (const asset in assetData) {
                                if (assetData.hasOwnProperty(asset)) {
                                    let { name, image } = assetData[asset];

                                    // Check if the image field exists and is valid
                                    if (image) {
                                        // Handle the case where the image is an IPFS link
                                        if (image.startsWith('ipfs://')) {
                                            const header_link = "https://blue-implicit-felidae-194.mypinata.cloud/ipfs/";
                                            image = header_link + image.split('ipfs://')[1];
                                        }

                                        setSpanContent(image);
                                        setNameContent(name);
                                        return { name, spanContent };
                                    } else {
                                        console.error('Image field is missing or invalid');
                                    }
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

                console.log(transactionHash);

                const link = `https://preview.cardanoscan.io/transaction/${transactionHash}?tab=metadata`;
                fetchHtmlFromUrl(link);
            }
        });
    };

    useEffect(() => {
        const link = `https://preview.cardanoscan.io/token/${token}?tab=minttransactions`;
        fetchMetadata(link);
    }, [token]);

    return { nameContent, spanContent, transactionHash };
};

export default Getinfofromweb;
