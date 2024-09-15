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
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        fetch('/api/patient/getDoctorOfPatient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.doctor) setDoctor(data.doctor);
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
                <main className="px-4 py-8">
                    {
                        doctor != null ? (
                            <div className="bg-white rounded-lg shadow-lg p-4">
                                <h2 className="text-2xl font-bold mb-4">Bác sĩ sẽ phụ trách bạn là:</h2>
                                <p className="text-lg">{doctor.fullName}</p>
                                <p className="text-lg">{doctor._id}</p>
                            </div>
                        ) : (<p className="text-lg">Đang chờ bệnh viện sắp xếp bạn cho bác sĩ nào</p>)
                    }
                </main>
            </div>
        </>
    )
}
