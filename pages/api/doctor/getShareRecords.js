import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient'
import Record from '/models/Record';

/*
    Lay patient cua benh vien
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
                return res.status(401).json({ success: false });
            }

            console.log(doctor);
            const shareRecords = await Record.find({ userReceive_id: doctor._id });
            console.log(shareRecords)

            return res.status(200).json({ shareRecords });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}