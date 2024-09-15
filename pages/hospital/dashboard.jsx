import Navbar from '../../components/Navbar';
import { useEffect, useState } from 'react';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Profile', href: 'dashboard', current: true },
    { name: 'Doctors', href: 'doctors', current: false },
    { name: 'Patients', href: 'patients', current: false },
]
const userNavigation = [
    { name: 'Sign out', href: '/login' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Admin() {
    const [hospitals, setHospitals] = useState('');
    const [activeDoctor, setActiveDoctor] = useState('');
    const [numPatients, setNumPatients] = useState('');
    const [hospitalID, setHospitalID] = useState('');
    const [active, setActive] = useState(false);

    useEffect(() => {
        fetch('/api/hospital/getHospitalDetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.hospital) {
                    setHospitals(data.hospital.fullName);
                    if (data.hospital.doctors) setActiveDoctor(data.hospital.doctors.length);
                    else setActiveDoctor(0);
                    if (data.hospital.patients) setNumPatients(data.hospital.patients.length);
                    else setNumPatients(0);
                    setHospitalID(data.hospital._id);
                    setActive(data.hospital.active);
                }
            })
            .catch(err => {
                console.log(err);
            });
    } , []);
    return (
        <>
            <Navbar user={user} navigation={navigation} userNavigation={userNavigation} />
            <div className="min-h-full">
                <main>
                    <div className="bg-gray-200 font-sans h-screen w-full flex flex-col justify-center items-center">
                        {/* Logo Bệnh viện */}
                        <div className="w-32 h-32 rounded-full overflow-hidden mt-8">
                            <img
                                className="object-cover w-full h-full"
                                src="/hospital.png" // Đặt link logo bệnh viện của bạn ở đây
                                alt="Hospital Logo"
                            />
                        </div>

                        {/* Thông tin Bệnh viện */}
                        <div className="card w-full mt-6 mx-auto bg-white shadow-xl hover:shadow p-6 max-w-2xl">
                            <div className="text-center text-3xl font-bold mb-4">
                                {hospitals}
                            </div>
                            {
                                active ? (
                            <div className="grid grid-cols-1 gap-6">
                                <div className="py-2">
                                    <strong>Number of Doctors:</strong> {activeDoctor}
                                </div>
                                <div className="py-2">
                                    <strong>Number of Patients Managed:</strong> {numPatients}
                                </div>
                                <div className="py-2">
                                    <strong>ID:</strong> {hospitalID}
                                </div>
                                <div className="py-2">
                                    <strong>Operating Hours:</strong> T2 - CN : 24/24
                                </div>
                            </div>
                            ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="py-2">
                                            <strong>Chờ xác nhận</strong>
                                        </div>
                                        <div className="py-2">
                                            <strong>ID:</strong> {hospitalID}
                                        </div>
                                        <div className="py-2">
                                            <strong>Operating Hours:</strong> T2 - CN : 24/24
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
