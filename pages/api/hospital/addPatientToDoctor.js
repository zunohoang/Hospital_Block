import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Them patient cho bac si quan ly
    POST /api/hospital/addPatientToDoctor
    req.body = {
        patientId: String,
        addressWalletHospital: String
        doctorId: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { patientId, addressWalletHospital, doctorId } = req.body;

            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });
            const patient = await Patient.findOne({ _id: patientId });
            const doctor = await Doctor.findOne({ _id: doctorId });

            if (!hospital || !patient || !doctor) {
                return res.status(400).json({ success: false });
            }

            if (!hospital.patients.includes(patient._id)) {
                hospital.patients.push(patient._id);
            }
            patient.hospital = hospital._id;
            patient.doctor = doctor._id;
            if (!doctor.patients.includes(patient._id)) {
                doctor.patients.push(patient._id);
            }

            await hospital.save();
            await patient.save();
            await doctor.save();
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}