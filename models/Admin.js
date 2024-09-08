import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
