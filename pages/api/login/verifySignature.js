import jwt from 'jsonwebtoken';
import { checkSignature } from '@meshsdk/core';

const JWT_SECRET = 'your-secret-key';


export default async function handler(req, res) {
    const { addressWallet, signature, nonce } = req.body;
    console.log('addressWallet:', addressWallet);
    console.log('signature:', signature);
    console.log('nonce:', nonce);

    if (!addressWallet || !signature || !nonce) {
        return res.status(400).json({ error: 'Thiếu addressWallet, chữ ký hoặc nonce' });
    }

    try {

        // Xác thực chữ ký với hàm verifyMessage
        const isValid = checkSignature(nonce, signature, addressWallet);

        if (!isValid) {
            return res.status(400).json({ error: 'Chữ ký không hợp lệ' });
        }

        // Nếu xác thực thành công, tạo JWT
        const accessToken = jwt.sign({ addressWallet: addressWallet }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Lỗi khi xác thực chữ ký:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}