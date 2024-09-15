import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar';
import { set } from 'mongoose';

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
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
    const [hospitals, setHospitals] = useState([]);
    const [activeDoctor, setActiveDoctor] = useState(false);
    const [hospital, setHospital] = useState(null);
    const [xacnhan, setXacnhan] = useState(false);

    function fetchHospitals() {
        fetch('/api/doctor/getHospitals', {
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
    }

    useEffect(() => {
        fetch('/api/doctor/checkActive', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (!data.doctor.active) {
                    if (!data.doctor.hospital) {
                        console.log('Doctor is not active');
                        fetchHospitals();
                    } else {
                        setHospital(data.doctor.hospital);
                        setXacnhan(false);
                        setActiveDoctor(true);
                    }
                } else {
                    setHospital(data.doctor.hospital);
                    setActiveDoctor(true);
                    setXacnhan(true);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleJoin = (hospitalId) => {
        fetch('/api/doctor/joinHospital', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ hospitalId }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.success) {
                    console.log('Chờ xác nhận');
                    setHospital(data.hospital);
                    setActiveDoctor(true);
                }
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
                            !activeDoctor ? (
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
                                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleJoin(hospital._id)}>Join</p>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="">
                                    {
                                        xacnhan ? (
                                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Bạn đang là bác sĩ ở bệnh viện</h2>
                                        ) : <h2 className="text-2xl font-bold tracking-tight text-gray-900">Đang chờ xác nhận từ</h2>
                                    }
                                    <b>Name: {hospital.fullName}</b>
                                    <br></br>
                                    <b>ID: {hospital._id}</b>
                                </div>
                            )
                        }
                    </div>
                </main >
            </div >
        </>
    )
}
