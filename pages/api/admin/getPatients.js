import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';

/*
    Lấy danh sách bệnh nhân: POST
    POST /api/admin/getPatients
    body: {
        addressWalletAdmin: string
    }

*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const addressWalletAdmin = req.body.addressWalletAdmin;

            if (!addressWalletAdmin) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ addressWallet: addressWalletAdmin })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            const patients = await Patient.find();
            res.status(200).json({ patients });
        } catch {
            console.error('Lỗi khi lấy danh sách bệnh nhân:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách bệnh nhân' });
        }
    }
}