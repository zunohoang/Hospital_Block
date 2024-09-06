import '../styles/globals.css';
import { MeshProvider } from '@meshsdk/react';
import { WalletProvider } from '/context/WalletContext';

function MyApp({ Component, pageProps }) {
    return (
        <MeshProvider>
            <WalletProvider>
                <Component {...pageProps} />
            </WalletProvider>
        </MeshProvider>
    );
}

export default MyApp;
