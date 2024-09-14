import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lay patient cua bac si
    POST /api/hospital/getPatientsOfDoctor
    req.body = {
        addressWallet: String,
        doctorId: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWallet = req.headers['x-user-address'];
            const { doctorId } = req.body;

            const hospital = await Hospital.findOne({ addressWallet: addressWallet });

            if (!hospital) {
                return res.status(400).json({ success: false });
            }

            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
            }

            const patients = await Patient.find({ _id: { $in: doctor.patients } });

            return res.status(200).json({ patients });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}