import mongoose from "mongoose";
import JOB_POST from "../../models/job-post.js";

/**
 * Create a new job post
 */
export const createJobPostService = async (jobData, hrId) => {
    try {
        const newJob = new JOB_POST({ ...jobData, HRId: hrId });
        await newJob.save();
        return { success: true, job: newJob };
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Get all job posts
 */
export const getJobsService = async () => {
    try {
        return await JOB_POST.find();
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Get job post by ID with HR details
 */
export const getJobByIdService = async (id) => {
    try {
        const job = await JOB_POST.aggregate([
            { $match: { _id:new mongoose.Types.ObjectId(id)} },
            {
                $lookup: {
                    from: "hr",
                    localField: "HRId",
                    foreignField: "_id",
                    as: "hrDetails",
                },
            },
            // { $unwind: "$hrDetails" },
            {
                $project: {
                    _id: 1,
                    Title: 1,
                    JobType: 1,
                    Location: 1,
                    Salary: 1,
                    Experience: 1,
                    JobDescription: 1,
                    "hrDetails.name": 1,
                    "hrDetails.companyName": 1,
                    "hrDetails.email": 1,
                    "hrDetails.phoneNumber": 1,
                },
            },
        ]);
        return job;
    } catch (error) {
        throw new Error(error.message);
    }
};
