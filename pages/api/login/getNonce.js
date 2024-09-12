import crypto from 'crypto';

export default async function handler(req, res) {
    const { addressWallet } = req.query;

    if (!addressWallet) {
        return res.status(400).json({ error: 'Thiếu addressWallet' });
    }

    try {
        // Tạo nonce mới bằng crypto
        const nonce = crypto.randomBytes(16).toString('hex'); // Tạo nonce ngẫu nhiên an toàn

        res.status(200).json({ nonce });
    } catch (error) {
        console.error('Lỗi khi tạo nonce:', error);
        res.status(500).json({ error: 'Lỗi khi tạo nonce' });
    }
}