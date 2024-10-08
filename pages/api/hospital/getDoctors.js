import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lay danh sach bac si cua benh vien
    GET /api/hospital/getDoctors
    req.query = {
        addressWalletHospital: String
    }
*/

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const addressWallet = req.headers['x-user-address'];

            // Kiểm tra giá trị của addressWalletHospital
            if (!addressWallet) {
                return res.status(400).json({ success: false, message: 'Địa chỉ ví của bệnh viện không hợp lệ' });
            }

            const hospital = await Hospital.findOne({ addressWallet: addressWallet });

            if (!hospital) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy bệnh viện' });
            }

            console.log(hospital);

            // Tìm danh sách các bác sĩ tương ứng
            const doctors = await Doctor.find({ _id: { $in: hospital.doctors } })
                .populate("hospital", "fullName")
                .populate("patients", "fullName");


            res.status(200).json({ success: true, doctors });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
        }
    } else {
        res.status(405).json({ success: false, message: 'Phương thức không được hỗ trợ' });
    }
}