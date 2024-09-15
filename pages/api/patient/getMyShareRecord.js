import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient'
import Record from '/models/Record';

/*
    la record dc share
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

            const patient = await Patient.findOne({ addressWallet: addressWallet });

            if (!patient) {
                return res.status(401).json({ success: false });
            }

            console.log(patient);
            const shareRecords = await Record.find({ userSend_id: patient._id });
            console.log(shareRecords)

            var listRecord = [];

            /*
             { recordName: 'Shared Medical Record 1', sharedBy: 'User 123', link: 'https://blue-implicit-felidae-194.mypinata.cloud/ipfs/QmV7SkZSQq2JwvuXxQGrBWTCmx3xsYmbBP1kvncjh18Tyg' },
        { recordName: 'Shared Medical Record 2', sharedBy: 'User 456', link: 'https://blue-implicit-felidae-194.mypinata.cloud/ipfs/QmV7SkZSQq2JwvuXxQGrBWTCmx3xsYmbBP1kvncjh18Tyg' },
 
            */

            shareRecords.forEach((record) => {
                listRecord.push({
                    recordName: record.recordName,
                    sharedBy: record.userSend_fullName,
                    link: record.message,
                    recordId: record._id,
                    sharedWith: record.userReceive_id
                });
            });

            return res.status(200).json({ listRecord });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    }
}