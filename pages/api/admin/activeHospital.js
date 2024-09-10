import dbConnect from "/lib/mongoose";
import User from "/models/User";
import Hospital from "/models/Hospital";
import Admin from "/models/Admin";
import Doctor from "/models/Doctor";
import Patient from "/models/Patient";


/*
    - Kích hoạt bệnh viện: POST
    POST /api/admin/activeHospital
    body: {
        adminId: string,
        hospitalId: string,
        addressWallet: string
    }

*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const adminId = req.body.adminId;
            const hospitalId = req.body.hospitalId;
            const addressWallet = req.body.addressWallet;

            if (!addressWallet) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ addressWallet: addressWallet })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            if (!adminId || !hospitalId) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ _id: adminId })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            if (!await Hospital.exists({ _id: hospitalId })) {
                return res.status(400).json({ message: 'Bệnh viện không tồn tại' });
            }

            await Hospital.updateOne({ _id: hospitalId }, { active: true });

            console.log('Thông tin kích hoạt bệnh viện:', req.body);
        } catch {
            console.error('Lỗi khi kích hoạt bệnh viện:', error);
            res.status(500).json({ message: 'Lỗi khi kích hoạt bệnh viện' });
        }
    }
}