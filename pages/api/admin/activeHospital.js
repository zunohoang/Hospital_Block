import mongoose from 'mongoose';
import dbConnect from '/lib/mongoose';
import User from '/models/User';
import Hospital from '/models/Hospital';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

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
            const { adminId, hospitalId, addressWallet } = req.body;

            if (!addressWallet) {
                return res.status(400).json({ message: 'Thiếu thông tin: addressWallet' });
            }

            if (!mongoose.Types.ObjectId.isValid(adminId) || !mongoose.Types.ObjectId.isValid(hospitalId)) {
                return res.status(400).json({ message: 'Định dạng ID không hợp lệ' });
            }

            const adminExists = await Admin.exists({ addressWallet });
            if (!adminExists) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            const admin = await Admin.findById(adminId);
            if (!admin) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) {
                return res.status(400).json({ message: 'Bệnh viện không tồn tại' });
            }

            hospital.active = true;
            await hospital.save();

            console.log('Thông tin kích hoạt bệnh viện:', req.body);
            res.status(200).json({ success: true, message: 'Bệnh viện đã được kích hoạt' });
        } catch (error) {
            console.error('Lỗi khi kích hoạt bệnh viện:', error);
            res.status(500).json({ message: 'Lỗi khi kích hoạt bệnh viện', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không được hỗ trợ' });
    }
}