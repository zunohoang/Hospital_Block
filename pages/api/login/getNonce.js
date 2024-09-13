import { generateNonce } from '@meshsdk/core';

export default async function handler(req, res) {
    const { addressWallet } = req.query;

    if (!addressWallet) {
        return res.status(400).json({ error: 'Thiếu addressWallet' });
    }

    try {

        const nonce = generateNonce('Sign to login in to Mesh: ');

        res.status(200).json({ nonce });
    } catch (error) {
        console.error('Lỗi khi tạo nonce:', error);
        res.status(500).json({ error: 'Lỗi khi tạo nonce' });
    }
}