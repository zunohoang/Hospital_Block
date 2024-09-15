import { useState } from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { Blockfrost, Lucid } from "lucid-cardano";

export default function Register() {
    const [step, setStep] = useState(1); // Bước hiện tại (1: nhập thông tin, 2: kết nối ví)
    const [role, setRole] = useState(''); // Vai trò của người dùng
    const [formData, setFormData] = useState({
        name: '',
        cccd: '',
        birthYear: '',
        hometown: '',
        hospital: ''
    });
    const [transactionHash, setTransactionHash] = useState('');

    const { wallet, connected } = useWallet(); // Mesh SDK hook để quản lý kết nối ví

    // Hàm xử lý thay đổi giá trị trong form
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // Bước 1: Nhập thông tin
    const renderStep1 = () => (
        <div>
            <h2>Đăng ký</h2>
            <label>Tên người dùng:</label>
            <input name="name" value={formData.name} onChange={handleInputChange} className='bg-white border-2' />

            <label>Số CCCD:</label>
            <input name="cccd" value={formData.cccd} onChange={handleInputChange} className='bg-white border-2' />

            <label>Năm sinh:</label>
            <input name="birthYear" value={formData.birthYear} onChange={handleInputChange} className='bg-white border-2' />

            <label>Quê quán:</label>
            <input name="hometown" value={formData.hometown} onChange={handleInputChange} className='bg-white border-2' />

            <label>Vai trò:</label>
            <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className='bg-white border-2'>
                <option value="">Chọn vai trò</option>
                <option value="0">Bệnh nhân</option>
                <option value="1">Bác sĩ</option>
                <option value="2">Bệnh viện</option>
            </select>

            {role === '1' && (
                <>
                    <label>Bệnh viện làm việc:</label>
                    <input name="hospital" value={formData.hospital} onChange={handleInputChange} />
                </>
            )}

            {role === '2' && (
                <>

                </>
            )}

            <button onClick={() => setStep(2)} className='bg-white border-2'>Tiếp theo</button>
        </div>
    );

    // Bước 2: Kết nối ví và ký giao dịch
    const signAndSendTransaction = async () => {
        if (!connected) {
            alert('Vui lòng kết nối ví trước!');
            return;
        }

        try {
            const lucid = await Lucid.new(
                new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewbNG4bQlPHpt1pZmuO6gVik7fuh89pyZz"),
                "Preview"
            );

            // Lấy địa chỉ ví của người dùng từ Nami
            const walletApi = await window.cardano.nami.enable();
            lucid.selectWallet(walletApi);

            // Soạn thảo giao dịch
            const tx = await lucid.newTx()
                .payToAddress("addr_test1qzm9x0wsee90celmhntz7szftz3ym4jrm30umw4aesudd4mg066fv66svm4pguqrr3lkn3qhlwsjcqg03xuc0mwgtjkqh3yma4", { lovelace: 5000000n }) // Địa chỉ cố định
                .complete();

            alert("Vui long cho he thong xu ly");

            // Ký giao dịch
            const signedTx = await tx.sign().complete();

            // Gửi giao dịch
            const txHash = await signedTx.submit();

            console.log(`Mã giao dịch là: ${txHash}`);
            setTransactionHash(txHash);
        } catch (error) {
            console.error('Lỗi khi ký hoặc gửi giao dịch:', error);
            alert('Lỗi khi thực hiện giao dịch: ' + error.message);
        }
    };

    const renderStep2 = () => (
        <div>
            <h2>Kết nối ví và ký giao dịch</h2>

            <CardanoWallet />


            {connected && (
                <div>
                    <button onClick={signAndSendTransaction}>Ký và gửi giao dịch</button>
                </div>
            )}
            {transactionHash && (
                <div>
                    <button onClick={submitRegistration}>Đăng ký</button>
                </div>
            )}
        </div>
    );

    // Gửi đăng ký sau khi giao dịch thành công
    const submitRegistration = async () => {
        const formDataToSend = {};
        for (const key in formData) {
            formDataToSend[key] = formData[key];
        }
        formDataToSend['txHash'] = transactionHash;
        formDataToSend['addressWallet'] = await wallet.getChangeAddress();
        formDataToSend['role'] = role;

        console.log(formDataToSend);
        const res = await fetch('/api/register/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSend),
        });

        if (res.ok) {
            alert('Đăng ký thành công!');
        } else {
            alert('Lỗi khi đăng ký!');
        }
    }

    return (
        <div>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
        </div>
    );
}
