import dbConnect from "/lib/mongoose";
import fs from 'fs';
import path from 'path';
import User from "/models/User";
import Hospital from "/models/Hospital";
import Admin from "/models/Admin";
import Doctor from "/models/Doctor";
import Patient from "/models/Patient";


export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        try {
            const temp = req.body;

            console.log('Thông tin đăng ký:', req.body);

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
                file: null,
                txHash: String(temp.txHash)
            });

            if (temp.role == "0") { // them benh nhan
                await Patient.insertMany({
                    fullName: String(temp.name),
                    addressWallet: String(temp.addressWallet),
                    idNumber: String(temp.cccd),
                    birthYear: String(temp.birthYear),
                    phoneNumber: String(temp.cccd),
                    hospital: null,
                    doctor: null,
                    shareRecord: [],
                    active: false
                });
            } else if (temp.role == "1") {
                // them bac si
                await Doctor.insertMany({
                    fullName: String(temp.name),
                    addressWallet: String(temp.addressWallet),
                    hospital: null,
                    patients: [],
                    active: false,
                    shareRecord: []
                });
            } else if (temp.role == "2") {
                // them benh vien
                await Hospital.insertMany({
                    fullName: String(temp.name),
                    addressWallet: String(temp.addressWallet),
                    patients: [],
                    doctors: [],
                    active: false,
                    shareRecord: []
                });
            }


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
