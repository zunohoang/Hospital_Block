import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lay danh sach bac si cua benh vien
    GET /api/hospital/getDoctors
    req.query = {
        addressWalletHospital: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const { addressWalletHospital } = req.query;
            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });

            if (!hospital) {
                return res.status(400).json({ success: false });
            }

            const doctors = await Doctor.find({ _id: { $in: hospital.doctors } });

            res.status(200).json({ success: true, doctors });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}