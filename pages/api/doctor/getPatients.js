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
            const addressWallet = req.headers['x-user-address'];

            const doctor = await Doctor.findOne({ addressWallet: addressWallet });

            if (!doctor) {
                return res.status(400).json({ success: false });
            }

            console.log(doctor);
            if (doctor.patients.length === 0) {
                return res.status(200).json({ patient: [] });
            }

            const patients = await Patient.find({ _id: { $in: doctor.patients } }).populate('hospital', 'fullName').populate('doctor', 'fullName');

            return res.status(200).json({ patients });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}