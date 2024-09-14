import React, { useState } from 'react';
import ModelPatientsOfDoctor from '../ModelPatientsOfDoctor';


export default function DoctorRow({ doctor, index, handleDelete }) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalPatientOf = (doctorId) => {
        setIsModalOpen(true);
    };

    return (
        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                <div className="ps-3">
                    <div className="text-base font-semibold">{doctor.fullName}</div>
                    <div className="font-normal text-gray-500">ID: {doctor._id}</div>
                </div>
            </th>
            <td className="px-6 py-4">
                {doctor.hospital.fullName}
            </td>
            <td className="px-6 py-4">
                {doctor.patients.length}
            </td>
            <td className="px-6 py-4">
                <ModelPatientsOfDoctor isModalOpen={isModalOpen} handleModalClose={handleModalClose} doctor={doctor} />
                <p className="font-medium text-green-600 dark:text-blue-500 hover:underline" onClick={() => handleModalPatientOf(doctor._id)}>Patient Management</p>
                <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleDelete(doctor._id)}>Delete</p>
            </td>
        </tr>
    )
}