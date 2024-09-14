import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    share ho so benh an 
    POST /api/hospital/shareRecord
    req.body = {
        userId: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWallet = req.headers['x-user-address'];

            const { userId, recordMessage } = req.body;

            const isPatient = await Hospital.findOne({ addressWallet: addressWallet });
            if (!isPatient) {
                return res.status(400).json({ success: false });
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
            }

            const doctor = await Doctor.findById(userId);
            const patient = await Patient.findById(userId);
            const hospital = await Hospital.findById(userId);

            if (doctor) {
                doctor.shareRecord = recordMessage;
                await doctor.save();
            }

            if (patient) {
                patient.shareRecord = recordMessage;
                await patient.save();
            }

            if (hospital) {
                hospital.shareRecord = recordMessage;
                await hospital.save();
            }


        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}