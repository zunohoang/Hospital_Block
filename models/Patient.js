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
    shareRecord: [{ type: String, default: '', required: true }],
    active: { type: Boolean, default: false, required: true }
});

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient;