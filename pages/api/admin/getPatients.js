import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lấy danh sách bệnh nhân: POST
    POST /api/admin/getPatients
    body: {
        addressWallet: string
    }

*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const addressWallet = req.body.addressWallet;

            if (!addressWallet) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ addressWallet: addressWallet })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            const patients = await Patient.find()
                .populate('hospital', 'fullName')
                .populate('doctor', 'fullName');

            res.status(200).json({ patients });
        } catch {
            console.error('Lỗi khi lấy danh sách bệnh nhân:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách bệnh nhân' });
        }
    }
}