import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Benh nhan xin vao benh vien
    POST /api/hospital/getPatients
    req.body = {
        hospitalId: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        // try {
        const addressWallet = req.headers['x-user-address'];
        const { hospitalId } = req.body;

        const patient = await Patient.findOne({ addressWallet: addressWallet });

        console.log(patient);

        if (!patient) {
            return res.status(401).json({ success: false });
        }

        const hospital = await Hospital.findOne({ _id: hospitalId });

        console.log(hospital);

        if (!hospital) {
            return res.status(401).json({ success: false });
        }

        if (!Array.isArray(hospital.patients)) {
            hospital.patients = [];
        }

        if (!hospital.patients.includes(patient._id)) {
            hospital.patients.push(patient._id);
        }

        patient.hospital = hospital._id;
        patient.active = false;

        await hospital.save();
        await patient.save();


        return res.status(200).json({ success: true, hospital });

        // } catch (error) {
        //     res.status(400).json({ success: false });
        // }
    }
}