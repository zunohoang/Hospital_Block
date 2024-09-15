import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient'
import Record from '/models/Record';

/*
    delete record share
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
            const { recordId } = req.body;

            const patient = await Patient.findOne({ addressWallet: addressWallet });

            if (!patient) {
                return res.status(401).json({ success: false });
            }

            const record = await Record.findOne({ _id: recordId });

            if (!record) {
                return res.status(401).json({ success: false });
            }

            await Record.deleteOne({
                _id: recordId
            });

            return res.status(200).json({ sccess: true });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}