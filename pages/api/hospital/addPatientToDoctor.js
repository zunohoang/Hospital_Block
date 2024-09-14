import mongoose from 'mongoose';
import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Them patient cho bac si quan ly
    POST /api/hospital/addPatientToDoctor
    req.body = {
        patientId: String,
        addressWalletHospital: String,
        doctorId: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const addressWalletHospital = req.headers['x-user-address'];
            const { patientId, doctorId } = req.body;

            // Kiểm tra định dạng của patientId và doctorId
            if (!mongoose.Types.ObjectId.isValid(patientId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
                return res.status(400).json({ success: false, message: 'Định dạng ID của bệnh nhân hoặc bác sĩ không hợp lệ' });
            }

            const hospital = await Hospital.findOne({ addressWallet: addressWalletHospital });
            const patient = await Patient.findOne({ _id: patientId });
            const doctor = await Doctor.findOne({ _id: doctorId });

            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh viện' });
            }

            if (!patient) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' });
            }

            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bác sĩ' });
            }

            // Đảm bảo rằng hospital.patients và doctor.patients là các mảng
            if (!Array.isArray(hospital.patients)) {
                hospital.patients = [];
            }

            if (!Array.isArray(doctor.patients)) {
                doctor.patients = [];
            }

            if (!hospital.patients.includes(patient._id)) {
                hospital.patients.push(patient._id);
            }
            patient.hospital = hospital._id;
            patient.doctor = doctor._id;
            patient.active = true;
            if (!doctor.patients.includes(patient._id)) {
                doctor.patients.push(patient._id);
            }

            await hospital.save();
            await patient.save();
            await doctor.save();

            res.status(200).json({ success: true, message: 'Bệnh nhân đã được thêm vào bác sĩ quản lý', patient });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
    }
}