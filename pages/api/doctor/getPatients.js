import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lay patient cua doctor
    POST /api/hospital/getPatients
    req.body = {
        addressWallet: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWallet = req.body.addressWallet;

            const doctors = await Doctor.findOne({ addressWallet: addressWallet });

            if (!doctors) {
                return res.status(400).json({ success: false });
            }

            const patient = await Patient.find({ _id: { $in: doctors.patients } });

            return res.status(200).json({ patient });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}