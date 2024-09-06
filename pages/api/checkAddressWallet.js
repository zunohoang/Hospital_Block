import users from '../../models/User';
import connectMongo from '../../lib/mongoose';

export default async function handler(req, res) {
    await connectMongo();

    if (req.method === 'GET') {
        const user = await users.findOne({ addressWallet: req.query.addressWallet });
        return res.status(200).json(user);
    }
}
