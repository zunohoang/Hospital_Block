import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';
import Record from '/models/Record';

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

            const { userId, recordMessage, recordName } = req.body;

            const patient = await Patient.findOne({ addressWallet: addressWallet });

            if (!patient) {
                return res.status(401).json({ success: false });
            }

            const doctor = await Doctor.findOne({ _id: userId });

            if (doctor) {
                const record = new Record({
                    userSend_id: patient._id,
                    userReceive_id: doctor._id,
                    recordMessage: recordMessage,
                    userSend_fullName: patient.fullName,
                    recordName: recordName
                });

                await record.save();

                return res.status(200).json({ success: true });
            }

            const patient2 = await Patient.findOne({ _id: userId });

            if (patient2) {
                const record = new Record({
                    userSend_id: patient._id,
                    userReceive_id: patient2._id,
                    recordMessage: recordMessage,
                    userSend_fullName: patient.fullName,
                    recordName: recordName
                });

                await record.save();

                return res.status(200).json({ success: true });
            }

            return res.status(401).json({ success: false });

        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}