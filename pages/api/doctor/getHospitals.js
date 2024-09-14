import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lay cac benh vien doctor co the yeu cau xin vao
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

            const doctor = await Doctor.findOne({ addressWallet: addressWallet })
                .populate('hospital', 'fullName');

            if (!doctor) {
                return res.status(400).json({ success: false });
            }

            const hospitals = await Hospital.find({ active: true })

            return res.status(200).json({ hospitals });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}