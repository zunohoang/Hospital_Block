import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lấy danh sách bác sĩ: POST
    POST /api/admin/getDoctors
    body: {
        addressWalletAdmin: string
    }

*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const addressWallet = req.body.addressWalletAdmin;

            if (!addressWalletAdmin) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ addressWallet: addressWalletAdmin })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            const doctors = await Doctor.find();
            res.status(200).json({ doctors });
        } catch {
            console.error('Lỗi khi lấy danh sách bác sĩ:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách bác sĩ' });
        }
    }
}