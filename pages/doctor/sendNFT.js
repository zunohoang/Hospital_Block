import { useState, useEffect } from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { uploadPDFtoIPFS } from '../../services/UserService'; // Hàm upload PDF lên IPFS
import { Lucid, Blockfrost, fromText } from "lucid-cardano";

const API_URL = 'https://cardano-preview.blockfrost.io/api/v0';
const blockfrostkey = "previewbNG4bQlPHpt1pZmuO6gVik7fuh89pyZz";

export default function DoctorMintDashboard({ selectedPatient }) {
    const [patientKey, setPatientKey] = useState('');  // Địa chỉ ví của bệnh nhân
    const [pdfFile, setPdfFile] = useState(null);  // File PDF để tải lên
    const [tokenName, setTokenName] = useState('');  // Tên token để mint
    const [amount, setAmount] = useState(1);  // Số lượng token để mint, usually 1 for NFTs
    const [lucid, setLucid] = useState(null); // Store Lucid instance

    useEffect(() => {
        if (selectedPatient) {
            setPatientKey(selectedPatient._id); // Assuming _id is the wallet address
        }

        const initializeLucid = async () => {
            const lucidInstance = await Lucid.new(
                new Blockfrost(API_URL, blockfrostkey),
                "Preview"
            );
            setLucid(lucidInstance);
        };
        initializeLucid();
    }, [selectedPatient]);

    // Hàm xử lý khi người dùng chọn file PDF
    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
    };

    // Hàm xử lý khi tải lên IPFS và mint token
    const handleSubmit = async () => {
        try {
            alert('Đang tạo hồ sơ vui lòng chờ...');
            if (!patientKey || !pdfFile || !tokenName || !amount) {
                alert("Vui lòng nhập đầy đủ thông tin và chọn file PDF.");
                return;
            }

            // Ensure Lucid is initialized
            if (!lucid) {
                alert("Lucid chưa được khởi tạo.");
                return;
            }

            // Tải PDF lên IPFS và lấy CID
            let ipfsCid = await uploadPDFtoIPFS(pdfFile);

            // Lấy địa chỉ ví của người dùng từ Nami
            const walletApi = await window.cardano.nami.enable();
            lucid.selectWallet(walletApi);

            const paymentCredential = lucid.utils.getAddressDetails(
                await lucid.wallet.address(),
            ).paymentCredential;

            const mintingPolicy = lucid.utils.nativeScriptFromJson({
                type: "all",
                scripts: [
                    { type: "sig", keyHash: paymentCredential.hash },
                    {
                        type: "before",
                        slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
                    },
                ],
            });

            const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

            const unit = policyId + fromText(tokenName);  // Unique NFT identifier

            // Add metadata for the NFT
            const metadata = {
                721: {
                    [policyId]: {
                        [tokenName]: {
                            name: tokenName,
                            description: "Medical record NFT",
                            image: `ipfs://${ipfsCid}`,  // Link to the PDF file on IPFS
                        },
                    },
                },
            };

            // Create the transaction to mint the NFT
            const tx = await lucid.newTx()
                .mintAssets({ [unit]: BigInt(amount) })  // Use amount as BigInt, typically 1 for NFTs
                .validTo(Date.now() + 200000)  // Time until the transaction expires
                .attachMintingPolicy(mintingPolicy)
                .attachMetadata(721, metadata)  // Attach metadata to the NFT
                .payToAddress("addr_test1qzm9x0wsee90celmhntz7szftz3ym4jrm30umw4aesudd4mg066fv66svm4pguqrr3lkn3qhlwsjcqg03xuc0mwgtjkqh3yma4", { lovelace: 5000000n }) // Địa chỉ cố định
                .payToAddress(patientKey, { [unit]: 1n })  // Send the NFT to the patient
                .complete();

            const signedTx = await tx.sign().complete();

            const txHash = await signedTx.submit();

            alert(`Đã Thành công`);

        } catch (error) {
            alert('Có lỗi xảy ra khi tải file lên hoặc mint token.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Create Health Record</h1>

            <div>
                <label>
                    <div
                        onChange={(e) => setPatientKey(patientKey)}
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
                <label className='bg-white text-black'>
                    <p>Name Health Record</p>
                    <input
                        className='bg-white text-black'
                        type="text"
                        placeholder="Nhập tên token"
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <button className='bg-green-500 text-white mt-[10px] p-3' onClick={handleSubmit}>Upload PDF and Mint NFT</button>
            </div>
        </div>
    );
}
