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
    { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
    const [hospitals, setHospitals] = useState([]);

    function handleDelete(_id) {
        fetch('/api/admin/unActiveHospital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                hospitalId: _id
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.hospitals) setHospitals(data.hospitals);
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    function handleConfirm(_id) {
        fetch('/api/admin/activeHospital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                hospitalId: _id
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.hospitals) setHospitals(data.hospitals);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        // Fetch hospitals
        fetch('/api/admin/getHospitals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.hospitals) setHospitals(data.hospitals);
            })
            .catch((error) => {
                console.error('Error:', error);
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
            <div className="min-h-full light">
                <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hospital</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
                                                hospital.active ? (
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
                                                            <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleDelete(hospital._id)}>Delete</p>
                                                        </td>
                                                    </tr>
                                                ) : ""
                                            ))
                                        }
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Bệnh viện mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                24
                                            </td>
                                            <td className="px-6 py-4">
                                                353
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of unconfirmed hospitals</h1>
                            <br></br>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Information
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            hospitals.map((hospital, index) => (
                                                hospital.active == false ? (
                                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                            <div className="ps-3">
                                                                <div className="text-base font-semibold">{hospital.fullName}</div>
                                                                <div className="font-normal text-gray-500">ID: {hospital._id}</div>
                                                            </div>
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            <p>URL</p>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleConfirm(hospital._id)}>Confirm</p>
                                                        </td>
                                                    </tr>
                                                ) : ""
                                            ))
                                        }
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">Bệnh viện mẫu</div>
                                                    <div className="font-normal text-gray-500">ID: 3r43redfcsdg4te4rgfvdgrt</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                <a>URL</a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Confirm</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main >
            </div >
        </>
    )
}
