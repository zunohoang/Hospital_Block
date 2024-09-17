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
]
const userNavigation = [
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
                <main>
                    {/* Phần hiển thị thông tin bác sĩ */}
                    <div className="bg-gray-200 font-sans h-screen w-full flex flex-col justify-center items-center">
                        <div className="card w-full mx-auto bg-white shadow-xl hover:shadow p-6 max-w-lg text-center">
                            {doctor != null ? (
                                <>
                                    <h2 className="text-xl font-bold mb-4">The doctor in charge of you</h2>
                                    <div className="text-2xl font-medium text-gray-800 mb-2">
                                        {doctor.fullName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {doctor._id}
                                    </div>
                                    {/* Thêm ảnh nếu cần */}
                                    <div className="mt-4">
                                        <img
                                            className="w-24 h-24 rounded-full mx-auto"
                                            src="/doctor.jpg"
                                            alt="Doctor"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Wait for the hospital to arrange a doctor for you</p>
                                    <div className="mt-4">
                                        <img
                                            className="w-24 h-24 rounded-full mx-auto"
                                            src="/doctor.jpg"
                                            alt="Doctor"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </main>

            </div>
        </>
    )
}
