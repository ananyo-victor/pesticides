import mongoose from "mongoose";
import JOB_POST from "../../models/job-post.js";
import User from "../../models/user.js";

export const getJobsService = async (page, limit) => {
    try {
        const skip = (page - 1) * limit;
        const jobs = await JOB_POST.find({isActive: true }).skip(skip).limit(limit);
        return jobs;
    } catch (error) {
        throw new Error(error.message);
    }
};

/**
 * Get job post by ID with HR details
 */
export const getJobByIdService = async (id, userId) => {
    try {
        // console.log(userId);
        const job = await JOB_POST.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    isActive: true,
                }
            },
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
                    createdAt: 1,
                    Vacancy: 1,
                    HRId: 1,
                    "hrDetails.name": 1,
                    "hrDetails.companyName": 1,
                    "hrDetails.email": 1,
                    "hrDetails.phoneNumber": 1,
                },
            },
        ]);
        const resume = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $project: {
                    resumePath: 1,
                },
            }
        ]);
        job[0].resume = resume[0].resumePath;
        // console.log(job[0]);
        return job[0];
    } catch (error) {
        throw new Error(error.message);
    }
};