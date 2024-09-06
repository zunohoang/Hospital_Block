// pages/api/transaction/sign.js
import { createUnsignedTransaction, submitTransaction } from '/utils/transactionHelpers';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { amount, signedTransaction } = req.body;

        if (!signedTransaction) {
            const unsignedTransaction = await createUnsignedTransaction(amount);
            if (!unsignedTransaction) {
                return res.status(400).json({ error: 'Lỗi khi tạo giao dịch chưa ký' });
            }
            return res.status(200).json({ unsignedTransaction });
        } else {
            const txId = await submitTransaction(signedTransaction);
            if (!txId) {
                return res.status(400).json({ error: 'Lỗi khi gửi giao dịch' });
            }
            return res.status(200).json({ txId });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
