import dbConnect from '/lib/mongoose';
import Hospital from '/models/Hospital';
import User from '/models/User';
import Admin from '/models/Admin';
import Doctor from '/models/Doctor';
import Patient from '/models/Patient';

/*
    Lấy danh sách bệnh viện: GET
    GET /api/admin/getHospitals
    body: { 
        addressWallet: string
    }
*/

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const addressWallet = req.body.addressWallet;

            if (!addressWallet) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }

            if (!await Admin.exists({ addressWallet: addressWallet })) {
                return res.status(400).json({ message: 'Admin không tồn tại' });
            }

            const hospitals = await Hospital.find();
            res.status(200).json({ hospitals });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bệnh viện:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách bệnh viện' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}