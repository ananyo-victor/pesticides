import mongoose from "mongoose";
import JOB_POST from "../../models/job-post.js";
import User from "../../models/user.js";
import Application from "../../models/application.js";

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
export const getJobByIdService = async (id, userId) => {
    try {
        // console.log(userId);
        const job = await JOB_POST.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
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

export const getAppliedJobByIdService = async (id) => {
    try {
        const job = await Application.aggregate([
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: "job_posts",
                        localField: "jobId",
                        foreignField: "_id",
                        as: "job"
                    }
                },
                { $unwind: "$job" },
                {
                    $lookup: {
                        from: "hrs",
                        localField: "hrId",
                        foreignField: "_id",
                        as: "hrDetails"
                    }
                },
                { $unwind: "$hrDetails" },
                {
                    $project: {
                        resume: 1,
                        coverLetter: 1,
                        location: 1,
                        skills: 1,
                        location: 1,
                        experience: 1,
                        'job._id': 1,
                        'job.Title': 1,
                        'job.JobType': 1,
                        'job.Location': 1,
                        'job.Salary': 1,
                        'job.Experience': 1,
                        'job.JobDescription': 1,
                        'job.LastDate': 1,
                        'job.createdAt': 1,
                        'job.Vacancy': 1,
                        'job.HRId': 1,
                        "hrDetails.name": 1,
                        "hrDetails.companyName": 1,
                        "hrDetails.email": 1,
                        "hrDetails.phoneNumber": 1
                    }
                }
            ]
        ]);
        // console.log(job[0])
        return job[0];
    } catch (error) {
        throw new Error(error.message);
    }
}