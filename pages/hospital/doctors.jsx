import { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useState } from 'react';
import Modal from 'react-modal';
import ModelPatientsOfDoctor from '../../components/ModelPatientsOfDoctor';
import DoctorRow from '../../components/hospitals/DoctorRow';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Profile', href: 'dashboard', current: false },
    { name: 'Doctors', href: 'doctors', current: true },
    { name: 'Patients', href: 'patients', current: false },
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Admin() {
    const [doctors, setDoctors] = useState([]);


    useEffect(() => {
        Modal.setAppElement('#__next');
        fetch('/api/hospital/getDoctors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        })
            .then(res => {
                if (res.status === 401) {
                    window.location.href = '/login';
                } else return res.json();
            })
            .then(data => {
                console.log(data);
                if (data.doctors) setDoctors(data.doctors);
            })
    }, []);

    const handleDelete = (doctorId) => {
        fetch('/api/hospital/removeDoctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ doctorId }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setDoctors(
                        //remove doctor from list
                        doctors.filter(doctor => doctor._id !== doctorId)
                    );
                }
            })
    }

    const handleConfirm = (doctorId) => {
        fetch('/api/hospital/activeDoctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ doctorId }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setDoctors(doctors.map(doctor => {
                        if (doctor._id === doctorId) {
                            doctor.active = true;
                        }
                        return doctor;
                    }));
                }
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
            <div className="min-h-full">
                <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Doctors</h1>
                    </div>
                </header>
                <main>
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of confirmed doctors</h1>
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
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            doctors.map((doctor, index) => (
                                                doctor.active == true ? (
                                                    <DoctorRow key={index} doctor={doctor} index={index} handleDelete={handleDelete} />
                                                ) : ""
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
                                                24
                                            </td>
                                            <td className="px-6 py-4">
                                                353
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div>
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>List of unconfirmed doctors</h1>
                            <br></br>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Paper
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            doctors.map((doctor, index) => (
                                                doctor.active == false ? (
                                                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                            <div className="ps-3">
                                                                <div className="text-base font-semibold">{doctor.fullName}</div>
                                                                <div className="font-normal text-gray-500">ID: {doctor._id}</div>
                                                            </div>
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            URL
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="font-medium text-green-600 dark:text-blue-500 hover:underline" onClick={() => handleConfirm(doctor._id)}>Confirm</p>
                                                            <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleDelete(doctor._id)}>Delete</p>
                                                        </td>
                                                    </tr>
                                                ) : ""
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
                                                URL
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Delete</p>
                                            </td>
                                        </tr> */}
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
