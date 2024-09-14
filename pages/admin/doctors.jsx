import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Dashboard', href: 'dashboard', current: false },
    { name: 'Hospitals', href: 'hospitals', current: false },
    { name: 'Doctors', href: 'doctors', current: true },
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

export default function Doctor() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetch('/api/admin/getDoctors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            // body: JSON.stringify({
            //     addressWallet: localStorage.getItem("accessToken")
            // })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.doctors) setDoctors(data.doctors);
            })
            .catch(err => {
                console.log(err);
            });
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
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of doctors</h1>
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
                                                Patients
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Satus
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            doctors.map(doctor => (
                                                <tr key={doctor._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                        <div className="ps-3">
                                                            <div className="text-base font-semibold">{doctor.fullName}</div>
                                                            <div className="font-normal text-gray-500">ID: {doctor._id}</div>
                                                        </div>
                                                    </th>
                                                    <td className="px-6 py-4">
                                                        {doctor.hospital}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {doctor.patients.length}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {
                                                            doctor.hospital != null
                                                                ? <p className="font-medium text-blue-600 dark:text-blue-500">Confirmed</p>
                                                                : <p className="font-medium text-red-500 dark:text-blue-500 hover:underline">Unconfirmed</p>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Bác sĩ mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                Bệnh viện mẫu
                                            </td>
                                            <td className="px-6 py-4">
                                                353
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500">Confirmed</p>
                                            </td>
                                        </tr>
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Bác sĩ mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                Bệnh viện mẫu
                                            </td>
                                            <td className="px-6 py-4">
                                                353
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-red-500 dark:text-blue-500 hover:underline">Unconfirmed</p>
                                            </td>
                                        </tr>
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
