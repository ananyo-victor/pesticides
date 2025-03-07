import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // User model se reference lega
        required: true,
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JOB_POST",  // Job Post model se reference lega
        required: true,
    },
    saved_at: {
        type: Date,
        default: Date.now,  // By default current time store karega
    },
}, { timestamps: true });

const SAVED_JOB = mongoose.model('SAVED_JOB', savedJobSchema);
export default SAVED_JOB;
