import { useState } from 'react';
import { CardanoWallet } from '@meshsdk/react';
import { uploadPDFtoIPFS } from '../services/UserService';  // Hàm upload PDF lên IPFS
import { mintToken } from '../services/TokenService';  // Hàm mint token

export default function DoctorMintDashboard() {
    const [patientKey, setPatientKey] = useState('');  // Địa chỉ ví của bệnh nhân
    const [pdfFile, setPdfFile] = useState(null);  // File PDF để tải lên
    const [tokenName, setTokenName] = useState('');  // Tên token để mint
    const [amount, setAmount] = useState(10);  // Số lượng token để mint

    // Hàm xử lý khi người dùng chọn file PDF
    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    // Hàm xử lý khi tải lên IPFS và mint token
    const handleSubmit = async () => {
        try {
            if (!patientKey || !pdfFile || !tokenName || !amount) {
                alert("Vui lòng nhập đầy đủ thông tin và chọn file PDF.");
                return;
            }

            // Tải PDF lên IPFS và lấy CID
            const ipfsCid = await uploadPDFtoIPFS(pdfFile);
            alert(`Tài liệu đã được tải lên IPFS với CID: ${ipfsCid}`);

            // Mint token dựa trên tên token và số lượng nhập vào
            const result = await mintToken(tokenName, parseInt(amount));
            alert(`Token đã được mint thành công!\nTx Hash: ${result.txHash}`);
        } catch (error) {
            alert('Có lỗi xảy ra khi tải file lên hoặc mint token.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Doctor Dashboard & Mint Token</h1>
            <CardanoWallet /> {/* Thành phần để kết nối với ví Cardano */}

            <div>
                <label>
                    <p>Patient Key (Địa chỉ ví bệnh nhân)</p>
                    <input
                        type="text"
                        placeholder="Nhập địa chỉ ví của bệnh nhân"
                        value={patientKey}
                        onChange={(e) => setPatientKey(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    <p>Upload Medical Record (Tải hồ sơ bệnh án)</p>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            <div>
                <label>
                    <p>Token Name</p>
                    <input
                        type="text"
                        placeholder="Nhập tên token"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <button onClick={handleSubmit}>Upload PDF and Mint Token</button>
            </div>
        </div>
    );
}
