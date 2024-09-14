import axios from 'axios';

// Hàm để upload PDF lên IPFS sử dụng Pinata
export async function uploadPDFtoIPFS(file) {
    const pinataApiKey = 'e3a9b16b6eaa06bf517f';
    const pinataSecretApiKey = 'a71dd07c6cc4611c0ab8946a891e8c5bce6005690937a33ace13e879619cc4d1';

    const formData = new FormData();
    formData.append('file', file);

    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const options = {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
        },
    };

    try {
        const response = await axios.post(url, formData, options);
        // https://blue-implicit-felidae-194.mypinata.cloud/ipfs/QmTA4k65xqUvur1FpLA6TX89e8dkgq8okHQoYT9TEHf8CR
        return response.data.IpfsHash;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
}
