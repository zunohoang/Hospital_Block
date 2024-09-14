import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    get doctor of patient
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

            const patient = await Patient.findOne({ addressWallet: addressWallet });

            if (!patient) {
                return res.status(401).json({ success: false });
            }

            console.log(patient);

            if (!patient.doctor) {
                return res.status(200).json({ doctor: null });
            }
            const doctor = await Doctor.findById(patient.doctor._id);


            return res.status(200).json({ doctor });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}