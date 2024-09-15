import Navbar from '../../components/Navbar';

const user = {
    name: 'Admin',
    email: 'admin@admin.com',
    imageUrl: 'https://cdn-icons-png.freepik.com/512/219/219986.png',
}
const navigation = [
    { name: 'Dashboard', href: 'dashboard', current: true },
    { name: 'Hospitals', href: 'hospitals', current: false },
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
            </div>
        </>
    )
}
