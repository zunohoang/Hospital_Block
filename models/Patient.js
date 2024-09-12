// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
    idNumber: { type: String, required: true },
    birthYear: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
});

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;