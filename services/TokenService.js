import { Blockfrost, Lucid } from 'lucid-cardano';

const API_URL = 'https://cardano-preview.blockfrost.io/api/v0';

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
