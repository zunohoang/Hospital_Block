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
                <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    </div>
                </header>
                <main>
                    <div className="bg-gray-200 font-sans h-screen w-full flex flex-row justify-center items-center">
                        <div className="card w-96 mx-auto bg-white  shadow-xl hover:shadow">
                            <img className="w-32 mx-auto rounded-full -mt-20 border-8 border-white"
                                 src="https://avatars.githubusercontent.com/u/67946056?v=4" alt=""/>
                            <div className="text-center mt-2 text-3xl font-medium">Ajo Alex</div>
                            <div className="text-center mt-2 font-light text-sm">@devpenzil</div>
                            <div className="text-center font-normal text-lg">Kerala</div>
                            <div className="px-6 text-center mt-2 font-light text-sm">
                                <p>
                                    Front end Developer, avid reader. Love to take a long walk, swim
                                </p>
                            </div>
                            <hr className="mt-8"/>
                            <div className="flex p-4">
                                <div className="w-1/2 text-center">
                                    <span className="font-bold">1.8 k</span> Followers
                                </div>
                                <div className="w-0 border border-gray-300">

                                </div>
                                <div className="w-1/2 text-center">
                                    <span className="font-bold">2.0 k</span> Following
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
