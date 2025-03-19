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
        type: [String],
        required: true
    },
    resumePath: {
        type: String,
        required: false,
    },
    profilePic: {
        type: String,
        required: false,
    },
    experience: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role : {
        type: String,
        require: true,
    },
    stripeCustomerId: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;