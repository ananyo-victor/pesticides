import mongoose from "mongoose";

const hrSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    role : {
        type : String,
        required: true
    },
}, { timestamps: true });

const HR = mongoose.models.HR || mongoose.model('HR', hrSchema);
export default HR;