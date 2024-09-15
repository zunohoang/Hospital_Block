import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Xoa benh nhan khoi bac sĩ
    GET /api/hospital/getDoctors
    req.query = {
        doctorId: String,
        patientId: String,
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWallet = req.headers['x-user-address'];

            const { doctorId, patientId } = req.body;

            // Kiểm tra giá trị của addressWalletHospital
            if (!addressWallet) {
                return res.status(400).json({ success: false, message: 'Địa chỉ ví của bệnh viện không hợp lệ' });
            }

            const hospital = await Hospital.findOne({ addressWallet: addressWallet });

            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh viện' });
            }

            // xoa benh nhan khoi danh sach benh nhan cua bac si
            const doctor = await Doctor.findById(doctorId);
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
            }

            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' });
            }

            const index = doctor.patients.indexOf(patient._id);
            if (index > -1) {
                doctor.patients.splice(index, 1);
            }
            patient.doctor = null;
            patient.active = true;

            await doctor.save();
            await patient.save();

            res.status(200).json({ success: true, message: 'Xóa bệnh nhân thành công' });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
    }
}