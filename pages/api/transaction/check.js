import { checkTransactionReceived } from "@/utils/transactionHelpers";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { txHash, senderAddress } = req.body;

        const received = await checkTransactionReceived(txHash, senderAddress);

        if (received) {
            return res.status(200).json({ received: true });
        } else {
            return res.status(200).json({ received: false });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
