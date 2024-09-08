// import {useWallet} from "@meshsdk/react";
//
// export default function Patient() {
//     const { connected, wallet } = useWallet();
//     const showWallet = async () => {
//         if (connected) {
//             try {
//                 const address = await wallet.getChangeAddress();
//                 console.log('Address:', address);
//             } catch (error) {
//                 console.error('Error connecting to MongoDB or fetching users:', error);
//             }
//         }
//     }
//     return (
//         <div>
//             <h1>Patient</h1>
//             <button onClick={showWallet()}>Hien thi vi</button>
//         </div>
//     );
// }

import { useWalletContext } from '../context/WalletContext';
import {CardanoWallet} from "@meshsdk/react";
import {useEffect} from "react"; // Đường dẫn đến WalletContext.js
import {useRouter} from "next/router";

export default function Patient() {
    const { connected, walletAddress } = useWalletContext();
    const router = useRouter();
    const showWallet = () => {
        if (connected && walletAddress) {
            console.log('Address:', walletAddress);
        } else {
            console.log('No wallet connected');
        }
    };

    useEffect(() => {
        if (!connected) {
            // Nếu ví đã bị ngắt kết nối, điều hướng về trang đăng nhập
            router.push('/login');
        }
    }, [connected, router]);

    return (
        <div>
            <h1>Hospital</h1>
            <CardanoWallet/>
            <button onClick={showWallet}>Hiển thị ví</button>
        </div>
    );
}
