import { useEffect, useState } from 'react';
import DoctorMintDashboard from './sendNFT';
import Navbar from '../../components/Navbar';
const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Dashboard', href: 'dashboard', current: false },
    { name: 'Hospitals', href: 'hospitals', current: false },
    { name: 'Profile', href: 'doctors', current: false },
    { name: 'Patients', href: 'patients', current: true },
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]
function PatientDashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const handleOpenDialog = (patient) => {
        setSelectedPatient(patient);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedPatient(null);
    };

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await fetch('/api/doctor/getPatients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            const data = await res.json();
            console.log(data);
            if (data.patients) setPatients(data.patients);
        }
        fetchPatients();
    }, []);

    return (
        <div className="min-h-full">
            <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                </div>
            </header>

            <main>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of patients</h1>
                        <br></br>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Hospital</th>
                                        <th scope="col" className="px-6 py-3">Doctor</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        patients.map((patient, index) => (
                                            patient.active ? (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                        <div className="ps-3">
                                                            <div className="text-base font-semibold">{patient.fullName}</div>
                                                            <div className="font-normal text-gray-500">ID: {patient._id}</div>
                                                        </div>
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {patient.hospital.fullName}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {patient.doctor.fullName}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button onClick={() => handleOpenDialog({ fullName: patient.fullName, _id: patient.addressWallet })} className="text-blue-600 dark:text-blue-500 hover:underline">
                                                            Go
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : null
                                        ))
                                    }
                                    {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">Bệnh nhân mẫu</div>
                                                <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">Bệnh viện mẫu</td>
                                        <td className="px-6 py-4">Bác sĩ mẫu</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleOpenDialog({ fullName: 'Bệnh nhân mẫu', _id: 'addr_test1qppru2scl20tzxcecefyk9ryxka26r7p32x2fulx3w9khyg2g53peva27gh5szpst9fsjdw9d2tr3ycscghy7yfxy3dqx9kfzu' })} className="text-blue-600 dark:text-blue-500 hover:underline">
                                                Go
                                            </button>
                                        </td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {isDialogOpen && (
                <div className="absolute z-50 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="absolute inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white p-4">
                                <DoctorMintDashboard selectedPatient={selectedPatient} />
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleCloseDialog} className="bg-blue-500 text-white px-4 py-2 rounded-md">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default PatientDashboard;
