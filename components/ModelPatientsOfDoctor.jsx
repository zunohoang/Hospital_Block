import React from 'react'
import Modal from 'react-modal'
import { useEffect, useState } from 'react'

export default function ModelPatientsOfDoctor({ isModalOpen, handleModalClose, doctor }) {

    const [patients, setPatients] = useState([])
    const [patientId, setPatientId] = useState('');

    const handleInputChange = (event) => {
        setPatientId(event.target.value);
    };

    useEffect(() => {
        try {
            setPatients(doctor.patients)
        } catch (error) {
            console.log(error);
        }
    }, [doctor])

    const handleRemovePatientFromDoctor = (patientId, doctorId) => {
        fetch('/api/hospital/removePatientFromDoctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                doctorId: doctorId,
                patientId: patientId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // remove patient from patients list
                    const newPatients = patients.filter(patient => patient._id !== patientId)
                    setPatients(newPatients)
                } else {
                    alert(data.message)
                }
            })
    }

    const handleAddPatientToDoctor = (doctorId) => {
        console.log(patientId, doctorId)
        fetch('/api/hospital/addPatientToDoctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({
                doctorId: doctorId,
                patientId: patientId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // add patient to patients list
                    var newPatient = { _id: patientId, fullName: data.patient.fullName }
                    setPatients([...patients, newPatient])
                } else {
                    alert(data.message)
                }
            })
    }


    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            contentLabel="Confirm Modal"
            style={{
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '4px',
                    outline: 'none'
                },
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                }
            }}
        >
            <div>
                <h1 className='text-md font-bold tracking-tight text-gray-900'>The patient list is managed by doctor {doctor.fullName} (ID: {doctor._id})</h1>
                <br></br>
                <div className='flex gap-5'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    patients.map((patient, index) => (
                                        doctor.active == true ? (
                                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                                <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                                    <div className="ps-3">
                                                        <div className="text-base font-semibold">{patient.fullName}</div>
                                                        <div className="font-normal text-gray-500">ID: {patient._id}</div>
                                                    </div>
                                                </th>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleRemovePatientFromDoctor(patient._id, doctor._id)}>Remove patient from doctor</p>
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
                    <div className="shadow-md p-5">
                        <p className="text-md font-bold tracking-tight text-gray-900">ADD PATIENT</p>
                        <input type="text" className="text-black bg-slate-50 p-2 rounded border border-gray-300 block mb-1 mt-3 box-border" value={patientId}
                            onChange={handleInputChange} placeholder="Enter patient ID" />
                        <button className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block box-border" onClick={() => handleAddPatientToDoctor(doctor._id)}>+ Add patient to doctor</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}