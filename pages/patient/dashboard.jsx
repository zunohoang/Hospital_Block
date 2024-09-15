import Navbar from '../../components/Navbar';
import React, { useEffect, useState } from 'react';
import { BrowserWallet } from "@meshsdk/core";
import GetInfoFromWeb from './getinfofromweb';
const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Dashboard', href: 'dashboard', current: true },
    { name: 'Hospitals', href: 'hospitals', current: false },
    { name: 'Doctors', href: 'doctors', current: false },
    { name: 'Patients', href: 'patients', current: false },
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]

const getTokens = async () => {
    try {
        const wallet = await BrowserWallet.enable('nami');
        return await wallet.getAssets();
    } catch (error) {
        console.error('Error fetching tokens:', error);
    }
};


const Dashboard = () => {
    const fetchSharedRecords = () => {
        fetch('/api/patient/getShareRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.listRecord) {
                    setSharedRecords(data.listRecord);
                } else {
                    alert('Failed to fetch shared records. Please try again.');
                }
            })
    };
    const fetchMySharedRecords = () => {
        fetch('/api/patient/getMyShareRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.listRecord) {
                    setMySharedRecords(data.listRecord);
                } else {
                    alert('Failed to fetch shared records. Please try again.');
                }
            })
    }

    const [loading, setLoading] = useState(false);
    const [tokens, setTokens] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [shareId, setShareId] = useState('');
    const [sharedRecords, setSharedRecords] = useState([]);
    const [mySharedRecords, setMySharedRecords] = useState([]);
    const [spanContent, setSpanContent] = useState(''); // State to store content from span
    const [nameContent, setnameContent] = useState(''); // State to store content from span

    useEffect(() => {
        const fetchTokens = async () => {
            const tokens = await getTokens();
            setTokens(tokens || []);
            // Assuming each token has an assetName and quantity (or similar fields)
            const medicalRecords = tokens?.map((token, index) => ({
                id: index + 1, // generate an ID for each token
                name: `${token.assetName}` // format the token info
            }));
            setMedicalRecords(medicalRecords);
        };
        fetchSharedRecords();
        fetchMySharedRecords();
        fetchTokens();
    }, []);

    const handleShare = async () => {
        if (selectedRecord && shareId) {
            // Simulate sharing logic here
            alert(`Shared record "${selectedRecord.name}" with ID ${shareId}`);

            setLoading(true);
            const wallet = await BrowserWallet.enable('nami');
            const assets = await wallet.getAssets();
            const x = selectedRecord.name.split(" - ")[0];
            const assetToken = assets.find((asset) => asset.assetName == x);
            if (!assetToken) {
                alert('Token not found');
                return;
            }

            const tokenX = assetToken.fingerprint

            const { nameContent_x, spanContent_x, transactionHash_x } = await GetInfoFromWeb({ token: tokenX });

            console.log(nameContent_x, spanContent_x, transactionHash_x);

            fetch('/api/patient/shareRecord', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    recordName: nameContent_x,
                    userId: shareId,
                    message: spanContent_x,
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data.success) {
                        console.log('Shared record:', selectedRecord, 'with ID:', shareId);

                        // Update shared records for the user
                        setMySharedRecords([...mySharedRecords, { recordName: selectedRecord.name, sharedWith: shareId, id: selectedRecord.id }]);

                        // Clear inputs
                        setSelectedRecord(null);
                        setShareId('');
                        alert('Record shared successfully');
                        setLoading(false);
                        window.location.reload();
                    } else {
                        alert('Failed to share record. Please try again.');
                    }
                })

        } else {
            alert('Please select a record and enter a valid ID.');
        }
    };

    const handleRevoke = (recordId) => {
        setLoading(true);
        fetch('/api/patient/deleteMyShareRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                recordId: recordId
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                alert('Record revoked successfully');
                setLoading(false);
                window.location.reload();
            })
    };

    const handleView = (recordId, link) => {
        link = encodeUrl(link);
        setSpanContent(link);
    };

    const encodeUrl = (url) => {
        return btoa(url); // Mã hóa URL
    };

    const decodeUrl = (encodedUrl) => {
        return atob(encodedUrl); // Giải mã URL
    };

    return (
        <>

            <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />
            <div className="min-h-full">
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
                        {/* Medical Records List */}
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <label htmlFor="medicalRecords" className="block text-sm font-medium text-gray-700 mb-2">
                                Medical Records (Tokens)
                            </label>
                            <select
                                id="medicalRecords"
                                className="text-black bg-white mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={selectedRecord?.id || ''}
                                onChange={(e) =>
                                    setSelectedRecord(medicalRecords.find((record) => record.id === parseInt(e.target.value)))
                                }
                            >
                                <option value="" disabled>Select a medical record</option>
                                {medicalRecords.map((record) => (
                                    <option key={record.id} value={record.id}>
                                        {record.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Input for Share ID */}
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <label htmlFor="shareId" className="block text-sm font-medium text-gray-700 mb-2">
                                Enter ID to Share With
                            </label>
                            <input
                                type="text"
                                id="shareId"
                                className="mt-1 block w-full shadow-sm sm:text-sm border text-black bg-white p-3 border-gray-300 rounded-md"
                                value={shareId}
                                onChange={(e) => setShareId(e.target.value)}
                                placeholder="Enter User ID"
                            />
                        </div>

                        {/* Share Button */}
                        <div className="bg-white p-6 shadow-lg rounded-lg flex justify-end">
                            <button
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleShare}
                            >
                                Share
                            </button>
                        </div>

                        {/* Table of Shared Medical Records */}
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Shared Medical Records</h2>
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Record Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Shared By
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sharedRecords.map((record, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.recordName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.sharedBy}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                    onClick={() => handleView(record.id, record.link)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table of My Shared Medical Records */}
                        <div className="bg-white p-6 shadow-lg rounded-lg">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Records I Have Shared</h2>
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Record Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Shared With
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {mySharedRecords.map((record, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.recordName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.sharedWith}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                                                    onClick={() => handleRevoke(record.recordId)}
                                                >
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Iframe for Record Health Details */}
                        {spanContent && (
                            <div className="bg-white p-6 shadow-lg rounded-lg text-center">
                                <h3 className="text-xl font-bold text-green-600 mb-4">Record Health Details</h3>
                                <div className="relative" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                    <iframe
                                        src={decodeUrl(spanContent)}
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            width: '100%',
                                            height: '100%',
                                            border: 'none',
                                            borderRadius: '10px',
                                        }}
                                        title={nameContent}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="fixed bottom-[40px] left-0 m-4 p-3 bg-red-500 text-white opacity-70 rounded shadow-lg">
                                Đang xử lý...
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );

};

export default Dashboard;
