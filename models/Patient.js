// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
    idNumber: { tupe: String, required: true },
    birthYear: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    hospital: { type: String, default: " " },
    doctor: { type: String, default: " " },
});

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;