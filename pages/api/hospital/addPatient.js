import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';

/*
    Them user vao benh vien
    POST /api/hospital/addPatient
    req.body = {
        patientId: String,
        addressWalletHospital: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { patientId, addressWalletHospital } = req.body;

            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });
            const patient = await User.findOne({ _id: patientId });

            if (!hospital || !patient) {
                return res.status(400).json({ success: false });
            }

            if (!hospital.patients.includes(patient._id)) {
                hospital.patients.push(patient._id);
            }
            patient.hospital = hospital._id;
            await hospital.save();
            await patient.save();
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}