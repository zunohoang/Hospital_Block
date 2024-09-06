import { useWalletContext } from '../context/WalletContext';
import { useWallet } from '@meshsdk/react';

function WalletButton() {
    const { walletConnected, connectWallet, disconnectWallet } = useWalletContext();
    const wallet = useWallet();

    const handleConnect = async () => {
        const connectedWallet = await wallet.connect();
        if (connectedWallet) {
            connectWallet(connectedWallet.address);
        }
    };

    return (
        <div>
            {walletConnected ? (
                <button onClick={disconnectWallet}>Disconnect Wallet</button>
            ) : (
                <button onClick={handleConnect}>Connect Wallet</button>
            )}
        </div>
    );
}

export default WalletButton;
