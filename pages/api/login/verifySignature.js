import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

function verifyMessage(publicKey, message, signature) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(message);
    verifier.end();
    try {
        return verifier.verify(publicKey, Buffer.from(signature, 'hex'));
    } catch (error) {
        console.error('Lỗi khi xác thực chữ ký:', error);
        return false;
    }
}

export default async function handler(req, res) {
    const { addressWallet, signature, nonce } = req.body;
    console.log('addressWallet:', addressWallet);
    console.log('signature:', signature);
    console.log('nonce:', nonce);

    if (!addressWallet || !signature || !nonce) {
        return res.status(400).json({ error: 'Thiếu addressWallet, chữ ký hoặc nonce' });
    }

    try {

        // Chuyển đổi khóa công khai từ định dạng hex sang PEM
        const publicKeyBuffer = Buffer.from(signature.key, 'hex');
        const publicKeyBase64 = publicKeyBuffer.toString('base64');
        const publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g).join('\n')}\n-----END PUBLIC KEY-----`;

        // Xác thực chữ ký với hàm verifyMessage
        const isValid = verifyMessage(publicKey, nonce, signature.signature);

        if (!isValid) {
            return res.status(400).json({ error: 'Chữ ký không hợp lệ' });
        }

        // Nếu xác thực thành công, tạo JWT
        const token = jwt.sign({ addressWallet }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Lỗi khi xác thực chữ ký:', error);
        return res.status(500).json({ error: 'Lỗi máy chủ' });
    }
}