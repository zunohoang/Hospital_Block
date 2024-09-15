import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    get doctor
    POST /api/hospital/getPatients
    req.body = {
        addressWallet: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWallet = req.headers['x-user-address'];

            const doctor = await Doctor.findOne({ addressWallet: addressWallet });

            if (!doctor) {
                return res.status(400).json({ success: false });
            }

            return res.status(200).json({ doctor });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}