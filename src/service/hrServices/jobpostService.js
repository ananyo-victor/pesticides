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
 * Get all job posts with pagination
 */
export const getJobsService = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const jobs = await JOB_POST.find({ isActive: true }).skip(skip).limit(limit);
        return jobs;
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
            { $match: { _id: new mongoose.Types.ObjectId(id),
                isActive: true,
            } },
            {
                $lookup: {
                    from: "hrs",
                    localField: "HRId",
                    foreignField: "_id",
                    as: "hrDetails",
                },
            },
            { $unwind: "$hrDetails" },
            {
                $project: {
                    _id: 1,
                    Title: 1,
                    JobType: 1,
                    Location: 1,
                    Salary: 1,
                    Experience: 1,
                    JobDescription: 1,
                    LastDate: 1,
                    createdAt:1,
                    Vacancy: 1,
                    HRId: 1,
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