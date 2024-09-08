import dbConnect from "/lib/mongoose";
import User from "/models/User";
import Hospital from "/models/Hospital";
import Admin from "/models/Admin";


/*
    - Kích hoạt bệnh viện: POST
    - Thông tin gửi lên: + Địa chỉ ví của bệnh viện: addressWalletHospital
                         + Địa chỉ ví của admin: addressWalletAdmin
    POST /api/admin/activeHospital
    body: {
        addressWalletAdmin: string,
        addressWalletHospital: string
    }

*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const addressWalletAdmin = req.body.addressWalletAdmin;
            const addressWalletHospital = req.body.addressWalletHospital;

            if (!addressWalletAdmin || !addressWalletHospital) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ addressWallet: addressWalletAdmin })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            if (!await Hospital.exists({ addressWallet: addressWalletHospital })) {
                return res.status(400).json({ message: 'Bệnh viện không tồn tại' });
            }

            await Hospital.updateOne({ addressWallet: addressWalletHospital }, { active: true });

            console.log('Thông tin kích hoạt bệnh viện:', req.body);
        } catch {
            console.error('Lỗi khi kích hoạt bệnh viện:', error);
            res.status(500).json({ message: 'Lỗi khi kích hoạt bệnh viện' });
        }
    }
}