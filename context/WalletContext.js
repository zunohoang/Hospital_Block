// context/WalletContext.js
import React, { createContext, useContext, useState } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);

    const connectWallet = (address) => {
        setWalletConnected(true);
        setWalletAddress(address);
    };

    const disconnectWallet = () => {
        setWalletConnected(false);
        setWalletAddress(null);
    };

    return (
        <WalletContext.Provider
            value={{
                walletConnected,
                walletAddress,
                connectWallet,
                disconnectWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => useContext(WalletContext);
