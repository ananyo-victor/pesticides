import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JOB_POST',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hrId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'HR',
        required:true,
    },
    resume: {
        type: String,
        required: false,
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
        type: [String],
        require: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
      },
      experience : {
        type : Number,
        required : true,
      }
}, { timestamps: true });

const Application = mongoose.model('Application', userSchema);
export default Application;