import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    userSend_fullName: { type: String, required: true },
    userSend_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userReceive_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    recordName: { type: String, required: true },
    message: { type: String, required: true },
});

const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);

export default Record;
