import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Bac si xin vao benh vien
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

        const doctor = await Doctor.findOne({ addressWallet: addressWallet });

        console.log(doctor);

        if (!doctor) {
            return res.status(401).json({ success: false });
        }

        const hospital = await Hospital.findOne({ _id: hospitalId });

        console.log(hospital);
        if (!hospital) {
            return res.status(401).json({ success: false });
        }

        if (!Array.isArray(hospital.doctors)) {
            hospital.doctors = [];
        }

        if (!hospital.doctors.includes(doctor._id)) {
            hospital.doctors.push(doctor._id);
        }

        doctor.hospital = hospital._id;
        doctor.active = false;

        await hospital.save();
        await doctor.save();

        return res.status(200).json({ success: true, hospital });

        // } catch (error) {
        //     res.status(400).json({ success: false });
        // }
    }
}