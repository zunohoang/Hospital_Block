import axios from 'axios';

const blockfrostApiKey = 'previewbNG4bQlPHpt1pZmuO6gVik7fuh89pyZz';

export async function checkTransactionReceived(txHash, senderAddress) {
    try {
        const response = await axios.get(`https://cardano-preview.blockfrost.io/api/v0/txs/${txHash}/utxos`, {
            headers: {
                'project_id': blockfrostApiKey
            }
        });

        const utxos = response.data.outputs;
        const recipientAddress = 'addr_test1qzm9x0wsee90celmhntz7szftz3ym4jrm30umw4aesudd4mg066fv66svm4pguqrr3lkn3qhlwsjcqg03xuc0mwgtjkqh3yma4';  // Địa chỉ cố định

        const transactionReceived = utxos.some((output) => {
            return output.address === recipientAddress && output.address === senderAddress;
        });

        return transactionReceived;
    } catch (error) {
        console.error('Lỗi khi kiểm tra giao dịch:', error);
        return false;
    }
}
