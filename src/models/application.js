import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    hrId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'hr',
        required:true,
    },
    resume: {
        type: String,
        required: true,
    },
    skills: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Accepted', 'Rejected'],
        default: 'Pending',
    },
    location : {
        type: String,
        require: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
      },
}, { timestamps: true });

const Application = mongoose.model('Application', userSchema);
export default Application;