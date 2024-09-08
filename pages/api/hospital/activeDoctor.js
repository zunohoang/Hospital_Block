import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';

/*
    Them bac si vao benh vien
    POST /api/hospital/activeDoctor
    req.body = {
        addressWalletDoctor: String,
        addressWalletHospital: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { addressWalletDoctor, addressWalletHospital } = req.body;
            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });
            const doctor = await Doctor.findOne({ addressWallet: addressWalletDoctor });

            if (!hospital || !doctor) {
                return res.status(400).json({ success: false });
            }

            hospital.doctors.push(doctor._id);
            doctor.hospital = hospital._id;

            await hospital.save();
            await doctor.save();
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}