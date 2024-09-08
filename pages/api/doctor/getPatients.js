import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';

/*
    Lay patient cua doctor
    POST /api/hospital/getPatients
    req.body = {
        addressWalletDoctor: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { addressWalletDoctor } = req.body;

            const doctors = await Doctor.find({ addressWallet: addressWalletDoctor });

            if (!doctors) {
                return res.status(400).json({ success: false });
            }

            return res.status(200).json({ doctors });

            if (!doctor) {
                return res.status(400).json({ success: false });
            }
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}