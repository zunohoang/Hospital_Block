import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
    active: { type: Boolean, default: true }
});

const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', hospitalSchema);

export default Hospital;
