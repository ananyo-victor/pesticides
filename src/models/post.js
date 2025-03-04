import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true
    },
    salary: {
        type: Number,
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
    hrId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HR',
        required: true,
    },
    applicantsID: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;