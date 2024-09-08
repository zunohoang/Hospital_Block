import { useState, useEffect } from 'react';
import { Transaction } from '@meshsdk/core';
import { CardanoWallet } from '@meshsdk/react';

// Hàm để lấy hồ sơ bệnh án từ blockchain
async function getMedicalRecords(patientKey) {
    try {
        const tx = new Transaction({ initiator: window.cardano });

        // Gọi smart contract để lấy dữ liệu hồ sơ bệnh án dựa trên địa chỉ ví bệnh nhân
        const records = await tx.callSmartContract({
            address: 'SCRIPT_ADDRESS',  // Địa chỉ của smart contract đã triển khai
            datum: patientKey,  // Địa chỉ ví của bệnh nhân (PubKeyHash)
        });

        return records;  // Trả về dữ liệu hồ sơ bệnh án
    } catch (error) {
        console.error('Failed to fetch medical records:', error);
        return null;
    }
}

// Hàm để cấp quyền truy cập hồ sơ bệnh án
async function grantAccess(patientKey, recipientKey) {
    try {
        const tx = new Transaction({ initiator: window.cardano });

        // Tạo giao dịch cấp quyền truy cập cho địa chỉ ví của người nhận
        tx.addOutput({
            address: 'SCRIPT_ADDRESS',
            datum: { patientKey, recipientKey },  // Địa chỉ ví bệnh nhân và người được cấp quyền
            value: '1000000',  // Phí giao dịch (có thể tùy chỉnh)
        });

        const unsignedTx = await tx.build();
        const signedTx = await window.cardano.signTx(unsignedTx);
        const txHash = await tx.submit(signedTx);

        console.log(`Access granted successfully with hash: ${txHash}`);
        return txHash;
    } catch (error) {
        console.error('Failed to grant access:', error);
        throw error;
    }
}

// React component cho Patient Dashboard
export default function PatientDashboard() {
    const [patientKey, setPatientKey] = useState('');  // Địa chỉ ví của bệnh nhân
    const [records, setRecords] = useState([]);  // Hồ sơ bệnh án của bệnh nhân
    const [recipientKey, setRecipientKey] = useState('');  // Địa chỉ ví của người được cấp quyền

    // Lấy hồ sơ bệnh án sau khi nhập địa chỉ ví
    useEffect(() => {
        if (patientKey) {
            getMedicalRecords(patientKey).then((data) => {
                if (data) {
                    setRecords(data);  // Lưu hồ sơ bệnh án vào state
                }
            });
        }
    }, [patientKey]);

    // Hàm để xử lý việc cấp quyền truy cập
    const handleGrantAccess = async () => {
        if (recipientKey && patientKey) {
            try {
                const txHash = await grantAccess(patientKey, recipientKey);
                alert(`Access granted successfully! Transaction Hash: ${txHash}`);
            } catch (error) {
                alert('Có lỗi xảy ra khi cấp quyền truy cập.');
            }
        } else {
            alert('Vui lòng nhập địa chỉ ví của bệnh nhân và người được cấp quyền.');
        }
    };

    return (
        <div>
            <h1>Patient Dashboard</h1>
            <CardanoWallet /> {/* Thành phần để kết nối với ví Cardano */}

            <div>
                <label>
                    <p>Your Wallet Address (địa chỉ ví của bạn)</p>
                    <input
                        type="text"
                        placeholder="Nhập địa chỉ ví của bạn"
                        value={patientKey}
                        onChange={(e) => setPatientKey(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <h2>Your Medical Records (Hồ sơ bệnh án của bạn):</h2>
                {records.length > 0 ? (
                    records.map((record, index) => (
                        <div key={index}>
                            <p>Record {index + 1}: {record}</p>
                        </div>
                    ))
                ) : (
                    <p>Chưa có hồ sơ bệnh án</p>
                )}
            </div>

            <div>
                <h2>Grant Access (Cấp quyền truy cập):</h2>
                <label>
                    <p>Recipient Wallet Address (địa chỉ ví của người được cấp quyền)</p>
                    <input
                        type="text"
                        placeholder="Nhập địa chỉ ví của người được cấp quyền"
                        value={recipientKey}
                        onChange={(e) => setRecipientKey(e.target.value)}
                    />
                </label>
                <button onClick={handleGrantAccess}>Grant Access</button>
            </div>
        </div>
    );
}
