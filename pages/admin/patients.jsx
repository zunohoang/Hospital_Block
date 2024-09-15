import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Dashboard', href: 'dashboard', current: true },
    { name: 'Hospitals', href: 'hospitals', current: false },
    { name: 'Doctors', href: 'doctors', current: false },
    { name: 'Patients', href: 'patients', current: true },
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]


export default function Patient() {

    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            const res = await fetch('/api/admin/getPatients', {
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
        <>
            {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
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
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Hospital
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Doctor
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            patients.map((patient, index) => (
                                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                        <div className="ps-3">
                                                            <div className="text-base font-semibold">{patient.fullName}</div>
                                                            <div className="font-normal text-gray-500">ID: {patient._id}</div>
                                                        </div>
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        <div className="ps-0">
                                                            <div className="text-base font-semibold">{patient.hospital.fullName}</div>
                                                            <div className="font-normal text-gray-500">ID: {patient.hospital._id}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="ps-0">
                                                            <div className="text-base font-semibold">{patient.doctor.fullName}</div>
                                                            <div className="font-normal text-gray-500">ID: {patient.doctor._id}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
