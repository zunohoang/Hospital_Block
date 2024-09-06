// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: String,
    addressWallet: String,
    role: String,
    cccd: String,
    birthYear: String,
    hometown: String,
    hospital: String,
    file: String,
    txHash: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;