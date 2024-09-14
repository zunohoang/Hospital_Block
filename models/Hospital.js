import mongoose from "mongoose";


const hospitalSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: [] }],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: [] }],
    shareRecord: [{ type: String, default: '', required: true }],
    active: { type: Boolean, default: true, required: true }
});

const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', hospitalSchema);

export default Hospital;
