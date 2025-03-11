import {Types} from 'mongoose'; 
import mongoose from "mongoose";
import Application from '../../models/application.js';

export const AppliedJobsService = async (req, res) => {
    try {
        const userId = req.user.userId;
  
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
  
        const appliedJobs = await Application.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  
            {
                $lookup: {
                    from: "job_posts",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
  
            { $unwind: "$jobDetails" },
  
            {
                $project: {
                    _id: 1,
                    status: 1,
                    appliedAt: 1,
                    "jobDetails.CompanyName": 1,
                    "jobDetails.Title": 1,
                    "jobDetails.JobType": 1,
                    "jobDetails.Location": 1,
                    "jobDetails.Salary": 1,
                    "jobDetails.Experience": 1
                }
            }
        ]); 
  
        return {
          status: 201,
          message: 'Applied Job!',
          appliedJobs : appliedJobs,
        };
      }catch (error) {
          console.error('Error fetching applied jobs:', error);
          res.status(500).json({ error: 'Internal server error at service' });
      }
    };