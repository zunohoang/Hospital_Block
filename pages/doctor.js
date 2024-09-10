import { useState } from 'react';
import { CardanoWallet } from '@meshsdk/react';
import { uploadPDFtoIPFS } from '../services/UserService';  // Hàm upload PDF lên IPFS
// import { mintToken } from '../services/TokenService';  // Hàm mint token
import { Blockfrost, Lucid } from 'lucid-cardano';

const API_URL = 'https://cardano-preview.blockfrost.io/api/v0';

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
            const result = await mintToken(tokenName, parseInt(amount), patientKey);
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


// Hàm khởi tạo Lucid
export async function initializeLucid() {
    const blockfrost = new Blockfrost(API_URL, 'previewbNG4bQlPHpt1pZmuO6gVik7fuh89pyZz'); // Đặt API Key của bạn tại đây
    const lucid = await Lucid.new(blockfrost, 'Preview');  // Sử dụng Testnet hoặc đổi thành Mainnet
    return lucid;
}

// Hàm mint token
export async function mintToken(tokenName, amount, patientKey) {
    const lucid = await initializeLucid();  // Khởi tạo Lucid

    const { paymentCredential } = lucid.utils.paymentCredentialOf(patientKey);  // Lấy paymentCredential từ địa chỉ ví
    // Tạo Policy Script với keyHash của bệnh nhân
    const mintingPolicy = lucid.utils.nativeScriptFromJson({
        type: "all",
        scripts: [
            { type: "sig", keyHash: paymentCredential.hash },  // Sử dụng keyHash sau khi chuyển đổi từ địa chỉ ví
            {
                type: "before",
                slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),  // Điều kiện thời gian
            },
        ],
    });


    const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);  // Tạo Policy ID từ Policy Script

    // Tạo giao dịch mint token
    const tx = await lucid
        .newTx()
        .validTo(Date.now() + 200000)  // Thời gian hết hạn của giao dịch
        .mintAssets({ [`${policyId}.${tokenName}`]: amount })  // Mint token với tên và số lượng
        .attachMintingPolicy(policy)  // Gắn Policy Script vào giao dịch
        .complete();  // Hoàn tất việc tạo giao dịch

    // Ký và gửi giao dịch
    const signedTx = await tx.sign().complete();

    // Gửi giao dịch lên mạng Cardano
    const txHash = await signedTx.submit();

    console.log(`Minted ${amount} ${tokenName} tokens`);
    console.log(`Transaction Hash: ${txHash}`);
    console.log(`Policy ID: ${policyId}`);

    return {
        txHash,
        policyId,
        tokenName,
    };
}
