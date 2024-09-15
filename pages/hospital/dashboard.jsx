import Navbar from '../../components/Navbar';

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
                                src="https://via.placeholder.com/150" // Đặt link logo bệnh viện của bạn ở đây
                                alt="Hospital Logo"
                            />
                        </div>

                        {/* Thông tin Bệnh viện */}
                        <div className="card w-full mt-6 mx-auto bg-white shadow-xl hover:shadow p-6 max-w-2xl">
                            <div className="text-center text-3xl font-bold mb-4">
                                City Health Clinic
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="py-2">
                                    <strong>Number of Doctors:</strong> 45
                                </div>
                                <div className="py-2">
                                    <strong>Number of Patients Managed:</strong> 2000
                                </div>
                                <div className="py-2">
                                    <strong>ID:</strong> 12345ABC
                                </div>
                                <div className="py-2">
                                    <strong>Operating Hours:</strong> Mon-Fri: 8:00 AM - 5:00 PM
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
