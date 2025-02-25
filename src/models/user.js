import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
        required: true
    },
    resumePath: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role : {
        type: String,
        require: true,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;