import { useState } from 'react';
import { Lucid, Blockfrost } from "lucid-cardano";
import {CardanoWallet, MeshProvider, useWallet} from "@meshsdk/react";

export default function Home() {
    const { connected, wallet } = useWallet();
    const [transactionHash, setTransactionHash] = useState('');

    const signAndSendTransaction = async () => {
        try {
            // Khởi tạo Lucid với mạng Preview
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

    return (
        <div>
            <h1>Chuyển tADA sử dụng ví Nami</h1>
            <CardanoWallet/>
            {connected && (
                <div>
                    <p>Ví đã kết nối. Thực hiện giao dịch?</p>
                    <button onClick={signAndSendTransaction}>Ký và gửi giao dịch</button>
                </div>
            )}
            {transactionHash && <p>Mã giao dịch: {transactionHash}</p>}
        </div>
    );
}
