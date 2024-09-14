import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Dashboard', href: 'dashboard', current: false },
    { name: 'Hospitals', href: 'hospitals', current: true },
    { name: 'Doctors', href: 'doctors', current: false },
    { name: 'Patients', href: 'patients', current: false },
    { name: 'About', href: 'about', current: false },
]
const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '/login' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [hospital, setHospital] = useState(null);
    const [active, setActive] = useState(false);

    useEffect(() => {
        fetch('/api/patient/checkActive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setActive(data.patient.active);
                if (data.patient.active) {
                    setHospital(data.patient.hospital);
                } else {
                    if (data.patient.hospital == null) {
                        setHospitals(data.hospitals);
                        console.log(data.hospitals);
                    } else {
                        setHospital(data.patient.hospital);
                    }
                }
            })
    }, []);

    const joinHospital = (hospital) => {
        fetch('/api/patient/joinHospital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ hospitalId: hospital._id })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.location.reload();
            })
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
            <div className="min-h-full light">
                <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hospital</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {
                            active ? (
                                <div className="flex items-center justify-between bg-green-100 rounded-md p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <BellIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3 flex-1 md:flex md:justify-between">
                                            <p className="text-sm text-green-700">
                                                You are active in hospital {hospital.fullName} - {hospital._id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                hospital != null ? (
                                    <div className="flex items-center justify-between bg-red-100 rounded-md p-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <BellIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3 flex-1 md:flex md:justify-between">
                                                <p className="text-sm text-red-700">
                                                    Đang chờ bệnh viên {hospital.fullName} - {hospital._id} xác nhận
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of confirmed hospitals</h1>
                                        <br></br>
                                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3">
                                                            Name
                                                        </th>
                                                        <th scope="col" className="px-6 py-3">
                                                            Doctors
                                                        </th>
                                                        <th scope="col" className="px-6 py-3">
                                                            Patients
                                                        </th>
                                                        <th scope="col" className="px-6 py-3">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        hospitals.map((hospital, index) => (
                                                            hospital.active &&
                                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                                    <div className="ps-3">
                                                                        <div className="text-base font-semibold">{hospital.fullName}</div>
                                                                        <div className="font-normal text-gray-500">ID: {hospital._id}</div>
                                                                    </div>
                                                                </th>
                                                                <td className="px-6 py-4">
                                                                    {hospital.doctors.length}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {hospital.patients.length}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => joinHospital(hospital)}>join</p>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </main >
            </div >
        </>
    )
}
