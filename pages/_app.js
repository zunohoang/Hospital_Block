import '../styles/globals.css';
import { MeshProvider } from '@meshsdk/react';
import { WalletProvider } from '/context/WalletContext';
import React, { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Vô hiệu hóa chuột phải
        const handleContextMenu = (event) => {
            event.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);

        // Vô hiệu hóa phím F12 và các phím tắt khác
        const handleKeyDown = (event) => {
            if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup khi component bị hủy
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <MeshProvider>
            <WalletProvider>
                <Component {...pageProps} />
            </WalletProvider>
        </MeshProvider>
    );
}

export default MyApp;
