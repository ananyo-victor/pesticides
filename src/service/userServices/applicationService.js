import mongoose from 'mongoose';
import fs from 'fs';
import Application from '../../models/application.js';
import JOB_POST from '../../models/job-post.js';
import { uploadToCloudinary } from '../../middlewares/multer/multerFile.js';

export const applyForJobService = async (req) => {
  try {
    const { coverLetter, location, hrId, experience, skills } = req.body;
    const userId = req.user.userId;

    const jobId = req.params.jobId;

    const existingApplication = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), jobId: new mongoose.Types.ObjectId(jobId) } },
      { $limit: 1 },
      { $project: { _id: 1 } }
    ]).then(data => data[0]);

    if (existingApplication) {
      return {
        success: false,
        message: 'User has already applied for this job.',
        application: existingApplication,
      };
    }

    // Upload files to Cloudinary
    let resumeUrl = null;

    if (req.files.resume) {
      const resumePath = req.files.resume[0].path;
      const resumeResult = await uploadToCloudinary(resumePath, 'resumes');
      resumeUrl = resumeResult.secure_url;
      fs.unlinkSync(resumePath); // Remove the file from the local storage
    }


    // console.log('resumeUrl',resumeUrl)
    // console.log('profilePicUrl',profilePicUrl)
    const newApplication = new Application({
      userId,
      jobId,
      hrId,
      resume: resumeUrl,
      coverLetter,
      location: JSON.parse(location),
      skills: JSON.parse(skills),
      status: 'Pending',
      experience: Number(experience),
    });

    await newApplication.save();

    return {
      success: true,
      message: 'Application submitted successfully!',
      application: newApplication,
    };

  } catch (error) {
    console.error('Error while applying for job:', error);
    return {
      success: false,
      message: 'Internal server error',
    };
  }
};

export const isJobAppliedService = async (req) => {
  try {
    const { jobId } = req.query;
    const userId = req.user.userId;

    const appliedJob = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), jobId: new mongoose.Types.ObjectId(jobId) } },
      { $project: { _id: 1 } }
    ]).then(data => data[0]);

    if (appliedJob) {
      return { applied: true, message: "Job is applied" };
    } else {
      return { applied: false, message: "Job is not applied" };
    }
  } catch (error) {
    console.error('Error checking job application:', error);
    return { applied: false, message: 'Internal server error' };
  }
};

export const getAppService = async (req) => {
  try {
    const { jobId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return { success: false, message: "Invalid Job ID" };
    }

    const applications = await Application.aggregate([
      { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          jobId: 1,
          "user.name": 1,
          "user.email": 1,
          "user.phoneNumber": 1,
          "user.education": 1,
          experience: 1,
          location: 1,
          appliedAt: 1,
          status: 1,
          resume: 1,
          skills: 1,
          coverLetter: 1
        }
      }
    ]);

    const jobData = await JOB_POST.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(jobId) } },
      { $project: { Title: 1, JobDescription: 1, Salary: 1, Location: 1 } }
    ]);

    if (!applications.length) {
      return { success: false, message: "No applications found for this job" };
    }

    return { success: true, applications, jobTitle: jobData[0].Title };

  } catch (error) {
    console.error("Error fetching applications:", error);
    return { success: false, message: 'Internal server error' };
  }
};