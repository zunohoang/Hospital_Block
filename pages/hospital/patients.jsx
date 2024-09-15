import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Profile', href: 'dashboard', current: false },
    { name: 'Doctors', href: 'doctors', current: false },
    { name: 'Patients', href: 'patients', current: true },
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Admin() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetch('/api/hospital/getPatients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then((res) => {
                if (res.status === 401) {
                    window.location.href = '/login';
                } else
                    return res.json()
            })
            .then((data) => {
                console.log(data);
                if (data.patients) setPatients(data.patients);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleDeletePatient = (patientId) => {
        fetch('/api/hospital/deletePatient', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ patientId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    setPatients(
                        patients.map((patient) => {
                            if (patient._id === patientId) {
                                patient.active = false;
                            }
                            return patient;
                        })
                    );
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleAddPatient = (patientId) => {
        fetch('/api/hospital/addPatient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ patientId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    setPatients(
                        patients.map((patient) => {
                            if (patient._id === patientId) {
                                patient.active = true;
                            }
                            return patient;
                        })
                    );
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleAddDoctorForPatient = (patientId) => {
        fetch('/api/hospital/addDoctorForPatient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ patientId })
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

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
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patients</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of confirmed patients</h1>
                            <br></br>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Doctor
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            patients.map((patient, index) => (
                                                patient.active == true ? (
                                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                            <div className="ps-3">
                                                                <div className="text-base font-semibold">{patient.fullName}</div>
                                                                <div className="font-normal text-gray-500">ID: {patient._id}</div>
                                                            </div>
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            {
                                                                patient.doctor != undefined ? (
                                                                    <div className="ps-0">
                                                                        <div className="text-base font-semibold">{patient.doctor.fullName}</div>
                                                                        <div className="font-normal text-gray-500">ID: {patient.doctor._id}</div>
                                                                    </div>
                                                                ) : (
                                                                    <button onClick={() => handleAddDoctorForPatient(patient._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Add doctor</button>
                                                                )
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <button onClick={() => handleDeletePatient(patient._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</button>
                                                        </td>
                                                    </tr>
                                                ) : ("")
                                            ))
                                        }
                                        {/* <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Bệnh viện mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Add doctor</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Bệnh viện mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                <div className="ps-0">
                                                    <div className="text-base font-semibold">Bác sĩ mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-red-600 dark:text-blue-500 hover:underline">Delete</p>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of patients waiting for confirmation</h1>
                            <br></br>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            patients.map((patient) => (
                                                !patient.active ? (
                                                    <tr key={patient._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                            <div className="ps-3">
                                                                <div className="text-base font-semibold">{patient.fullName}</div>
                                                                <div className="font-normal text-gray-500">ID: {patient._id}</div>
                                                            </div>
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            <p onClick={() => handleAddPatient(patient._id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Confirm</p>
                                                            <p onClick={() => handleDeletePatient(patient._id)} className="font-medium text-red-600 dark:text-blue-500 hover:underline">Delete</p>
                                                        </td>
                                                    </tr>
                                                ) : ""
                                            )
                                            )
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
