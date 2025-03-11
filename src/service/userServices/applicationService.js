import Application from '../../models/application.js';
import path from 'path';
import mongoose from "mongoose";
import { Types } from "mongoose";

export const applyForJobService = async (req, res) => {
  try {
    console.log("Application page is here");
    console.log("Request body: ", req.body);

    const { coverLetter, location, hrId, experience } = req.body;
    const userId = req.user.userId;
    const jobId = req.params.jobId;

    // console.log("User ID: ", userId);
    // console.log("Job ID: ", jobId);
    console.log("resume", req.files.resume ? req.files.resume[0].path : null);

    const existingApplication = await Application.findOne({ userId, jobId });

    if (existingApplication) {
      return {
        status: 400,
        message: 'User has already applied for this job.',
        application: existingApplication,
      };
    }

    const newApplication = new Application({
      userId,
      jobId,
      hrId,
      resume: req.files.resume ? req.files.resume[0].path : null,
      coverLetter,
      location: JSON.parse(location),
      status: 'Pending',
      experience: Number(experience)
    });

    await newApplication.save();

    return {
      status: 201,
      message: 'Application submitted successfully!',
      application: newApplication,
    };

  } catch (error) {
    console.error('Error while applying for job:', error);
    return {
      status: 500,
      message: 'Internal server error',
    };
  }
};
