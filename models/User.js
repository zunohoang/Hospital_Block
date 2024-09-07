// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    addressWallet: { type: String, required: true },
    role: { type: String, required: true },
    cccd: { type: String, required: true },
    birthYear: { type: String, required: true },
    hometown: { type: String, required: true },
    hospital: { type: String, default: " " },
    file: { type: String, default: "null" },
    txHash: { type: String, required: true }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;