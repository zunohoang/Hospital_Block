import {useWallet} from "@meshsdk/react";

export default function Patient() {
    const { connected, wallet } = useWallet();
    const showWallet = async () => {
        if (connected) {
            try {
                const address = await wallet.getChangeAddress();
                console.log('Address:', address);
            } catch (error) {
                console.error('Error connecting to MongoDB or fetching users:', error);
            }
        }
    }
    return (
        <div>
            <h1>Patient</h1>
            <button onClick={showWallet()}>Hien thi vi</button>
        </div>
    );
}