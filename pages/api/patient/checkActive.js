import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    kiem tra benh nhan co active hay khong
    POST /api/hospital/getDoctorOfPatient
    req.body = {
        userId: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWallet = req.headers['x-user-address'];

            const patient = await Patient.findOne({ addressWallet: addressWallet })
                .populate('hospital', "fullName");

            if (!patient) {
                return res.status(401).json({ success: false });
            }

            console.log(patient);

            const hospitals = await Hospital.find({ active: true });

            return res.status(200).json({ patient, hospitals });

        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}