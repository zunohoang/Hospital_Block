import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
    idNumber: { type: String, required: true },
    birthYear: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    urlDocument: { type: String, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }]
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

export default Doctor;