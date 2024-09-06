import { CardanoWallet, useWallet } from '@meshsdk/react';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Login() {
    const { connected, wallet } = useWallet();
    const router = useRouter();

    useEffect(() => {
        async function getAddress() {
            if (connected) {
                try {
                    const address = await wallet.getChangeAddress();
                    console.log('Address:', address);
                    const response = await axios.get('/api/checkAddressWallet', {
                        params: { addressWallet: address },
                    });

                    if (response.data) {
                        console.log('User found:', response.data);
                        if(response.data.role === 0) {
                            await router.push("/patient");
                        } else if(response.data.role === 1) {
                            await router.push("/doctor");
                        } else if(response.data.role === 2) {
                            await router.push("/admin");
                        } else {
                            console.log("NONE ROLE");
                        }
                    } else {
                        console.log("NONE USER");
                    }
                } catch (error) {
                    console.error('Error connecting to MongoDB or fetching users:', error);
                }
            }
        }
        getAddress();
    }, [connected]);

    return (
        <div>
            <CardanoWallet />
        </div>
    );
}
