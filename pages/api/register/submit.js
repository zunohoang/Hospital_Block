import dbConnect from "/lib/mongoose";
import fs from 'fs';
import path from 'path';
import User from "/models/User";

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const temp = req.body;

            console.log('Thông tin đăng ký:', req.body);

            // Nếu có tệp tin, lưu vào thư mục upload
            if (req.files && req.files.file) {
                const file = req.files.file;
                const uploadPath = path.join(process.cwd(), 'public', 'upload', file.name);
                fs.writeFileSync(uploadPath, file.data);
            }


            console.log(temp)
            // Lưu thông tin vào MongoDB
            await User.insertMany({
                fullName: String(temp.name),
                addressWallet: String(temp.addressWallet),
                role: String(temp.role),
                cccd: String(temp.cccd),
                birthYear: String(temp.birthYear),
                hometown: String(temp.hometown),
                hospital: temp.hospital ? String(temp.hospital) : " ",
                file: temp.fileName ? String(temp.fileName) : "null",
                txHash: String(temp.txHash)
            });


            res.status(200).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            console.error('Lỗi khi đăng ký:', error);
            res.status(500).json({ message: 'Lỗi khi đăng ký' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
