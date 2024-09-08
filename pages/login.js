import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CardanoWallet } from '@meshsdk/react';
import { useWalletContext } from '/context/WalletContext'; // Đường dẫn đến WalletContext.js
import axios from "axios";

export default function Login() {
    const { connected, walletAddress } = useWalletContext();
    const router = useRouter();

    useEffect(() => {
        async function getAddress() {
            if (connected && walletAddress) {
                try {
                    const response = await axios.get('/api/checkAddressWallet', {
                        params: { addressWallet: walletAddress },
                    });
                    console.log(response.data);
                    if (response.data) {
                        if (response.data.role === "0") {
                            await router.push("/patient");
                        } else if (response.data.role === "1") {
                            await router.push("/doctor");
                        } else if (response.data.role === "2") {
                            await router.push("/hospital");
                        } else if (response.data.role === "3") {
                            await router.push("/admin");
                        } else {
                            alert("Tài khoan chua dang kí, tao tai khoan moi");
                            await router.push('/resigter')
                        }
                    } else {
                        alert("Dang nhap that bai, dang nhap lai");
                        await router.push('/login');
                    }
                } catch (error) {
                    alert("Dang nhap that bai, dang nhap lai");
                    await router.push('/login');
                }
            }
        }
        getAddress();
    }, [connected, walletAddress]);

    return (
        <div>
            <h1>Login</h1>
            {!connected && (
                <div>
                    <p>Vui lòng kết nối ví của bạn:</p>
                    <CardanoWallet />
                </div>
            )}
        </div>
    );
}
