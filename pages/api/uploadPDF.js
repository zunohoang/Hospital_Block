import { uploadPDFtoIPFS } from '../../services/UserService';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { file } = req.body;

        try {
            const ipfsCid = await uploadPDFtoIPFS(file);
            res.status(200).json({ ipfsCid });
        } catch (error) {
            res.status(500).json({ error: 'Error uploading file to IPFS' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
