import mongoose from 'mongoose';
import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import Patient from '/models/Patient';

/*
    Them user vao benh vien
    POST /api/hospital/addPatient
    req.body = {
        patientId: String,
    }
*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const { patientId } = req.body;
            const addressWalletHospital = req.headers['x-user-address'];

            // Kiểm tra định dạng của patientId
            if (!mongoose.Types.ObjectId.isValid(patientId)) {
                return res.status(400).json({ success: false, message: 'Định dạng ID của bệnh nhân không hợp lệ' });
            }

            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });
            const patient = await Patient.findOne({ _id: patientId });

            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh viện' });
            }

            if (!patient) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' });
            }

            // Đảm bảo rằng hospital.patients là một mảng
            if (!Array.isArray(hospital.patients)) {
                hospital.patients = [];
            }

            if (!hospital.patients.includes(patient._id)) {
                hospital.patients.push(patient._id);
            }
            patient.hospital = hospital._id;
            patient.active = true;
            await hospital.save();
            await patient.save();

            res.status(200).json({ success: true, message: 'Bệnh nhân đã được thêm vào bệnh viện' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
    }
}