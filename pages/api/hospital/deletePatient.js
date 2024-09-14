import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Xoa benh nhan khoi benh vien
    GET /api/hospital/getDoctors
    req.query = {
        addressWallet: String,
        doctorId: String,
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'DELETE') {
        try {
            const addressWallet = req.headers['x-user-address'];
            const { patientId } = req.body;

            // Kiểm tra giá trị của addressWalletHospital
            if (!addressWallet) {
                return res.status(400).json({ success: false, message: 'Địa chỉ ví của bệnh viện không hợp lệ' });
            }

            const hospital = await Hospital.findOne({ addressWallet: addressWallet });

            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh viện' });
            }

            // xoa benh nhan khoi danh sach benh nhan cua bac si
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' });
            }

            hospital.patients = hospital.patients.filter(item => item.toString() !== patientId);
            patient.hospital = null;
            patient.doctor = null;
            patient.active = false;
            await patient.save();
            await hospital.save();

            return res.status(200).json({ success: true, message: 'Xóa bệnh nhân thành công' });

        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
    }
}