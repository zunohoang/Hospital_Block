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
        <div className="mt-[40px] max-w-lg mx-auto p-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-2xl transform transition duration-500 hover:scale-105">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
                Chào mừng đến với hệ thống phi tập trung bệnh viện
                <br />
                <span className="text-xl text-blue-700">Đăng ký tài khoản</span>
            </h2>

            <div className="mb-4">
                <label className="block text-blue-900 font-medium mb-2">Tên người dùng:</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-black bg-white w-full px-4 py-2 border border-blue-300 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Nhập tên người dùng"
                />
            </div>

            <div className="mb-4">
                <label className="block text-blue-900 font-medium mb-2">Số CCCD:</label>
                <input
                    name="cccd"
                    value={formData.cccd}
                    onChange={handleInputChange}
                    className="text-black bg-white w-full px-4 py-2 border border-blue-300 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Nhập số CCCD"
                />
            </div>

            <div className="mb-4">
                <label className="block text-blue-900 font-medium mb-2">Năm sinh:</label>
                <input
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="text-black bg-white w-full px-4 py-2 border border-blue-300 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Nhập năm sinh"
                />
            </div>

            <div className="mb-4">
                <label className="block text-blue-900 font-medium mb-2">Quê quán:</label>
                <input
                    name="hometown"
                    value={formData.hometown}
                    onChange={handleInputChange}
                    className="text-black bg-white w-full px-4 py-2 border border-blue-300 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    placeholder="Nhập quê quán"
                />
            </div>

            <div className="mb-6">
                <label className="block text-blue-900 font-medium mb-2">Vai trò:</label>
                <select
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="text-black bg-white w-full px-4 py-2 border border-blue-300 rounded-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition duration-300"
                >
                    <option value="">Chọn vai trò</option>
                    <option value="0">Bệnh nhân</option>
                    <option value="1">Bác sĩ</option>
                    <option value="2">Bệnh viện</option>
                </select>
            </div>

            <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
            >
                Tiếp theo
            </button>
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
        <div className="max-w-lg mx-auto p-8 bg-gray-100 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Kết nối ví và ký giao dịch
            </h2>

            <div className="mb-6 flex justify-center">
                <CardanoWallet />
            </div>

            {connected ? (
                <div className="mb-6 text-center">
                    <button
                        onClick={signAndSendTransaction}
                        className="w-full bg-gray-800 text-white font-semibold py-2 rounded-md shadow-md hover:bg-gray-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition duration-300"
                    >
                        Ký và gửi giao dịch
                    </button>
                </div>
            ) : (
                <div className="text-center text-red-600 font-semibold">
                    Vui lòng kết nối ví để tiếp tục
                </div>
            )}

            {transactionHash && (
                <div className="mt-6 text-center">
                    <button
                        onClick={submitRegistration}
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md shadow-md hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-300"
                    >
                        Đăng ký
                    </button>
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
            window.location.href = '/login';
        } else {
            alert('Lỗi khi đăng ký!');
            window.location.reload();
        }
    }

    return (
        <div>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
        </div>
    );
}
