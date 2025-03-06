import mongoose from "mongoose";

const job_postSchema = new mongoose.Schema({
    CompanyName: {
        type: String,
        required: true,
    },
    Title: {
        type: String,
        required: true,
    },
    JobType: {
        type: String,
        required: true,    
    },
    Location: {
        type: [String],
        required: true,
    },
    JobDescription: {
        type: String,
        required: true,
    },
   
    Salary : {
        type : Number,
        required: true
    },
    Experience : {
        type : Number,
        required: true
    },
    SkillsReq :{
        type : [String],
        required: true
    },
    Vacancy: {
        type : Number,
        required: true
    },
    LastDate :{
        type : Date,
        required: true
    },
    HRId: { type: mongoose.Schema.Types.ObjectId, ref: "HR", required: true } 
    
}, { timestamps: true });

const JOB_POST = mongoose.model('JOB_POST', job_postSchema);
export default JOB_POST;