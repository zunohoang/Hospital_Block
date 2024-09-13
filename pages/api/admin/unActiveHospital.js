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
        hospitalId: string,
        addressWallet: string
    }
*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const { hospitalId } = req.body;
            const addressWallet = req.headers['x-user-address'];

            if (!addressWallet) {
                return res.status(400).json({ message: 'Thiếu thông tin: addressWallet' });
            }

            if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
                return res.status(400).json({ message: 'Định dạng ID không hợp lệ' });
            }

            const adminExists = await Admin.exists({ addressWallet });
            if (!adminExists) {
                return res.status(400).json({ message: 'Admin không tồn fbftại' });
            }

            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) {
                return res.status(400).json({ message: 'Bệnh viện không tồn tại' });
            }

            hospital.active = false;
            await hospital.save();

            const hospitals = await Hospital.find();

            console.log('Thông tin xoa bệnh viện:', req.body);
            res.status(200).json({ hospitals });
        } catch (error) {
            console.error('Lỗi khi xoa bệnh viện:', error);
            res.status(500).json({ message: 'Lỗi khi xoa bệnh viện', error: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không được hỗ trợ' });
    }
}