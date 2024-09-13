import React, { useEffect, useState } from 'react';
import { BrowserWallet } from '@meshsdk/core'; // Import BrowserWallet từ Mesh.js
import axios from 'axios';

export default function Login() {
    const [wallet, setWallet] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);

    // Kết nối ví bằng BrowserWallet
    const connectWallet = async () => {
        try {
            const wallet = await BrowserWallet.enable('nami'); // Bạn có thể thay 'nami' bằng 'eternl', 'flint', v.v...
            setWallet(wallet);

            // Lấy địa chỉ ví từ wallet
            const address = await wallet.getUsedAddresses();
            setWalletAddress(address[0]);
            setConnected(true);
        } catch (error) {
            console.error("Lỗi khi kết nối ví:", error);
            alert("Vui lòng cài đặt ví Nami hoặc Eternl!");
        }
    };

    useEffect(() => {
        const authenticate = async () => {
            if (connected && walletAddress) {
                setLoading(true);
                try {
                    console.log('Đang xác thực...' + walletAddress);
                    // Lấy nonce từ máy chủ
                    const { data: { nonce } } = await axios.get('/api/login/getNonce', {
                        params: { addressWallet: walletAddress },
                    });

                    console.log(nonce);
                    // Ký nonce với BrowserWallet bằng signData
                    const signedMessage = await wallet.signData(nonce);

                    // Gửi chữ ký về máy chủ để xác thực
                    const { data: { accessToken } } = await axios.post('/api/login/verifySignature', {
                        addressWallet: walletAddress,
                        signature: signedMessage,
                        nonce: nonce
                    });

                    // Lưu JWT vào localStorage
                    localStorage.setItem("accessToken", accessToken);
                    alert('Xác thực thành công!');
                } catch (error) {
                    console.error('Xác thực thất bại:', error);
                    alert('Xác thực thất bại!');
                } finally {
                    setLoading(false);
                }
            }
        };

        authenticate();
    }, [connected, walletAddress]);

    return (
        <div>
            <h1>Login</h1>
            {loading && <p>Đang xác thực...</p>}
            {!connected && (
                <div>
                    <button onClick={connectWallet}>Kết nối ví</button>
                </div>
            )}
        </div>
    );
}
