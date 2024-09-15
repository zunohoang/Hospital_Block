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
    { name: 'Profile', href: 'doctors', current: true },
    { name: 'Patients', href: 'patients', current: false },
]
const userNavigation = [
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                addressWallet: localStorage.getItem("accessToken")
            })
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
                <Navbar user={user} navigation={navigation} userNavigation={userNavigation}/>

                <div className="min-h-full">
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Thông tin cá nhân
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div
                            className="bg-gray-200 font-sans h-screen w-full flex flex-col justify-center items-center">
                            {/* Phần Avatar trên cùng */}
                            <div className="w-48 h-48 rounded-full overflow-hidden mt-8">
                                <img
                                    className="object-cover w-full h-full"
                                    src="https://avatars.githubusercontent.com/u/67946056?v=4"
                                    alt="Avatar"
                                />
                            </div>

                            {/* Thông tin theo chiều dọc */}
                            <div className="card w-96 mt-6 mx-auto bg-white shadow-xl hover:shadow p-6">
                                <div className="py-2">
                                    <strong>Doctor Name:</strong> Dr. Mike
                                </div>
                                <div className="py-2">
                                    <strong>Hospital:</strong> City Health Clinic
                                </div>
                                <div className="py-2">
                                    <strong>Doctor ID:</strong> DR123456
                                </div>
                                <div className="py-2">
                                    <strong>Patients Managed:</strong> 150 patients
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}
