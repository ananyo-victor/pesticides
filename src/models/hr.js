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
    cinNumber: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const HR = mongoose.model('HR', hrSchema);
export default HR;