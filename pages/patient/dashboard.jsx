import Navbar from '../../components/Navbar';
import React, { useEffect, useState } from 'react';
import { BrowserWallet } from "@meshsdk/core";

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
    { name: 'About', href: 'about', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
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

const fetchSharedRecords = () => {
    return [
        { recordName: 'Shared Medical Record 1', sharedBy: 'User 123' },
        { recordName: 'Shared Medical Record 2', sharedBy: 'User 456' },
    ];
};

const Dashboard = () => {
    const [tokens, setTokens] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [shareId, setShareId] = useState('');
    const [sharedRecords, setSharedRecords] = useState(fetchSharedRecords());
    const [mySharedRecords, setMySharedRecords] = useState([]);

    useEffect(() => {
        const fetchTokens = async () => {
            const tokens = await getTokens();
            setTokens(tokens || []);
            // Assuming each token has an assetName and quantity (or similar fields)
            const medicalRecords = tokens?.map((token, index) => ({
                id: index + 1, // generate an ID for each token
                name: `${token.assetName} - Quantity: ${token.quantity}` // format the token info
            }));
            setMedicalRecords(medicalRecords);
        };
        fetchTokens();
    }, []);

    const handleShare = () => {
        if (selectedRecord && shareId) {
            // Simulate sharing logic here
            alert(`Shared record "${selectedRecord.name}" with ID ${shareId}`);

            // Update shared records for the user
            setMySharedRecords([...mySharedRecords, { recordName: selectedRecord.name, sharedWith: shareId, id: selectedRecord.id }]);

            // Clear inputs
            setSelectedRecord(null);
            setShareId('');
        } else {
            alert('Please select a record and enter a valid ID.');
        }
    };

    const handleRevoke = (recordId) => {
        setMySharedRecords(mySharedRecords.filter(record => record.id !== recordId));
        alert(`Revoked sharing of record ID: ${recordId}`);
    };

    const handleView = (recordId) => {
        alert(`Viewing details of record ID: ${recordId}`);
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
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div className="space-y-4">
                            {/* Medical Records List */}
                            <div>
                                <label htmlFor="medicalRecords" className="block text-sm font-medium text-gray-700">
                                    Medical Records (Tokens)
                                </label>
                                <select
                                    id="medicalRecords"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                            <div>
                                <label htmlFor="shareId" className="block text-sm font-medium text-gray-700">
                                    Enter ID to Share With
                                </label>
                                <input
                                    type="text"
                                    id="shareId"
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    value={shareId}
                                    onChange={(e) => setShareId(e.target.value)}
                                    placeholder="Enter User ID"
                                />
                            </div>

                            {/* Share Button */}
                            <div>
                                <button
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleShare}
                                >
                                    Share
                                </button>
                            </div>

                            {/* Table of Shared Medical Records */}
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Shared Medical Records</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Record Name
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shared By
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                    onClick={() => handleView(record.id)}
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
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Records I Have Shared</h2>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Record Name
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shared With
                                        </th>
                                        <th scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                                    onClick={() => handleRevoke(record.id)}
                                                >
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
