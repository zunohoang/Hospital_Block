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
                fullName: temp.name,                 // Chuyển thành string
                addressWallet: temp.addressWallet,   // Chuyển thành string
                role: temp.role,                     // Chuyển role thành string
                cccd: temp.cccd,                     // Chuyển CCCD thành string
                birthYear: temp.birthYear,           // Chuyển birthYear thành string
                hometown: temp.hometown,             // Chuyển quê quán thành string
                hospital: temp.hospital ? (temp.hospital) : " ", // Nếu có hospital, chuyển thành string
                file: temp.fileName ? temp.fileName : "null",  // Nếu có file, chuyển tên file thành string
                txHash: temp.txHash,                 // Chuyển txHash thành string
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
