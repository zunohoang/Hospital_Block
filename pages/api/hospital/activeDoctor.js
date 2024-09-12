import mongoose from 'mongoose';
import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';

/*
    Them bac si vao benh vien
    POST /api/hospital/activeDoctor
    req.body = {
        doctorId: String,
        addressWalletHospital: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { doctorId, addressWalletHospital } = req.body;

            // Kiểm tra định dạng của doctorId
            if (!mongoose.Types.ObjectId.isValid(doctorId)) {
                return res.status(400).json({ success: false, message: 'Định dạng ID của bác sĩ không hợp lệ' });
            }

            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });
            const doctor = await Doctor.findOne({ _id: doctorId });

            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh viện' });
            }

            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
            }

            // Đảm bảo rằng hospital.doctors là một mảng
            if (!Array.isArray(hospital.doctors)) {
                hospital.doctors = [];
            }

            if (!hospital.doctors.includes(doctor._id)) {
                hospital.doctors.push(doctor._id);
            }
            doctor.hospital = hospital._id;

            await hospital.save();
            await doctor.save();

            res.status(200).json({ success: true, message: 'Bác sĩ đã được thêm vào bệnh viện' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
    }
}