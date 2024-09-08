import { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
    const { connected, wallet } = useWallet();
    const [walletAddress, setWalletAddress] = useState(null);

    useEffect(() => {
        async function fetchAddress() {
            if (connected && wallet) {
                try {
                    const address = await wallet.getChangeAddress();
                    setWalletAddress(address);
                } catch (error) {
                    console.error('Error fetching wallet address:', error);
                }
            }
        }
        fetchAddress();
    }, [connected, wallet]);

    return (
        <WalletContext.Provider value={{ connected, walletAddress }}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext() {
    return useContext(WalletContext);
}
